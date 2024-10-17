import { Component } from 'react';

import styles from './table-body.module.scss';
import { Box, Checkbox, Table, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TableBody as MuiTableBody, Tooltip, Rating, IconButton, Menu, MenuItem, ListItemText, Skeleton, FormControl, Input, InputAdornment } from '@mui/material';
import { Sort, TableBodyProps } from '../../types/interfaces';
import { SortOrder, TableBodyActions } from '../../types/enums';
import { I18nContext } from 'react-i18next';
import { visuallyHidden } from '@mui/utils';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ReadMoreOutlinedIcon from '@mui/icons-material/ReadMoreOutlined';
import React from 'react';
import { cloneDeep, debounce, isEqual } from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export class TableBody<T, E> extends Component<TableBodyProps<T, E>, { selectionSet: Set<string>, anchorEL: Element | null, selectedRowId: any, quantityMap: Map<string, number> }> {

  constructor(props: TableBodyProps<T, E>) {
    super(props);
    this.state = {
      selectionSet: props.selectedRows ?? new Set(),
      anchorEL: null,
      selectedRowId: null,
      quantityMap: props.quantityMap ?? new Map()
    };
    this.dispatchQuantityUpdate = debounce(this.dispatchQuantityUpdate.bind(this), 300);
  }

  getSortOrder(order: SortOrder): 'asc' | 'desc' {
    if (order === SortOrder.DESC) {
      return 'desc';
    }
    return 'asc';
  }

  dispatchTableBodyActions(event: TableBodyActions | E, payload?: any) {
    this.props.onTableBodyEvents(event, payload);
  }

  handleSort(columnName: string) {
    let sort: Sort | undefined = this.props.sort;
    if (sort) {
      if (sort.sortBy === columnName) {
        sort.sortOrder = sort.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
      } else {
        sort = {
          sortBy: columnName,
          sortOrder: SortOrder.ASC
        };
      }
    } else {
      sort = {
        sortBy: columnName,
        sortOrder: SortOrder.ASC
      };
    }
    this.dispatchTableBodyActions(TableBodyActions.SORT_CHANGE, sort);
  }

  handleRowSelect(id: string, checked: boolean) {
    if (checked) {
      this.state.selectionSet.add(id);
    } else {
      this.state.selectionSet.delete(id);
    }
    this.dispatchTableBodyActions(TableBodyActions.SELECTION_CHANGE, this.state.selectionSet);
    this.setState({ selectionSet: this.state.selectionSet });
  }
  isAllRowsSelected() {
    return this.props.rows.length > 0 && this.props.rows.length === this.state.selectionSet.size;
  }

  isSomeRowsSelected() {
    return this.state.selectionSet.size > 0 && !this.isAllRowsSelected();
  }

  onMasterToggle(checked: boolean) {
    if (checked) {
      this.props.rows.forEach((row: any) => this.state.selectionSet.add(row[this.props.idColumnName]));
    } else {
      this.state.selectionSet.clear();
    }
    this.dispatchTableBodyActions(TableBodyActions.SELECTION_CHANGE, this.state.selectionSet);
    this.setState({ selectionSet: this.state.selectionSet });
  }

  handleRowMenuClose() {
    this.setState({ anchorEL: null, selectedRowId: null });
  }

  handleRowContextMenuButtonClick(event: React.MouseEvent, rowId: any) {
    this.setState({ anchorEL: event.currentTarget, selectedRowId: rowId });
  }

  handleRowMenuActions(action: E) {
    this.dispatchTableBodyActions(action, this.state.selectedRowId);
    this.handleRowMenuClose();
  }
  componentDidUpdate(prevProps: Readonly<TableBodyProps<T, E>>, prevState: Readonly<{ selectionSet: Set<string>; anchorEL: Element | null; selectedRowId: any; }>, snapshot?: any): void {
    if (!isEqual(prevProps.selectedRows, this.props.selectedRows)) {
      this.setState({ selectionSet: cloneDeep(this.props.selectedRows ?? new Set()) });
    }
    if (!isEqual(prevProps.quantityMap, this.props.quantityMap)) {
      this.setState({ quantityMap: this.props.quantityMap ?? new Map() });
    }
  }

  dispatchQuantityUpdate(quantityMap: Map<string, number>) {
    this.dispatchTableBodyActions(TableBodyActions.QUANTITY_UPDATE, quantityMap);
  }

  handleQuantityUpdate(key: string, value: any) {
    let quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0 && quantity <= 100) {
      let quantityMap = this.state.quantityMap;
      quantityMap.set(key, quantity);
      this.setState({ quantityMap });
      this.dispatchQuantityUpdate(quantityMap);
    }
  }

  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <TableContainer className={`${styles['container']} ${'light-theme'}`}>
            {((!this.props.isLoading && this.props.rows.length === 0)) ?
              <span className={styles['no-data-text']}>{i18n.t('TABLE.NO_DATA')}</span>
              :
              <Table stickyHeader size='medium'>
                <TableHead>
                  <TableRow>
                    {
                      this.props.hasSelect
                      &&
                      <TableCell className={`${styles['table-header-cell']} ${styles['checkbox']}`} padding="checkbox">
                        <Checkbox
                          color="primary"
                          size='small'
                          indeterminate={this.isSomeRowsSelected()}
                          checked={this.isAllRowsSelected()}
                          onChange={(event) => this.onMasterToggle(event.target.checked)}
                        />
                      </TableCell>
                    }
                    {this.props.columns.map(column => (
                      <TableCell
                        key={column.id}
                        align='left'
                        padding='normal'
                        className={styles['table-header-cell']}
                        sortDirection={this.props?.sort?.sortBy === column.name ? this.getSortOrder(this.props.sort.sortOrder) : false}
                      >
                        <TableSortLabel
                          disabled={!column.isSortable}
                          active={this.props?.sort?.sortBy === column.name}
                          direction={this.props?.sort?.sortBy === column.name ? this.getSortOrder(this.props.sort.sortOrder) : 'asc'}
                          onClick={() => this.handleSort(column.name)}
                        >
                          {i18n.t(column.i18nKey)}
                          {this.props.sort?.sortBy === column.name ? (
                            <Box component="span" sx={visuallyHidden}>
                              {this.props.sort?.sortOrder === SortOrder.DESC ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    {
                      !!this.props.actions && this.props.actions.length > 0 &&
                      <TableCell className={`${styles['table-header-cell']} ${styles['action']}`}>
                        <IconButton>
                          <ReadMoreOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    }
                  </TableRow>
                </TableHead>
                <MuiTableBody>
                  {this.props.isLoading && new Array(20).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      {
                        new Array(this.props.columns.length + (this.props.hasSelect ? 1 : 0) + (this.props.actions && this.props.actions.length > 0 ? 1 : 0))
                          .fill(0).map((_, index) => (
                            <TableCell key={index}>
                              <Skeleton animation='wave' variant="rectangular" />
                            </TableCell>
                          ))}
                    </TableRow>
                  ))}
                  {!this.props.isLoading && this.props.rows.map((row: any, index) => (
                    <TableRow key={`${row[this.props.idColumnName]} ${index}`} className={styles['data-row']}>
                      {
                        this.props.hasSelect
                        &&
                        <TableCell className={styles['row-checkbox']} padding="checkbox">
                          <Checkbox
                            color="primary"
                            size='small'
                            checked={this.state.selectionSet.has(row[this.props.idColumnName])}
                            onChange={(event) => this.handleRowSelect(row[this.props.idColumnName], event.target.checked)}
                          />
                        </TableCell>
                      }
                      {this.props.columns.map((column, index) => (
                        <TableCell key={row[column.name] + index} className={styles['truncate']}>
                          {column.isRatingsColumn ?
                            <Rating name="read-only" value={row[column.name]} readOnly />
                            :
                            column.currencySymbol ?
                              <Tooltip placement='bottom-start' enterDelay={700} title={column.currencySymbol + row[column.name]}>
                                <p>{column.currencySymbol + row[column.name]}</p>
                              </Tooltip> :
                              column.isQuantityColumn ?
                                <FormControl className={styles['quantity-input-container']} variant='filled'>
                                  <Input
                                    id="quantity-input"
                                    type='number'
                                    value={this.state.quantityMap?.get(row[this.props.idColumnName]) ?? 1}
                                    onChange={(event) => this.handleQuantityUpdate(row[this.props.idColumnName], event.target.value)}
                                    slotProps={{
                                      input: {
                                        min: 1,
                                        max: 100
                                      }
                                    }}
                                    sx={{
                                      fontSize: 14
                                    }}
                                  />
                                </FormControl>
                                :
                                <Tooltip placement='bottom-start' enterDelay={700} title={row[column.name]}>
                                  <p>{row[column.name]}</p>
                                </Tooltip>
                          }

                        </TableCell>
                      ))}
                      {
                        !!this.props.actions && this.props.actions.length > 0 &&
                        <TableCell className={`${styles['table-header-cell']} ${styles['action-row']}`}>
                          <IconButton onClick={(event) => this.handleRowContextMenuButtonClick(event, row[this.props.idColumnName])}>
                            <MoreHorizOutlinedIcon />
                          </IconButton>
                        </TableCell>
                      }
                    </TableRow>
                  ))}
                </MuiTableBody>
              </Table>
            }
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={this.state.anchorEL}
              open={Boolean(this.state.anchorEL)}
              onClose={this.handleRowMenuClose.bind(this)}
              anchorOrigin={{
                vertical: 'bottom',  // Opens below the clicked div
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {this.props.actions && this.props.actions.length > 0 && this.props.actions.map(rowAction => (
                <MenuItem sx={{
                  '&:hover': {
                    backgroundColor: rowAction.warn ? 'rgb(238 43 73 / 80%)' : 'inherit',
                    color: rowAction.warn ? 'white' : 'inherit'
                  }
                }} key={rowAction.i18nKey} onClick={() => this.handleRowMenuActions(rowAction.action)}>
                  <ListItemText>{i18n.t(rowAction.i18nKey)}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </TableContainer>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default React.memo(TableBody);
