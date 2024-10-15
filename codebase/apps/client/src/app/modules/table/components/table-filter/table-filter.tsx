import React, { Component } from 'react';

import styles from './table-filter.module.scss';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Slider } from '@mui/material';
import { BetweenInputData, FilterOptions, FilterOutputType, MultiSelection, SelectionInput, TableFilterProps, TableFilterState, TableFilterStateMap } from '../../types/interfaces';
import { I18nContext } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { FilterInputType } from '../../types/enums';
import FuzzySearch from 'fuzzy-search';
import { cloneDeep, debounce, isEqual } from 'lodash';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { Mark } from '@mui/material/Slider/useSlider.types';


export class TableFilter extends Component<TableFilterProps, TableFilterState> {
  constructor(props: TableFilterProps) {
    super(props);
    this.state = {
      page: 'main',
      subTitle: '',
      searchTerm: '',
      subList: props.subList ?? [],
      stateMap: this.prepareStateMap(false)
    };

    this.filterList = debounce(this.filterList.bind(this), 300);
  }

  filterList() {
    if (this.props.subList) {
      this.setState({ subList: new FuzzySearch(this.props.subList).search(this.state.searchTerm) });
    }
  }
  handleSearchChange(searchTerm: string) {
    this.setState({ searchTerm });
    this.filterList();
  }

  handleMultiSelectionNextClick(option: FilterOptions, index: number) {
    option.data = option.data as MultiSelection;
    this.setState({ page: 'sub-1', searchTerm: '', subTitle: option.data.name, type: option.type, editingStateIndex: index });
    this.props.onMultiSelectionNext('sub1');
  }

  handleMultiSelectionSub1(value: string) {
    this.setState({ page: 'sub-2', searchTerm: '', subTitle: value });
    this.props.onMultiSelectionNext('sub2', value);
  }

  handleBetweenFilterNext(option: FilterOptions, index: number) {
    option.data = option.data as BetweenInputData;
    this.setState({ page: 'between', searchTerm: '', subTitle: option.i18nKey, type: option.type, editingStateIndex: index });
  }

  handleListItemSwitch(option: FilterOptions, index: number) {
    switch (option.type) {
      case FilterInputType.Between:
        this.handleBetweenFilterNext(option, index);
        break;
      case FilterInputType.MultiSelectionList:
        this.handleMultiSelectionNextClick(option, index);
        break;
    }
  }

  handleBackFromSub1() {
    this.setState({ page: 'main', searchTerm: '' });
  }

  handleBackFromSub2() {
    let option = this.props.options[this.state.editingStateIndex ?? 0];
    option.data = option.data as MultiSelection;
    this.handleMultiSelectionNextClick(option, this.state.editingStateIndex ?? 0);
  }

  prepareStateMap(canSetState: boolean = true) {
    let stateMap: TableFilterStateMap = new Map();
    this.props.options.forEach((option, index) => {
      switch (option.type) {
        case FilterInputType.Between:
          stateMap.set(index, cloneDeep(option.data) as BetweenInputData);
          break;
        case FilterInputType.MultiSelectionList:
          option.data = option.data as MultiSelection;
          let multiSelectionMap = new Map<string, Set<string>>();
          option.data.selectedOptions.forEach(selectionOption => {
            multiSelectionMap.set(selectionOption.name, new Set(selectionOption.subCategories));
          });
          stateMap.set(index, multiSelectionMap);
          break;
      }
    });
    if (canSetState) {
      this.setState({ stateMap });
    }
    return stateMap;
  }

  componentDidUpdate(prevProps: Readonly<TableFilterProps>, prevState: Readonly<{ page: 'main' | 'sub-1' | 'sub-2' | 'between'; subTitle: string; searchTerm: string; type?: FilterInputType; editingStateIndex?: number; subList: string[]; }>, snapshot?: any): void {
    if (!isEqual(prevProps.subList, this.props.subList)) {
      this.setState({ subList: this.props.subList ?? [] });
    }
    if (!isEqual(prevProps.options, this.props.options)) {
      this.prepareStateMap();
    }
  }

  handleSub2SelectAll(checked: boolean) {
    if (!!this.state.editingStateIndex || this.state.editingStateIndex === 0) {
      const key = this.state.editingStateIndex;
      let stateMap = cloneDeep(this.state.stateMap);
      let selectionMap = (stateMap.get(key) ?? new Map()) as Map<string, Set<string>>;
      if (checked) {
        selectionMap.set(this.state.subTitle, new Set(this.state.subList));
      } else {
        selectionMap.delete(this.state.subTitle);
      }
      stateMap.set(key, selectionMap);
      this.setState({ stateMap });
    }
  }
  handleSub2SelectOne(checked: boolean, value: string) {
    if (!!this.state.editingStateIndex || this.state.editingStateIndex === 0) {
      const key = this.state.editingStateIndex;
      let stateMap = cloneDeep(this.state.stateMap);
      let selectionMap = (stateMap.get(key) ?? new Map()) as Map<string, Set<string>>;
      let selectionSet = selectionMap.get(this.state.subTitle) ?? new Set();
      if (checked) {
        selectionSet.add(value);
      } else {
        selectionSet.delete(value);
      }
      if (selectionSet.size === 0) {
        selectionMap.delete(this.state.subTitle);
      } else {
        selectionMap.set(this.state.subTitle, selectionSet);
      }
      stateMap.set(key, selectionMap);
      this.setState({ stateMap });
    }
  }
  handleSub2SelectOneViaButtonClick(value: string) {
    if (!!this.state.editingStateIndex || this.state.editingStateIndex === 0) {
      const key = this.state.editingStateIndex;
      let stateMap = cloneDeep(this.state.stateMap);
      let selectionMap = (stateMap.get(key) ?? new Map()) as Map<string, Set<string>>;
      let selectionSet = selectionMap.get(this.state.subTitle) ?? new Set();
      if (!selectionSet.has(value)) {
        selectionSet.add(value);
      } else {
        selectionSet.delete(value);
      }
      if (selectionSet.size === 0) {
        selectionMap.delete(this.state.subTitle);
      } else {
        selectionMap.set(this.state.subTitle, selectionSet);
      }
      stateMap.set(key, selectionMap);
      this.setState({ stateMap });
    }
  }

  isSub2CheckBoxSelected(value: string): boolean {
    if (!!this.state.editingStateIndex || this.state.editingStateIndex === 0) {
      const selectionMap = (this.state.stateMap.get(this.state.editingStateIndex) ?? new Map()) as Map<string, Set<string>>;
      if (selectionMap.get(this.state.subTitle)?.has(value)) {
        return true;
      }
    }
    return false;
  }

  isAllSublistSelected(): boolean {
    if (!!this.state.editingStateIndex || this.state.editingStateIndex === 0) {
      const selectionMap = (this.state.stateMap.get(this.state.editingStateIndex) ?? new Map()) as Map<string, Set<string>>;
      if (selectionMap.get(this.state.subTitle)?.size === this.state.subList.length && this.state.subList.length > 0) {
        return true;
      }
    }
    return false;
  }

  isSubListPartiallySelected(): boolean {
    if (!this.isAllSublistSelected()) {
      if (!!this.state.editingStateIndex || this.state.editingStateIndex === 0) {
        const selectionMap = (this.state.stateMap.get(this.state.editingStateIndex) ?? new Map()) as Map<string, Set<string>>;
        if (selectionMap.get(this.state.subTitle)?.size) {
          return true;
        }
      }
    }
    return false;
  }

  getNoOfItemsSelectedOnSubList(value: string): number {
    if (!!this.state.editingStateIndex || this.state.editingStateIndex === 0) {
      const selectionMap = (this.state.stateMap.get(this.state.editingStateIndex) ?? new Map()) as Map<string, Set<string>>;
      return selectionMap.get(value)?.size ?? 0;
    }
    return 0;
  }

  isMainListItemFiltered(index: number, option: FilterOptions) {
    let stateMapValue = this.state.stateMap.get(index);
    if (stateMapValue) {
      switch (option.type) {
        case FilterInputType.Between:
          stateMapValue = stateMapValue as BetweenInputData;
          option.data = option.data as BetweenInputData;
          return option.data.min !== stateMapValue.from || option.data.max !== stateMapValue.to;
        case FilterInputType.MultiSelectionList:
          stateMapValue = stateMapValue as Map<string, Set<string>>;
          return stateMapValue.size > 0;
      }
    }
    return false;
  }

  handleChangeBetweenValue(newValue: number | number[]) {
    if (Array.isArray(newValue)) {
      const [from, to] = newValue;
      if (from < to) {
        const key = this.state.editingStateIndex
        if (!!key || key === 0) {
          let stateMap = cloneDeep(this.state.stateMap);
          if (stateMap.get(key)) {
            let betweenInput = stateMap.get(key) as BetweenInputData;
            betweenInput.from = from;
            betweenInput.to = to;
            stateMap.set(key, betweenInput);
            this.setState({ stateMap });
          }
        }
      }
    }
  };

  getBetweenInputProps(): { value?: [number, number], marks?: Mark[], min?: number, max?: number, step?: number } {
    const key = this.state.editingStateIndex
    if (!!key || key === 0) {
      if (this.state.stateMap.get(key)) {
        let betweenInput = this.state.stateMap.get(key) as BetweenInputData;
        const marks = new Array<Mark>(6).fill({ value: 0 }).map((_, index) => ({
          value: (betweenInput.max / 5) * index,
          label: betweenInput.hasLabel ? `${(betweenInput.max / 5) * index}` : ''
        }));
        return {
          min: betweenInput.min,
          max: betweenInput.max,
          value: [betweenInput.from, betweenInput.to],
          marks,
          step: betweenInput.step ?? 1
        }
      }
    }
    return {};
  }
  handleApply() {
    let result: FilterOutputType = {};
    this.state.stateMap.forEach((value, key) => {
      const option = this.props.options[key];
      switch (option.type) {
        case FilterInputType.Between:
          value = value as BetweenInputData;
          if (value.from !== value.min || value.to !== value.max) {
            result[option.key] = { from: value.from, to: value.to };
          }
          break;
        case FilterInputType.MultiSelectionList:
          value = value as Map<string, Set<string>>;
          let selectionResult:SelectionInput[] = [];
          value.forEach((set, name) => {
            selectionResult.push({
              name,
              subCategories: Array.from(set)
            });
          });
          if (selectionResult.length > 0) {
            result[option.key] = selectionResult;
          }
          break;
      }
    })
    this.props.onClose(result);
  }
  handleClose(canApply?: boolean) {
    if (canApply) {
      this.handleApply();
    } else {
      this.props.onClose();
    }
    this.setState({ page: 'main', searchTerm: '', subList: [], subTitle: '', stateMap: new Map() });
  }

  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Dialog
            PaperProps={{ className: styles['container'] }}
            open={this.props.isOpened}
          >
            <header className={styles['header']}>
              <DialogTitle
                className={styles['title']}
              >
                {i18n.t(this.props.dialogTitle)}
              </DialogTitle>
              <IconButton
                onClick={() => this.handleClose()}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </header>

            <DialogContent className={styles['dialog-content']} dividers>
              {
                this.state.page === 'main' &&
                <List className={styles['main-list']}>
                  {this.props.options.map((option, idx) => (
                    <ListItem
                      key={idx}
                      secondaryAction={
                        <IconButton edge="end">
                          <NavigateNextOutlinedIcon />
                        </IconButton>
                      }
                      onClick={() => this.handleListItemSwitch(option, idx)}
                      disablePadding>
                      <ListItemButton dense>
                        <ListItemText>
                          <div className={styles['main-list-item']}>
                            <span className={styles['main-list-item-text']}>{i18n.t(option.i18nKey)}</span>
                            {this.isMainListItemFiltered(idx, option) &&
                              <PriorityHighOutlinedIcon fontSize='small' color='primary' />
                            }
                          </div>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              }
              {
                this.state.page === 'sub-1' &&
                <main className={styles['sub-1']}>
                  <section className={styles['sub-header']}>
                    <IconButton onClick={() => this.handleBackFromSub1()}>
                      <ArrowBackIosNewOutlinedIcon fontSize='small' />
                    </IconButton>
                    <span className={styles['sub-title']}>{i18n.t(this.state.subTitle)}</span>
                  </section>
                  {this.props.isLoading ?
                    <Skeleton variant='rectangular' animation='wave' height={250}></Skeleton> :
                    <section className={styles['sub-main']}>
                      <FormControl className={styles['search-container']} variant='outlined'>
                        <Input
                          id="search"
                          value={this.state.searchTerm}
                          onChange={(event) => this.handleSearchChange(event.target.value)}
                          placeholder={i18n.t('TABLE_HEADER.SEARCH_INPUT.PLACEHOLDER')}
                          sx={{
                            fontSize: 14
                          }}
                          startAdornment={
                            <InputAdornment position='start'>
                              <SearchOutlinedIcon className={styles['icon-btn']} />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position='end'>
                              <ClearIcon className={`${styles['clear-icon']} ${styles['icon-btn']}`} onClick={() => this.handleSearchChange('')} />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      <section className={styles['sub-list']}>
                        {!!this.props.subList && this.props.subList.length === 0 ?
                          <span className={styles['no-data-text']}>No Data</span>
                          :
                          <List className={styles['selection-list']}>
                            {this.props.subList && this.state.subList.map((value, index) => (
                              <ListItem className={styles['list-item']} key={index}
                                onClick={() => this.handleMultiSelectionSub1(value)}
                                secondaryAction={
                                  <IconButton edge="end">
                                    <NavigateNextOutlinedIcon />
                                  </IconButton>
                                }>
                                <ListItemButton className={styles['list-item-btn']} dense>
                                  <ListItemText>
                                    <div className={styles['list-item-text']}>
                                      <span className={styles['value']}>{value}</span>
                                      {this.getNoOfItemsSelectedOnSubList(value) > 0 &&
                                        <span className={styles['count']}>{this.getNoOfItemsSelectedOnSubList(value)}</span>}
                                    </div>
                                  </ListItemText>
                                </ListItemButton>
                              </ListItem>

                            ))}
                          </List>
                        }
                      </section>
                    </section>
                  }

                </main>
              }
              {
                this.state.page === 'sub-2' &&
                <main className={styles['sub-2']}>
                  <section className={styles['sub-header']}>
                    <IconButton onClick={() => this.handleBackFromSub2()}>
                      <ArrowBackIosNewOutlinedIcon fontSize='small' />
                    </IconButton>
                    <span className={styles['sub-title']}>{i18n.t(this.state.subTitle)}</span>
                  </section>
                  {this.props.isLoading ? <Skeleton animation='wave' variant='rectangular' height={250} /> :
                    <section className={styles['sub-main']}>
                      <FormControl className={styles['search-container']} variant='outlined'>
                        <Input
                          id="search"
                          value={this.state.searchTerm}
                          onChange={(event) => this.handleSearchChange(event.target.value)}
                          placeholder={i18n.t('TABLE_HEADER.SEARCH_INPUT.PLACEHOLDER')}
                          sx={{
                            fontSize: 14
                          }}
                          startAdornment={
                            <InputAdornment position='start'>
                              <SearchOutlinedIcon className={styles['icon-btn']} />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position='end'>
                              <ClearIcon className={`${styles['clear-icon']} ${styles['icon-btn']}`} onClick={() => this.handleSearchChange('')} />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      <section className={styles['sub-list']}>
                        <span className={styles['select-all-section']}>
                          <Checkbox
                            indeterminate={this.isSubListPartiallySelected()}
                            checked={this.isAllSublistSelected()}
                            onChange={(event) => this.handleSub2SelectAll(event.target.checked)}
                            className={styles['select-all-checkbox']}
                            size='small'
                          ></Checkbox>
                          <span className={styles['select-all-text']}>
                            {i18n.t('TABLE_FILTER.SELECT_ALL')}
                          </span>
                        </span>
                        {!!this.props.subList && this.props.subList.length === 0 ?
                          <span className={styles['no-data-text']}>No Data</span>
                          :
                          <List className={styles['selection-list']}>
                            {this.props.subList && this.state.subList.map((value, index) => (
                              <ListItem onClick={() => this.handleSub2SelectOneViaButtonClick(value)} className={styles['list-item']} key={index}>
                                <ListItemButton className={styles['list-item-btn']} dense>
                                  <ListItemIcon className={styles['list-item-checkbox-btn']}>
                                    <Checkbox
                                      checked={this.isSub2CheckBoxSelected(value)}
                                      onChange={(event) => this.handleSub2SelectOne(event.target.checked, value)}
                                      className={styles['list-item-checkbox']} size='small' />
                                  </ListItemIcon>
                                  <ListItemText>
                                    {value}
                                  </ListItemText>
                                </ListItemButton>
                              </ListItem>

                            ))}
                          </List>
                        }
                      </section>
                    </section>}
                </main>
              }

              {
                this.state.page === 'between' &&
                <main className={styles['between']}>
                  <section className={styles['sub-header']}>
                    <IconButton onClick={() => this.handleBackFromSub1()}>
                      <ArrowBackIosNewOutlinedIcon fontSize='small' />
                    </IconButton>
                    <span className={styles['sub-title']}>{i18n.t(this.state.subTitle)}</span>
                  </section>
                  <section className={styles['sub-main']}>
                    <Slider
                      getAriaLabel={() => 'Minimum distance'}
                      valueLabelDisplay="auto"
                      onChange={(_, value) => this.handleChangeBetweenValue(value)}
                      disableSwap
                      {...this.getBetweenInputProps()}
                    />
                  </section>
                </main>
              }
            </DialogContent>
            <DialogActions className={styles['footer']}>
              <Button variant='outlined' color='primary' onClick={() => this.handleClose()}>
                {i18n.t('TABLE_FILTER.CANCEL_TEXT')}
              </Button>
              <Button aria-hidden variant='contained' color='primary' onClick={() => this.handleClose(true)}>
                {i18n.t('TABLE_FILTER.CONFIRMATION_TEXT')}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </I18nContext.Consumer>

    );
  }
}

export default React.memo(TableFilter);
