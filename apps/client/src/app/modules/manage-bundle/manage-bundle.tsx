import { ChangeEvent, Component } from 'react';

import styles from './manage-bundle.module.scss';
import { BundleOutput, BundleSearchOption, CreateBundleInput, ListProductsInput, ManageBundleProps, Product, TotalPriceAndDiscountPriceInput } from './types/interfaces';
import { ManageBundleRepository } from './repositories';
import { PageSize, TableBodyActions, TableFooterActions, TableHeaderEvents } from '../table/types/enums';
import { SubscriptionLike } from 'rxjs';
import Table from '../table/table';
import { BundleLimitReactedDialogProps, BundleSummaryTableColumns, BundleSummaryTableHeaderConfig, categoryFilterOption, DefaultListProductTableInput, listProductsViewDetailsDialogData, ListProductTableColumns, priceFilterOption, ProductTableHeaderConfig, productTableRowActions, ratingsFilterOption } from './types/constants';
import { BundleTableHeaderAction, ProductTableHeaderActions, ProductTableRowActions } from './types/enums';
import { cloneDeep, debounce } from 'lodash';
import { BetweenInputData, FilterOptions, FilterOutputType, MultiSelection, SelectionInput, Sort } from '../table/types/interfaces';
import { ManageBundleStateInterface } from './types/interfaces';
import FuzzySearch from 'fuzzy-search';
import { I18nContext } from 'react-i18next';
import ViewDetails from '../view-details/view-details';
import { Autocomplete, Button, CircularProgress, TextField } from '@mui/material';
import CustomAlertComponent from '../custom-alert/custom-alert-component';
import { connect } from 'react-redux';
import { notificationActions } from '../slices/notification.slice';
import { withApolloClient } from '../graphql-client/hooks';
import { withRouter } from '../routing/hooks';

export class ManageBundleCore extends Component<ManageBundleProps, ManageBundleStateInterface> {

  private manageBundleRepo: ManageBundleRepository;
  private subscriptions: SubscriptionLike[];
  constructor(props: ManageBundleProps) {
    super(props);
    console.log('Mode', props.mode);
    this.manageBundleRepo = new ManageBundleRepository(props.client);
    this.subscriptions = [];
    this.state = {
      listProductsInput: cloneDeep(DefaultListProductTableInput),
      listProductsOutput: {
        rows: [],
        totalRows: 0
      },
      selectedProducts: new Set(),
      isProductsTableLoading: false,
      productFilterData: {
        dialogTitle: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_FILTER.TITLE',
        isOpened: false,
        onClose: this.handleProductsTableFilterClose.bind(this),
        options: cloneDeep([
          categoryFilterOption,
          ratingsFilterOption,
          priceFilterOption
        ]),
        onMultiSelectionNext: this.handleProductFilterMultiSelectionNext.bind(this),
        isLoading: false
      },
      listProductRows: [],
      listProductsViewDetailsDialogData: {
        ...listProductsViewDetailsDialogData,
        onClose: this.listProductsOnDialogClose.bind(this)
      },
      bundleProductsSet: new Set(),
      bundleLimitWarningDialogProps: {
        ...BundleLimitReactedDialogProps,
        onClose: this.handleMaxLimitDialogReachedDialogOnClose.bind(this)
      },
      bundleProductsInput: cloneDeep(DefaultListProductTableInput),
      bundleProductsOutput: {
        rows: [],
        totalRows: 0
      },
      isBundleTableLoading: false,
      bundleProductRows: [],
      bundleTableSelectedRows: new Set(),
      bundleProductFilterData: {
        dialogTitle: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_FILTER.TITLE',
        isOpened: false,
        onClose: this.handleBundleTableFilterClose.bind(this),
        options: cloneDeep([
          categoryFilterOption,
          ratingsFilterOption,
          priceFilterOption
        ]),
        onMultiSelectionNext: this.handleBundleFilterMultiSelectionNext.bind(this),
        isLoading: false
      },
      bundleTableQuantityMap: new Map(),
      bundleDiscountPercentage: 0,
      bundleActualPrice: 0,
      bundleTotalPrice: 0,
      bundleName: '',
      bundleSearchOptions: [],
      isBundleSearchLoading: false,
      isBundleSearchOpened: false,
      bundleSearchTerm: ''
    }
    this.updateBundlePrice = debounce(this.updateBundlePrice.bind(this), 200);
    this.createBundle = this.createBundle.bind(this);
    this.updateBundle = this.updateBundle.bind(this);
    this.handleBundleSearchOpen = this.handleBundleSearchOpen.bind(this);
    this.handleBundleSearchClose = this.handleBundleSearchClose.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.fetchBundleDataForSearch = debounce(this.fetchBundleDataForSearch.bind(this), 300);
  }
  handleFilterFetchMainCategories() {
    const self = this;
    this.setState({ productFilterData: { ...this.state.productFilterData, isLoading: true, subList: [] } });
    this.subscriptions.push(
      this.manageBundleRepo.getMainCategories()
        .subscribe({
          next(value) {
            self.setState({ productFilterData: { ...self.state.productFilterData, isLoading: false, subList: value?.GetMainCategories } });
          },
          error(errorValue) {
            console.error(errorValue);
            self.setState({ productFilterData: { ...self.state.productFilterData, isLoading: false } });
          },
        })
    )

  }
  handleFilterFetchSubCategories(categoryName: string) {
    const self = this;
    this.setState({ productFilterData: { ...this.state.productFilterData, isLoading: true, subList: [] } });
    this.subscriptions.push(
      this.manageBundleRepo.getSubCategories(categoryName)
        .subscribe({
          next(value) {
            self.setState({ productFilterData: { ...self.state.productFilterData, isLoading: false, subList: value?.GetSubCategories } });
          },
          error(errorValue) {
            console.error(errorValue);
            self.setState({ productFilterData: { ...self.state.productFilterData, isLoading: false } });
          },
        })
    )
  }
  handleProductFilterMultiSelectionNext(key: 'sub1' | 'sub2', value?: string) {
    switch (key) {
      case 'sub1':
        this.handleFilterFetchMainCategories();
      case 'sub2':
        if (value) {
          this.handleFilterFetchSubCategories(value);
        }
    }
  }

  handleBundleFilterFetchMainCategories() {
    const self = this;
    this.setState({ bundleProductFilterData: { ...this.state.bundleProductFilterData, isLoading: true, subList: [] } });
    this.subscriptions.push(
      this.manageBundleRepo.getMainCategories(Array.from(this.state.bundleProductsSet))
        .subscribe({
          next(value) {
            self.setState({ bundleProductFilterData: { ...self.state.bundleProductFilterData, isLoading: false, subList: value?.GetMainCategories } });
          },
          error(errorValue) {
            console.error(errorValue);
            self.setState({ bundleProductFilterData: { ...self.state.bundleProductFilterData, isLoading: false } });
          },
        })
    )

  }
  handleBundleFilterFetchSubCategories(categoryName: string) {
    const self = this;
    this.setState({ bundleProductFilterData: { ...this.state.bundleProductFilterData, isLoading: true, subList: [] } });
    this.subscriptions.push(
      this.manageBundleRepo.getSubCategories(categoryName, Array.from(this.state.bundleProductsSet))
        .subscribe({
          next(value) {
            self.setState({ bundleProductFilterData: { ...self.state.bundleProductFilterData, isLoading: false, subList: value?.GetSubCategories } });
          },
          error(errorValue) {
            console.error(errorValue);
            self.setState({ bundleProductFilterData: { ...self.state.bundleProductFilterData, isLoading: false } });
          },
        })
    )
  }

  handleBundleFilterMultiSelectionNext(key: 'sub1' | 'sub2', value?: string) {
    switch (key) {
      case 'sub1':
        this.handleBundleFilterFetchMainCategories();
      case 'sub2':
        if (value) {
          this.handleBundleFilterFetchSubCategories(value);
        }
    }
  }
  handleProductTableSearch(pattern?: string) {
    this.setState({
      listProductRows: new FuzzySearch(
        this.state.listProductsOutput.rows as object[],
        ListProductTableColumns.filter(column => column.isSearchable)
          .map(column => column.name), {
        caseSensitive: false,
        sort: false
      }).search(pattern) as Product[]
    });
  }

  fetchProducts(listProductsInput: ListProductsInput) {
    const self = this;
    this.setState({ isProductsTableLoading: true, selectedProducts: new Set() });
    this.subscriptions.push(
      this.manageBundleRepo.listProducts(listProductsInput)
        .subscribe({
          next(value) {
            if (value?.ListProducts) {
              self.setState({
                listProductsOutput: value.ListProducts,
                isProductsTableLoading: false,
                listProductRows: value.ListProducts.rows
              });
            }
          },
          error(errorValue) {
            console.error(errorValue);
            self.setState({
              listProductsOutput: { rows: [], totalRows: 0 },
              isProductsTableLoading: false,
              listProductRows: []
            });
          }
        })
    )
  }

  setBundleData(bundle: BundleOutput) {
    let quantityMap = cloneDeep(this.state.bundleTableQuantityMap);
    quantityMap.clear();
    bundle.Products.forEach(({ product_id, quantity }) => {
      quantityMap.set(product_id, quantity);
    });
    this.setState({ bundleId: bundle.bundle_id, bundleName: bundle.name, bundleDiscountPercentage: bundle.discount_percentage, bundleTableQuantityMap: quantityMap, bundleProductsSet: new Set(quantityMap.keys()) });
    let listProductsInput = cloneDeep(DefaultListProductTableInput);
    listProductsInput.filter = {
      selectedProductIds: Array.from(quantityMap.keys())
    };
    this.fetchProductsForBundleTable(listProductsInput, true, bundle.discount_percentage);
  }

  fetchBundleById(bundle_id: string) {
    const self = this;
    this.subscriptions.push(
      this.manageBundleRepo.getBundleById(bundle_id)
        .subscribe({
          next(value) {
            if (value?.GetBundleById) {
              self.setBundleData({ ...value.GetBundleById, bundle_id })
            }
          },
        })
    );
  }

  override componentDidMount(): void {
    this.fetchProducts(cloneDeep(DefaultListProductTableInput));
    if (this.props.router.location.state && this.props.router.location.state.bundleId) {
      this.fetchBundleById(this.props.router.location.state.bundleId);
    }
  }

  override componentWillUnmount(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.setState({bundleId: undefined});
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }

  resetProductsTable() {
    let listProductsInput = cloneDeep(DefaultListProductTableInput);
    this.setState({
      listProductsInput
    });
    this.fetchProducts(listProductsInput);
  }

  getCategoryFilterOption(): FilterOptions {
    let result = cloneDeep(categoryFilterOption);
    result.data = result.data as MultiSelection;
    result.data.selectedOptions = cloneDeep(this.state.listProductsInput.filter?.categories ?? []) as Array<SelectionInput>;
    return result;
  }

  getRatingsFilterOption(): FilterOptions {
    let result = cloneDeep(ratingsFilterOption);
    result.data = result.data as BetweenInputData;
    if (this.state.listProductsInput.filter?.ratings) {
      result.data.from = this.state.listProductsInput.filter.ratings.from;
      result.data.to = this.state.listProductsInput.filter.ratings.to;
    }
    return result;
  }

  getPriceFilterOption(): FilterOptions {
    let result = cloneDeep(priceFilterOption);
    result.data = result.data as BetweenInputData;
    if (this.state.listProductsInput.filter?.actualPrice) {
      result.data.from = this.state.listProductsInput.filter.actualPrice.from;
      result.data.to = this.state.listProductsInput.filter.actualPrice.to;
    }
    return result;
  }

  openProductsFilterDialog() {
    let productFilterData = cloneDeep(this.state.productFilterData);
    productFilterData.isOpened = true;
    productFilterData.options = [
      this.getCategoryFilterOption(),
      this.getRatingsFilterOption(),
      this.getPriceFilterOption()
    ];
    this.setState({ productFilterData });
  }

  handleProductTableHeaderEvents(event: TableHeaderEvents | ProductTableHeaderActions, payload?: any) {
    switch (event) {
      case TableHeaderEvents.SEARCH_CHANGE:
        this.handleProductTableSearch(payload);
        break;
      case TableHeaderEvents.OPEN_FILTER:
        this.openProductsFilterDialog();
        break;
      case ProductTableHeaderActions.SELECT_ALL_FILTERED:
        break;
      case ProductTableHeaderActions.RESET_TABLE:
        this.resetProductsTable();
        break;
    }
  }

  handleProductsTablePageSizeChange(pageSize: PageSize) {
    let listProductsInput: ListProductsInput = cloneDeep(this.state.listProductsInput);
    listProductsInput.page.size = pageSize;
    listProductsInput.page.number = 1;
    this.setState({ listProductsInput });
    this.fetchProducts(listProductsInput);
  }

  handleProductsTablePageNumberChange(pageNumber: number) {
    let listProductsInput: ListProductsInput = cloneDeep(this.state.listProductsInput);
    listProductsInput.page.number = pageNumber;
    this.setState({ listProductsInput });
    this.fetchProducts(listProductsInput);
  }

  handleProductsTableSortChange(sort: Sort) {
    let listProductsInput: ListProductsInput = cloneDeep(this.state.listProductsInput);
    listProductsInput.sort = sort;
    this.setState({ listProductsInput });
    this.fetchProducts(listProductsInput);
  }

  handleAddSelectedProductsToBundle(operation: 'merge' | 'replace') {
    let canFetch = true;
    let set = new Set<string>();
    switch (operation) {
      case 'merge':
        set = new Set([...this.state.selectedProducts, ...this.state.bundleProductsSet]);
        if (set.size > 500) {
          canFetch = false;
          this.setState({ bundleLimitWarningDialogProps: { ...this.state.bundleLimitWarningDialogProps, isOpened: true } })
        } else {
          this.setState({ bundleProductsSet: set });
        }
        break;
      case 'replace':
        set = cloneDeep(this.state.selectedProducts);
        this.setState({ bundleProductsSet: set });
        break;
    }
    if (canFetch) {
      let bundleProductsInput = cloneDeep(this.state.bundleProductsInput);
      if (!bundleProductsInput.filter) {
        bundleProductsInput.filter = {};
      }
      bundleProductsInput.filter.selectedProductIds = Array.from(set);
      this.setState({ bundleProductsInput, selectedProducts: new Set() });
      this.fetchProductsForBundleTable(bundleProductsInput);
    }
  }

  handleProductTableFooterEvents(event: TableFooterActions, payload?: any) {
    switch (event) {
      case TableFooterActions.PAGE_SIZE_CHANGE:
        this.handleProductsTablePageSizeChange(payload);
        break;
      case TableFooterActions.PAGE_NUMBER_CHANGE:
        this.handleProductsTablePageNumberChange(payload);
        break;
      case TableFooterActions.ACTION_TRIGGERED:
        this.handleAddSelectedProductsToBundle('merge');
    }
  }

  handleProductsTableFilterClose(value?: FilterOutputType) {
    if (value) {
      let listProductsInput: ListProductsInput = cloneDeep(this.state.listProductsInput);
      listProductsInput.filter = value;
      listProductsInput.sort = undefined;
      listProductsInput.page = cloneDeep(DefaultListProductTableInput.page);
      this.setState(
        {
          productFilterData: {
            ...this.state.productFilterData,
            isOpened: false,
            options: []
          },
          listProductsInput
        });
      this.fetchProducts(listProductsInput);
    } else {
      this.setState(
        {
          productFilterData: {
            ...this.state.productFilterData,
            isOpened: false,
            options: []
          }
        });
    }

  }

  handleBundleTableFilterClose(value?: FilterOutputType) {
    if (value) {
      let bundleProductsInput: ListProductsInput = cloneDeep(this.state.bundleProductsInput);
      bundleProductsInput.filter = value;
      bundleProductsInput.page = cloneDeep(DefaultListProductTableInput.page);
      bundleProductsInput.sort = undefined;
      bundleProductsInput.filter.selectedProductIds = Array.from(this.state.bundleProductsSet);
      this.setState(
        {
          bundleProductFilterData: {
            ...this.state.bundleProductFilterData,
            isOpened: false,
            options: []
          },
          bundleProductsInput
        });
      this.fetchProductsForBundleTable(bundleProductsInput);
    } else {
      this.setState(
        {
          bundleProductFilterData: {
            ...this.state.bundleProductFilterData,
            isOpened: false,
            options: []
          }
        });
    }
  }

  listProductsOnDialogClose(value?: any) {
    if (value && this.state.currentProductId) {
      let selectedProducts = this.state.selectedProducts;
      selectedProducts.add(this.state.currentProductId);
      this.setState({ selectedProducts })
    }
    let listProductsViewDetailsDialogData = this.state.listProductsViewDetailsDialogData;
    listProductsViewDetailsDialogData.isOpened = false;
    this.setState({ listProductsViewDetailsDialogData, currentProductId: undefined });
  }

  openViewDetailsDialog(productId: string) {
    let listProductsViewDetailsDialogData = this.state.listProductsViewDetailsDialogData;
    listProductsViewDetailsDialogData.isOpened = true;
    listProductsViewDetailsDialogData.isLoading = true;
    this.setState({ listProductsViewDetailsDialogData });
    const self = this;
    this.subscriptions.push(
      this.manageBundleRepo.getProductDetailsByProductId(productId)
        .subscribe({
          next(value) {
            let currentProductId: string | undefined = undefined;
            if (value) {
              const { main_category, sub_category, actual_price, image, name, no_of_ratings, product_id, ratings } = value.GetProductById;
              listProductsViewDetailsDialogData = {
                ...listProductsViewDetailsDialogData,
                isOpened: true,
                isLoading: false,
                breadCrumbs: [main_category, sub_category],
                images: [image],
                name,
                noOfRatings: no_of_ratings,
                price: actual_price,
                ratings
              }
              currentProductId = productId;
            } else {
              listProductsViewDetailsDialogData.isOpened = false;
              listProductsViewDetailsDialogData.isLoading = false;
            }
            self.setState({ listProductsViewDetailsDialogData, currentProductId });
          },
          error(errorValue) {
            console.error(errorValue);
            listProductsViewDetailsDialogData.isOpened = false;
            listProductsViewDetailsDialogData.isLoading = false;
            self.setState({ listProductsViewDetailsDialogData });
          },
        })
    );
  }

  handleProductTableBodyEvents(event: TableBodyActions | ProductTableRowActions, payload?: any) {
    switch (event) {
      case TableBodyActions.SORT_CHANGE:
        this.setState({ selectedProducts: new Set() });
        this.handleProductsTableSortChange(payload);
        break;
      case TableBodyActions.SELECTION_CHANGE:
        this.setState({ selectedProducts: payload });
        break;
      case ProductTableRowActions.VIEW_PRODUCT_DETAILS:
        this.openViewDetailsDialog(payload);
        break;
      case ProductTableRowActions.SELECT_PRODUCT:
        this.state.selectedProducts.add(payload);
        this.setState({ selectedProducts: this.state.selectedProducts });
    }
  }

  resetBundleTable() {
    this.setState({
      bundleProductsInput: cloneDeep(DefaultListProductTableInput),
      bundleProductsOutput: {
        rows: [],
        totalRows: 0
      },
      bundleProductRows: [],
      bundleProductsSet: new Set()
    });
  }

  handleBundleTableSearch(pattern?: string) {
    this.setState({
      bundleProductRows: new FuzzySearch(
        this.state.bundleProductsOutput.rows as object[],
        ListProductTableColumns.filter(column => column.isSearchable)
          .map(column => column.name), {
        caseSensitive: false,
        sort: false
      }).search(pattern) as Product[]
    });
  }

  getBundleCategoryFilterOption() {
    let result = cloneDeep(categoryFilterOption);
    result.data = result.data as MultiSelection;
    result.data.selectedOptions = cloneDeep(this.state.bundleProductsInput.filter?.categories ?? []) as Array<SelectionInput>;
    return result;
  }

  getBundleRatingsFilterOption(): FilterOptions {
    let result = cloneDeep(ratingsFilterOption);
    result.data = result.data as BetweenInputData;
    if (this.state.bundleProductsInput.filter?.ratings) {
      result.data.from = this.state.bundleProductsInput.filter.ratings.from;
      result.data.to = this.state.bundleProductsInput.filter.ratings.to;
    }
    return result;
  }

  getBundlePriceFilterOption(): FilterOptions {
    let result = cloneDeep(priceFilterOption);
    result.data = result.data as BetweenInputData;
    if (this.state.bundleProductsInput.filter?.actualPrice) {
      result.data.from = this.state.bundleProductsInput.filter.actualPrice.from;
      result.data.to = this.state.bundleProductsInput.filter.actualPrice.to;
    }
    return result;
  }

  handleBundleTableOpenFilter() {
    let bundleProductFilterData = cloneDeep(this.state.bundleProductFilterData);
    bundleProductFilterData.isOpened = true;
    bundleProductFilterData.options = [
      this.getBundleCategoryFilterOption(),
      this.getBundleRatingsFilterOption(),
      this.getBundlePriceFilterOption()
    ];
    this.setState({ bundleProductFilterData });
  }

  handleBundleSummaryTableHeaderEvents(event: TableHeaderEvents | BundleTableHeaderAction, payload?: any) {
    switch (event) {
      case TableHeaderEvents.SEARCH_CHANGE:
        this.handleBundleTableSearch(payload);
        break;
      case TableHeaderEvents.OPEN_FILTER:
        this.handleBundleTableOpenFilter();
        break;
      case BundleTableHeaderAction.RESET_TABLE:
        this.resetBundleTable();
        break;
    }
  }

  handleMaxLimitDialogReachedDialogOnClose(value?: boolean) {
    if (value) {
      this.handleAddSelectedProductsToBundle('replace');
    }
    this.setState({ bundleLimitWarningDialogProps: { ...this.state.bundleLimitWarningDialogProps, isOpened: false } });
  }

  fetchProductsForBundleTable(listProductsInput: ListProductsInput, canUpdate?: boolean, discount_percentage?: number) {
    let selectedProductIds: string[] | undefined;
    if (canUpdate && listProductsInput.filter && listProductsInput.filter.selectedProductIds && listProductsInput.filter.selectedProductIds.length === 0) {
      this.setState({
        bundleProductsOutput: { rows: [], totalRows: 0 },
        isBundleTableLoading: false,
        bundleProductRows: []
      });
      selectedProductIds = []
    }
    if (listProductsInput.filter && listProductsInput.filter.selectedProductIds && listProductsInput.filter.selectedProductIds.length > 0) {
      const self = this;
      this.setState({ isBundleTableLoading: true });
      selectedProductIds = cloneDeep(listProductsInput.filter.selectedProductIds);
      this.subscriptions.push(
        this.manageBundleRepo.listProducts(listProductsInput)
          .subscribe({
            next(value) {
              if (value?.ListProducts) {
                self.setState({
                  bundleProductsOutput: value.ListProducts,
                  isBundleTableLoading: false,
                  bundleProductRows: value.ListProducts.rows
                });
              } else {
                self.setState({
                  bundleProductsOutput: { rows: [], totalRows: 0 },
                  isBundleTableLoading: false,
                  bundleProductRows: []
                });
                console.error('No Data!');
              }
            },
            error(errorValue) {
              console.error(errorValue);
              self.setState({
                bundleProductsOutput: { rows: [], totalRows: 0 },
                isBundleTableLoading: false,
                bundleProductRows: []
              });
            }
          })
      )
    } else {
      console.error('No Products Selected');
    }
    let quantityMap: Map<string, number> = new Map();
    if (selectedProductIds) {
      if (selectedProductIds.length > 1) {
        selectedProductIds.forEach(key => {
          quantityMap.set(key, this.state.bundleTableQuantityMap.get(key) ?? 1);
        });
      }
      this.setState({ bundleTableQuantityMap: quantityMap });
      if (discount_percentage) {
        this.updateBundlePrice(quantityMap, discount_percentage);
      } else {
        this.updateBundlePrice(quantityMap, this.state.bundleDiscountPercentage);
      }
    }
  }

  handleBundleProductsTableSortChange(sort: Sort) {
    let bundleProductsInput: ListProductsInput = cloneDeep(this.state.bundleProductsInput);
    bundleProductsInput.sort = sort;
    this.setState({ bundleProductsInput });
    this.fetchProductsForBundleTable(bundleProductsInput);
  }

  updateBundlePrice(quantityMap: Map<string, number>, discount_percentage: number) {
    const self = this;
    let input: TotalPriceAndDiscountPriceInput = {
      discount_percentage,
      products: []
    };
    quantityMap.forEach((quantity, product_id) => {
      input.products.push({
        product_id,
        quantity
      });
    })
    this.subscriptions.push(
      this.manageBundleRepo.getTotalPriceAndDiscountPrice(input)
        .subscribe({
          next(value) {
            if (value) {
              self.setState({ bundleActualPrice: parseFloat(value.GetTotalPriceAndDiscountPrice.totalPrice.toFixed(1)), bundleTotalPrice: parseFloat(value.GetTotalPriceAndDiscountPrice.discountPrice.toFixed(1)) });
            } else {
              console.error('Internal Server Error');
            }
          },
          error(errorValue) {
            console.error(errorValue);
          },
        })
    );
  }

  handleBundleDiscountPriceChange(value: any) {
    let percentage = parseFloat(value);
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      this.setState({ bundleDiscountPercentage: percentage });
      this.updateBundlePrice(this.state.bundleTableQuantityMap, percentage);
    }
  }

  handleBundleTableBodyEvents(event: TableBodyActions, payload?: any) {
    switch (event) {
      case TableBodyActions.SELECTION_CHANGE:
        this.setState({ bundleTableSelectedRows: cloneDeep(payload) });
        break;
      case TableBodyActions.SORT_CHANGE:
        this.setState({ bundleTableSelectedRows: new Set() });
        this.handleBundleProductsTableSortChange(payload);
        break;
      case TableBodyActions.QUANTITY_UPDATE:
        console.log(event, payload);
        this.updateBundlePrice(payload, this.state.bundleDiscountPercentage);
        this.setState({ bundleTableQuantityMap: payload });
        break;
    }
  }

  isBundleFilterApplied() {
    if (this.state.bundleProductsInput.filter) {
      const filterKeys = Object.keys(this.state.bundleProductsInput.filter);
      if (filterKeys && filterKeys.length === 1 && filterKeys[0] == 'selectedProductIds') {
        return false;
      } else if (filterKeys && filterKeys.length > 1) {
        return true;
      }
    }
    return false;
  }

  isProductFilterApplied() {
    if (this.state.listProductsInput.filter) {
      return Object.keys(this.state.listProductsInput.filter).length > 0;
    }
    return false;
  }

  handleBundleProductsTablePageSizeChange(pageSize: PageSize) {
    let bundleProductsInput: ListProductsInput = cloneDeep(this.state.bundleProductsInput);
    bundleProductsInput.page.size = pageSize;
    bundleProductsInput.page.number = 1;
    this.setState({ bundleProductsInput });
    this.fetchProductsForBundleTable(bundleProductsInput);
  }

  handleBundleProductsTablePageNumberChange(pageNumber: number) {
    let bundleProductsInput: ListProductsInput = cloneDeep(this.state.bundleProductsInput);
    bundleProductsInput.page.number = pageNumber;
    this.setState({ bundleProductsInput });
    this.fetchProductsForBundleTable(bundleProductsInput);
  }

  handleRemoveProductsFromBundleTable() {
    let bundleProductsSet = cloneDeep(this.state.bundleProductsSet);
    for (const productId of this.state.bundleTableSelectedRows) {
      bundleProductsSet.delete(productId);
    }
    let bundleProductsInput = this.state.bundleProductsInput;
    if (!bundleProductsInput.filter) {
      bundleProductsInput.filter = {};
    }
    bundleProductsInput.filter.selectedProductIds = Array.from(bundleProductsSet);
    this.fetchProductsForBundleTable(bundleProductsInput, true);
    this.setState({ bundleProductsSet, bundleTableSelectedRows: new Set(), bundleProductsInput });
  }

  handleBundleTableFooterEvents(event: TableFooterActions, payload?: any) {
    switch (event) {
      case TableFooterActions.PAGE_SIZE_CHANGE:
        this.handleBundleProductsTablePageSizeChange(payload);
        break;
      case TableFooterActions.PAGE_NUMBER_CHANGE:
        this.handleBundleProductsTablePageNumberChange(payload);
        break;
      case TableFooterActions.ACTION_TRIGGERED:
        this.handleRemoveProductsFromBundleTable();
        break;
    }
  }

  canCreateBundle() {
    return this.state.bundleName.length > 0
      && this.state.bundleTotalPrice <= 1000000
      && (this.state.bundleTableQuantityMap.size > 0);
  }

  createBundle() {
    let input: CreateBundleInput = {
      name: this.state.bundleName,
      discount_percentage: this.state.bundleDiscountPercentage,
      products: []
    }
    this.state.bundleTableQuantityMap.forEach((quantity, product_id) => {
      input.products.push({
        product_id,
        quantity
      });
    })
    const self = this;
    this.subscriptions.push(
      this.manageBundleRepo.createBundle(input)
        .subscribe({
          next(value) {
            if (value) {
              self.props.showNotification({
                severity: 'success',
                message: 'Bundle Created Successfully!'
              });
              self.props.client.clearStore().then((_) => {
                self.props.router.navigate('/');
              });
            } else {
              self.props.showNotification({
                severity: 'error',
                message: 'Error Creating Bundle'
              })
            }
          },
          error(err) {
            console.error(err);
            self.props.showNotification({
              severity: 'error',
              message: err.message
            })
          },
        })
    );
  }

  updateBundle() {
    if (this.state.bundleId) {
      let input: CreateBundleInput = {
        name: this.state.bundleName,
        discount_percentage: this.state.bundleDiscountPercentage,
        products: []
      }
      this.state.bundleTableQuantityMap.forEach((quantity, product_id) => {
        input.products.push({
          product_id,
          quantity
        });
      })
      const self = this;
      this.subscriptions.push(
        this.manageBundleRepo.updateBundle(input, this.state.bundleId)
          .subscribe({
            next(value) {
              if (value) {
                self.props.showNotification({
                  severity: 'success',
                  message: 'Bundle Updated Successfully!'
                });
                self.props.client.clearStore().then((_) => {
                  self.props.router.navigate('/');
                });
              } else {
                self.props.showNotification({
                  severity: 'error',
                  message: 'Error Updating Bundle'
                })
              }
            },
            error(err) {
              console.error(err);
              self.props.showNotification({
                severity: 'error',
                message: err.message
              })
            },
          })
      );
    } else {
      this.props.showNotification({
        severity: 'error',
        message: 'INTERNAL_SERVER_ERROR'
      })
    }
  }

  handleBundleSearchOpen() {
    this.setState({ isBundleSearchOpened: true});
    if (this.state.bundleSearchTerm) {
      this.fetchBundleDataForSearch(this.state.bundleSearchTerm);
    }
  }

  handleBundleSearchClose() {
    this.setState({ isBundleSearchOpened: false, bundleSearchOptions: [] });
  }

  fetchBundleDataForSearch(searchTerm: string) {
    const self = this;
    this.subscriptions.push(
    this.manageBundleRepo.searchBundles(searchTerm)
      .subscribe({
        next(value) {
            if (value) {
              self.setState({bundleSearchOptions: value.SearchBundles});
            } else {
              self.props.showNotification({
                severity: 'error',
                message: 'INTERNAL_SERVER_ERROR'
              })
            }
            self.setState({isBundleSearchLoading: false});
        },
        error(errorValue) {
          self.props.showNotification({
            severity: 'error',
            message: self.manageBundleRepo.errorExtracter(errorValue)
          });
          self.setState({ isBundleSearchLoading: false });
        },
      })
    );
  }

  handleOnSearch(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const searchTerm = event.target.value;
    this.setState({bundleSearchTerm: searchTerm, isBundleSearchLoading: true});
    this.fetchBundleDataForSearch(searchTerm);
  }


  handleOnChangeBundle(bundle_id?: string) {
    if (bundle_id) {
      this.fetchBundleById(bundle_id);
    }
  }


  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <div className={styles['container']}>
            <section className={styles['create-bundle-info']}>
              <span className={styles['title']}>{i18n.t(`${this.props.mode}_BUNDLE.TITLE`)}</span>
              <span className={styles['info']}>{i18n.t(`${this.props.mode}_BUNDLE.INFO`)}</span>
            </section>
            {this.props.mode === 'EDIT' &&
              <section className={styles['bundle-search-container']}>
                <Autocomplete
                  sx={{ width: 300 }}
                  open={this.state.isBundleSearchOpened}
                  onOpen={this.handleBundleSearchOpen}
                  onClose={this.handleBundleSearchClose}
                  isOptionEqualToValue={(option, value) => option.bundle_id === value.bundle_id}
                  getOptionLabel={(option) => option.name}
                  options={this.state.bundleSearchOptions}
                  loading={this.state.isBundleSearchLoading}
                  onChange={(_, value) => this.handleOnChangeBundle(value?.bundle_id)}
                  autoComplete
                  noOptionsText={this.state.bundleSearchTerm.length === 0 ? i18n.t('EDIT_BUNDLE.SEARCH_BUNDLE.PLACEHOLDER') : i18n.t('EDIT_BUNDLE.SEARCH_BUNDLE.NO_DATA')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={i18n.t('EDIT_BUNDLE.SEARCH_BUNDLE_LABEL')}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {this.state.isBundleSearchLoading ? <CircularProgress color="primary" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                      value={this.state.bundleSearchTerm}
                      onChange={this.handleOnSearch}
                    />
                  )}
                />
              </section>}
            {/* Products Table */}
            <Table
              headerData={{
                title: ProductTableHeaderConfig.title,
                editModeList: [
                  // {
                  //   ...ProductTableHeaderConfig.editModeList[0],
                  //   disabled: !this.state.listProductsInput.filter || this.state.listProductsOutput.totalRows > 500
                  // },
                  ProductTableHeaderConfig.editModeList[1]
                ],
                onTableHeaderEvents: this.handleProductTableHeaderEvents.bind(this),
                isFilterApplied: this.isProductFilterApplied(),
                canShowFilter: true
              }}

              rootData={{
                isLoading: this.state.isProductsTableLoading,
                hasSelect: true,
                columns: cloneDeep(ListProductTableColumns),
                idColumnName: 'product_id',
                sort: this.state.listProductsInput.sort,
                rows: this.state.listProductRows,
                onTableBodyEvents: this.handleProductTableBodyEvents.bind(this),
                actions: cloneDeep(productTableRowActions),
                selectedRows: this.state.selectedProducts,
              }}

              footerData={
                {
                  pageNumber: this.state.listProductsInput.page.number,
                  pageSize: this.state.listProductsInput.page.size,
                  totalRows: this.state.listProductsOutput?.totalRows,
                  onTableFooterEvents: this.handleProductTableFooterEvents.bind(this),
                  actionButtonState: {
                    title: 'CREATE_BUNDLE.LIST_PRODUCTS.FOOTER.ACTION_BTN_TEXT',
                    isVisible: this.state.selectedProducts.size > 0
                  }
                }
              }

              filterData={this.state.productFilterData}
            />
            <section className={styles['bundle-summary-info']}>
              <span className={styles['title']}>{i18n.t('BUNDLE_SUMMARY.TITLE')}</span>
              <span className={styles['info']}>{i18n.t('BUNDLE_SUMMARY.INFO',
                {
                  currencySymbol: '\u20B9',
                  maxPrice: 1000000
                })}</span>
            </section>
            <section className={styles['bundle-details']}>
              <section className={styles['form-fields']}>
                <TextField
                  required
                  label={i18n.t('BUNDLE_SUMMARY.FORMFIELD.NAME')}
                  value={this.state.bundleName}
                  onChange={(event) => this.setState({ bundleName: event.target.value })}
                />
                <TextField
                  required
                  label={i18n.t('BUNDLE_SUMMARY.FORMFIELD.DISCOUNT')}
                  type="number"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 100,
                      step: '0.1'
                    }
                  }}
                  disabled={this.state.bundleProductsSet.size === 0}
                  value={this.state.bundleDiscountPercentage}
                  onChange={(event) => this.handleBundleDiscountPriceChange(event.target.value)}
                />
                <TextField
                  required
                  label={i18n.t('BUNDLE_SUMMARY.FORMFIELD.ACTUAL_PRICE', { currencySymbol: '\u20B9' })}
                  type="number"
                  value={this.state.bundleActualPrice}
                  disabled
                />
                <TextField
                  error={this.state.bundleTotalPrice > 1000000}
                  required
                  label={i18n.t('BUNDLE_SUMMARY.FORMFIELD.TOTAL_PRICE', { currencySymbol: '\u20B9' })}
                  type="number"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 1000000,
                      step: '0.1'
                    }
                  }}
                  value={this.state.bundleTotalPrice}
                  disabled
                />
              </section>
              {/* Bundle Summary Table */}
              <Table
                headerData={{
                  ...BundleSummaryTableHeaderConfig,
                  onTableHeaderEvents: this.handleBundleSummaryTableHeaderEvents.bind(this),
                  canShowFilter: this.state?.bundleProductsSet?.size > 2,
                  isFilterApplied: this.isBundleFilterApplied()
                }}
                rootData={{
                  columns: cloneDeep(BundleSummaryTableColumns),
                  idColumnName: 'product_id',
                  rows: this.state.bundleProductRows,
                  onTableBodyEvents: this.handleBundleTableBodyEvents.bind(this),
                  hasSelect: true,
                  isLoading: this.state.isBundleTableLoading,
                  selectedRows: this.state.bundleTableSelectedRows,
                  quantityMap: this.state.bundleTableQuantityMap,
                  sort: this.state.bundleProductsInput.sort
                }}
                footerData={{
                  pageNumber: this.state.bundleProductsInput.page.number,
                  pageSize: this.state.bundleProductsInput.page.size,
                  totalRows: this.state.bundleProductsOutput.totalRows,
                  actionButtonState: {
                    title: 'BUNDLE_SUMMARY.TABLE.FOOTER.ACTION_BTN',
                    isVisible: this.state.bundleTableSelectedRows.size > 0,
                    warn: true
                  },
                  onTableFooterEvents: this.handleBundleTableFooterEvents.bind(this)
                }}
                filterData={
                  this.state.bundleProductFilterData
                } />

              <Button className={styles['create-bundle-btn']} color='primary' variant='contained' disabled={!this.canCreateBundle()}
                onClick={ this.props.mode === 'CREATE' ? this.createBundle: this.updateBundle}>
                {i18n.t(`${this.props.mode}_BUNDLE.BTN_TEXT`)}
              </Button>
            </section>
            <ViewDetails {...this.state.listProductsViewDetailsDialogData} />
            <CustomAlertComponent
              {...this.state.bundleLimitWarningDialogProps}
            />
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}

const mapDispatchToProps = {
  showNotification: notificationActions.showNotification
};

export default connect(null, mapDispatchToProps)(withApolloClient(withRouter(ManageBundleCore)));
