import { Component } from 'react';

import styles from './table-footer.module.scss';
import { TableFooterPropsInterface } from '../../types/interfaces';
import { Button, TablePagination } from '@mui/material';
import { PageSizeNumber, TableFooterActions } from '../../types/enums';
import { PageNumberToSizeMap } from '../../types/constants';
import { I18nContext } from 'react-i18next';

export class TableFooter extends Component<TableFooterPropsInterface> {
  constructor(props: TableFooterPropsInterface) {
    super(props);
  }

  handleTableFooterEvents(event: TableFooterActions, payload?: any) {
    this.props.onTableFooterEvents(event, payload);
  }

  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <div className={`${styles['container']} ${this.props.actionButtonState?.isVisible ? styles['space-between']: ''}`}>
            {this.props.actionButtonState &&
              this.props.actionButtonState.isVisible &&
              <Button size='small' variant={this.props.actionButtonState && this.props.actionButtonState.warn ? 'contained': 'outlined'} color={this.props.actionButtonState && this.props.actionButtonState.warn ? 'error': 'inherit'} onClick={() => this.handleTableFooterEvents(TableFooterActions.ACTION_TRIGGERED)}>
                {i18n.t(this.props.actionButtonState.title)}
              </Button>}
            <TablePagination
              rowsPerPageOptions={[...PageNumberToSizeMap.keys()]}
              count={this.props.totalRows}
              rowsPerPage={PageSizeNumber[this.props.pageSize]}
              page={this.props.pageNumber - 1}
              onPageChange={(_, pageNumber) => this.handleTableFooterEvents(TableFooterActions.PAGE_NUMBER_CHANGE, pageNumber + 1)}
              onRowsPerPageChange={(event) => this.handleTableFooterEvents(TableFooterActions.PAGE_SIZE_CHANGE, PageNumberToSizeMap.get(parseInt(event.target.value)))}
              labelRowsPerPage={<div className={styles['rows-per-page-label']}>{i18n.t('TABLE_FOOTER.ROWS_PER_PAGE')}</div>}
            />
          </div>
        )}
      </I18nContext.Consumer>

    );
  }
}

export default TableFooter;
