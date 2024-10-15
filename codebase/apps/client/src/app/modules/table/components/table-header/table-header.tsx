import { Component } from 'react';

import styles from './table-header.module.scss';
import { TableHeadersProps } from '../../types/interfaces/table-header-props.interface';
import { I18nContext } from 'react-i18next';
import { Badge, Button, FormControl, IconButton, Input, InputAdornment } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { TableHeaderEvents } from '../../types/enums';
import { debounce } from 'lodash';

export class TableHeader<A, E> extends Component<TableHeadersProps<A>, { isSettingsEnabled: boolean, searchTerm: string }> {

  constructor(props: TableHeadersProps<A>) {
    super(props);
    this.state = {
      isSettingsEnabled: false,
      searchTerm: ''
    };
    this.dispatchSearchTerm = debounce(this.dispatchSearchTerm.bind(this), 300);
  }

  enableOrDisableSettings() {
    this.setState({ isSettingsEnabled: !this.state.isSettingsEnabled });
  }

  handleTableHeaderEvents(event: A | TableHeaderEvents, payload?: any) {
    if (this.props.onTableHeaderEvents) {
      this.props.onTableHeaderEvents(event, payload);
    }
  }

  dispatchSearchTerm() {
    this.handleTableHeaderEvents(TableHeaderEvents.SEARCH_CHANGE, this.state.searchTerm);
  }

  handleSearchChange(value: string) {
    this.setState({searchTerm: value});
    this.dispatchSearchTerm();
  }

  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <main className={`${styles['container']} ${this.state.isSettingsEnabled ? styles['edit-mode'] : ''}`}>
            <section className={styles['left-section']}>
              {
                this.state.isSettingsEnabled ?
                  <>
                    {this.props.editModeList.map(value => {
                      if (value.icon && value.iconPosition) {
                        if (value.iconPosition === 'start') {
                          return (
                            <Button key={value.i18nKey} onClick={() => this.handleTableHeaderEvents(value.action)} disabled={value.disabled} className={styles['button']} variant='outlined' startIcon={<value.icon />}>
                              {i18n.t(value.i18nKey)}
                            </Button>
                          )
                        } else {
                          return (
                            <Button key={value.i18nKey} onClick={() => this.handleTableHeaderEvents(value.action)} disabled={value.disabled} className={styles['button']} variant='outlined' endIcon={<value.icon />}>{i18n.t(value.i18nKey)}</Button>
                          )
                        }
                      } else {
                        return (
                          <Button key={value.i18nKey} onClick={() => this.handleTableHeaderEvents(value.action)} disabled={value.disabled} className={styles['button']} variant='outlined'>{i18n.t(value.i18nKey)}</Button>
                        )
                      }
                    })}
                  </>
                  :
                  <span className={styles['title']}>{i18n.t(this.props.title)}</span>}

            </section>
            <section className={styles['right-section']}>
              <FormControl className={styles['search-container']} variant='outlined'>
                <Input
                  id="search"
                  value={this.state.searchTerm}
                  onChange={(event) => this.handleSearchChange(event.target.value)}
                  placeholder={i18n.t('TABLE_HEADER.SEARCH_INPUT.PLACEHOLDER')}
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
              <IconButton disabled={!this.props.canShowFilter} className={styles['icon-btn']} onClick={() => this.handleTableHeaderEvents(TableHeaderEvents.OPEN_FILTER)}>
              <Badge className={styles['badge']} color={this.state.isSettingsEnabled ? 'error' : 'primary'} variant="dot" invisible={!this.props.isFilterApplied}>
                  <FilterAltOutlinedIcon />
              </Badge>
              </IconButton>
              <IconButton className={styles['icon-btn']} onClick={this.enableOrDisableSettings.bind(this)}>
                {
                  this.state.isSettingsEnabled ?
                    <ExitToAppOutlinedIcon /> :
                    <SettingsOutlinedIcon />
                }
              </IconButton>
            </section>
          </main>
        )}
      </I18nContext.Consumer>

    );
  }
}

export default TableHeader;
