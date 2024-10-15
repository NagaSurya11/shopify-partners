import { Component } from 'react';

import styles from './bundle-table.module.scss';
import Table from '../../../table/table';
import { BundleTableAction } from './types/enums';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { Bundle, BundleTableInput, BundleTableProps, BundleTableState } from './types/interfaces';
import { cloneDeep, debounce } from 'lodash';
import { BundleTableColumns, BundleTableFilterOptions, DefaultBundleTableInput } from './types/constants';
import { PageSize, TableBodyActions, TableFooterActions, TableHeaderEvents } from '../../../table/types/enums';
import { FilterOptions, FilterOutputType, Sort } from '../../../table/types/interfaces';
import { withApolloClient } from '../../../graphql-client/hooks';
import { withRouter } from '../../../routing/hooks';
import { connect } from 'react-redux';
import { notificationActions } from '../../../slices/notification.slice';
import { DashboardRepository } from '../../repositories';
import { SubscriptionLike } from 'rxjs';
import FuzzySearch from 'fuzzy-search';
import { CustomAlertComponent } from '../../../custom-alert/custom-alert-component';
import { ViewDetails } from '../../../view-details/view-details';

export class BundleTable extends Component<BundleTableProps, BundleTableState> {
  private dashboardRepository: DashboardRepository;
  private subscriptions: SubscriptionLike[];
  constructor(props: BundleTableProps) {
    super(props);
    this.state = {
      tableInput: cloneDeep(DefaultBundleTableInput),
      tableOutput: {
        rows: [],
        totalRows: 0
      },
      tableRows: [],
      isTableLoading: false,
      selectedRows: new Set(),
      isFilterLoading: false,
      isBundleFilterOpened: false,
      filterOptions: cloneDeep(BundleTableFilterOptions),
      isDeleteDialogOpened: false,
      deleteDialogData: null,
      isViewDetailsOpened: false,
      isViewDetailsLoading: false
    };
    this.handleTableEvents = this.handleTableEvents.bind(this);
    this.handleTableFilterClose = this.handleTableFilterClose.bind(this);
    this.handleFilterMultiSelectionNext = this.handleFilterMultiSelectionNext.bind(this);
    this.handleResetTable = this.handleResetTable.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handlePageNumberChange = this.handlePageNumberChange.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleOpenFilter = this.handleOpenFilter.bind(this);
    this.handleTableFilterClose = this.handleTableFilterClose.bind(this);
    this.handleDeleteBundles = this.handleDeleteBundles.bind(this);
    this.onDeleteDialogClose = this.onDeleteDialogClose.bind(this);
    this.clearCacheAndRefresh = this.clearCacheAndRefresh.bind(this);
    this.onViewDetailsDialogClose = this.onViewDetailsDialogClose.bind(this);
    this.openViewDetailsDialog = this.openViewDetailsDialog.bind(this);

    this.dashboardRepository = new DashboardRepository(props.client);
    this.subscriptions = [];
  }

  handleResetTable() {
    let tableInput = cloneDeep(DefaultBundleTableInput);
    this.setState({ tableInput });
    this.fetchBundles(tableInput);
  }

  handleSearchChange(searchTerm: string) {
    this.setState({
      tableRows: new FuzzySearch(
        this.state.tableOutput.rows as object[],
        BundleTableColumns.filter(column => column.isSearchable)
          .map(column => column.name), {
        caseSensitive: false,
        sort: false
      }).search(searchTerm) as Bundle[]
    });
  }

  handleSort(sort: Sort) {
    let tableInput = cloneDeep(this.state.tableInput);
    tableInput.sort = sort;
    this.setState({ tableInput });
    this.fetchBundles(tableInput);
  }

  handlePageSizeChange(pageSize: PageSize) {
    let tableInput = cloneDeep(this.state.tableInput);
    tableInput.page.size = pageSize;
    tableInput.page.number = 1;
    this.setState({ tableInput });
    this.fetchBundles(tableInput);
  }

  handlePageNumberChange(pageNumber: number) {
    let tableInput = cloneDeep(this.state.tableInput);
    tableInput.page.number = pageNumber;
    this.setState({ tableInput });
    this.fetchBundles(tableInput);
  }

  handleSelectionChange(selectedRows: Set<string>) {
    this.setState({ selectedRows });
  }

  handleSelect(bundleId: string) {
    this.setState({ selectedRows: cloneDeep(this.state.selectedRows).add(bundleId) });
  }

  handleOpenFilter() {
    this.setState({
      isBundleFilterOpened: true,
      filterOptions: cloneDeep(BundleTableFilterOptions).map(option => {
        if (this.state.tableInput.filter) {
          switch (option.key) {
            case 'discount_percentage':
              if (this.state.tableInput.filter.discount_percentage) {
                return {
                  ...option,
                  data: {
                    ...option.data,
                    from: this.state.tableInput.filter.discount_percentage.from,
                    to: this.state.tableInput.filter.discount_percentage.to
                  }
                }
              }
              break;
            case 'bundle_price':
              if (this.state.tableInput.filter.bundle_price) {
                return {
                  ...option,
                  data: {
                    ...option.data,
                    from: this.state.tableInput.filter.bundle_price.from,
                    to: this.state.tableInput.filter.bundle_price.to
                  }
                }
              }
              break;
            case 'total_sold':
              if (this.state.tableInput.filter.total_sold) {
                return {
                  ...option,
                  data: {
                    ...option.data,
                    from: this.state.tableInput.filter.total_sold.from,
                    to: this.state.tableInput.filter.total_sold.to
                  }
                }
              }
              break;
          }
        }
        return option;
      })
    })
  }

  clearCacheAndRefresh() {
    this.props.client.clearStore().then((value) => {
      this.fetchBundles(this.state.tableInput);
      this.props.fetchCharts();
    })
  }

  handleDeleteBundles(bundleIds: Set<string>) {
    this.setState({ isTableLoading: true });
    const self = this;
    this.subscriptions.push(this.dashboardRepository.deleteBundles(Array.from(bundleIds))
      .subscribe({
        next(value) {
          if (value) {
            self.props.showNotification({
              severity: 'success',
              message: value.DeleteBundles
            })
            let selectedRows = cloneDeep(self.state.selectedRows);
            bundleIds.forEach(id => selectedRows.delete(id));
            self.setState({ selectedRows });
            self.clearCacheAndRefresh();
          } else {
            self.props.showNotification({
              severity: 'error',
              message: 'INTERNAL_SERVER_ERROR'
            })
            self.setState({ isTableLoading: false });
          }
        },
        error(err) {
          self.props.showNotification({
            severity: 'error',
            message: err.message
          });
          self.setState({ isTableLoading: false });
        },
      }));

  }

  handleTableEvents(event: BundleTableAction | TableHeaderEvents | TableBodyActions | TableFooterActions, payload?: any) {
    switch (event) {
      case BundleTableAction.RESET_TABLE:
        this.handleResetTable();
        break;
      case TableHeaderEvents.SEARCH_CHANGE:
        this.handleSearchChange(payload);
        break;
      case TableBodyActions.SORT_CHANGE:
        this.handleSort(payload);
        break;
      case TableFooterActions.PAGE_SIZE_CHANGE:
        this.handlePageSizeChange(payload);
        break;
      case TableFooterActions.PAGE_NUMBER_CHANGE:
        this.handlePageNumberChange(payload);
        break;
      case TableBodyActions.SELECTION_CHANGE:
        this.handleSelectionChange(payload);
        break;
      case BundleTableAction.SELECT:
        this.handleSelect(payload);
        break;
      case TableHeaderEvents.OPEN_FILTER:
        this.handleOpenFilter();
        break;
      case BundleTableAction.DELETE:
        this.setState({ deleteDialogData: new Set([payload]), isDeleteDialogOpened: true });
        break;
      case TableFooterActions.ACTION_TRIGGERED:
        this.setState({ deleteDialogData: this.state.selectedRows, isDeleteDialogOpened: true });
        break;
      // case BundleTableAction.VIEW_DETAILS:
      //   this.openViewDetailsDialog(payload);
      //   break;
      case BundleTableAction.MANAGE:
        this.props.router.navigate('/edit-bundle', {state: {bundleId: payload}});
        break;
    }
  }

  handleTableFilterClose(value?: FilterOutputType) {
    if (value) {
      let tableInput = cloneDeep(this.state.tableInput);
      tableInput.filter = value;
      tableInput.sort = undefined;
      tableInput.page = cloneDeep(DefaultBundleTableInput.page);
      this.setState({
        isBundleFilterOpened: false,
        filterOptions: [],
        tableInput
      });
      this.fetchBundles(tableInput);
    } else {
      this.setState({
        isBundleFilterOpened: false,
        filterOptions: []
      })
    }
  }

  handleFilterMultiSelectionNext(key: "sub1" | "sub2", value?: string) {
    // not needed
  }

  fetchBundles(input: BundleTableInput) {
    this.setState({ isTableLoading: true, selectedRows: new Set() })
    const self = this;
    this.subscriptions.push(
      this.dashboardRepository.listBundles(input)
        .subscribe({
          next(value) {
            if (value?.ListBundles) {
              self.setState({
                tableOutput: value.ListBundles,
                tableRows: value.ListBundles.rows,
                isTableLoading: false
              })
            } else {
              self.props.showNotification({
                severity: 'error',
                message: 'ERRORS.ERROR_FETCHING_DATA'
              });
            }
          },
          error(errorValue) {
            self.props.showNotification({
              severity: 'error',
              message: self.dashboardRepository.errorExtracter(errorValue)
            });
            self.setState({
              tableRows: [],
              isTableLoading: false
            })
          },
        })
    );
  }

  onDeleteDialogClose(value?: any) {
    if (value) {
      this.handleDeleteBundles(value);
    }
    this.setState({ isDeleteDialogOpened: false });
  }

  openViewDetailsDialog(bundleId: string) {
    this.setState({ isViewDetailsOpened: true, isViewDetailsLoading: true });
    const self = this;
    this.subscriptions.push(
      this.dashboardRepository.getBundleById(bundleId)
        .subscribe({
          next(value) {
            if (value) {
              self.setState({ bundleDetails: value.GetBundleById });
            } else {
              self.props.showNotification({
                message: 'INTERNAL_SERVER_ERROR',
                severity: 'error'
              });
            }
            self.setState({ isViewDetailsLoading: false });
          },
          error(errorValue) {
            self.props.showNotification({
              message: self.dashboardRepository.errorExtracter(errorValue),
              severity: 'error'
            });
          },
        })
    );
  }

  onViewDetailsDialogClose(value?: string) {
    if (value) {
      this.handleSelect(value);
    }
    this.setState({ isViewDetailsOpened: false });
  }

  override componentDidMount(): void {
    this.fetchBundles(this.state.tableInput);
  }

  override componentWillUnmount(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }

  override render() {
    return (
      <div>
        <Table
          headerData={{
            title: 'DASHBOARD.BUNDLE_TABLE.TITLE',
            editModeList: [{
              i18nKey: 'DASHBOARD.BUNDLE_TABLE.HEADER.ACTIONS.RESET_TABLE',
              action: BundleTableAction.RESET_TABLE,
              iconPosition: 'start',
              icon: RestartAltOutlinedIcon
            }],
            canShowFilter: true,
            isFilterApplied: this.state.tableInput.filter && Object.keys(this.state.tableInput.filter).length > 0,
            onTableHeaderEvents: this.handleTableEvents
          }}

          rootData={{
            idColumnName: 'bundle_id',
            columns: cloneDeep(BundleTableColumns),
            rows: this.state.tableRows,
            actions: [
              // {
              //   action: BundleTableAction.VIEW_DETAILS,
              //   i18nKey: 'DASHBOARD.BUNDLE_TABLE.ROW_ACTION.VIEW_DETAILS'
              // },
              {
                action: BundleTableAction.MANAGE,
                i18nKey: 'DASHBOARD.BUNDLE_TABLE.ROW_ACTION.MANAGE'
              },
              {
                action: BundleTableAction.SELECT,
                i18nKey: 'DASHBOARD.BUNDLE_TABLE.ROW_ACTION.SELECT'
              },
              {
                action: BundleTableAction.DELETE,
                i18nKey: 'DASHBOARD.BUNDLE_TABLE.ROW_ACTION.DELETE',
                warn: true
              }
            ],
            hasSelect: true,
            isLoading: this.state.isTableLoading,
            sort: this.state.tableInput.sort,
            selectedRows: this.state.selectedRows,
            onTableBodyEvents: this.handleTableEvents
          }}

          footerData={{
            pageNumber: this.state.tableInput.page.number,
            pageSize: this.state.tableInput.page.size,
            totalRows: this.state.tableOutput.totalRows,
            actionButtonState: {
              title: 'DASHBOARD.BUNDLE_TABLE.FOOTER.ACTION_BTN',
              isVisible: this.state.selectedRows.size > 0,
              warn: true
            },
            onTableFooterEvents: this.handleTableEvents
          }}

          filterData={{
            dialogTitle: 'DASHBOARD.BUNDLE_TABLE.FILTER.TITLE',
            isLoading: this.state.isFilterLoading,
            isOpened: this.state.isBundleFilterOpened,
            onClose: this.handleTableFilterClose,
            onMultiSelectionNext: this.handleFilterMultiSelectionNext,
            options: this.state.filterOptions
          }} />
        <CustomAlertComponent
          dialogTitle='DASHBOARD.BUNDLE_TABLE.DELETE_BUNDLE.DIALOG.TITLE'
          cancelText='DASHBOARD.BUNDLE_TABLE.DELETE_BUNDLE.DIALOG.CANCEL_TEXT'
          confirmText='DASHBOARD.BUNDLE_TABLE.DELETE_BUNDLE.DIALOG.CONFIRM_TEXT'
          contentText='DASHBOARD.BUNDLE_TABLE.DELETE_BUNDLE.DIALOG.CONTEXT_TEXT'
          isOpened={this.state.isDeleteDialogOpened}
          onClose={this.onDeleteDialogClose}
          data={this.state.deleteDialogData}
          warn={true}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  showNotification: notificationActions.showNotification
}

export default connect(null, mapDispatchToProps)(withRouter(withApolloClient(BundleTable)));
