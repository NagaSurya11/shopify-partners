import { Component } from 'react';

import styles from './table.module.scss';
import TableHeader from './components/table-header/table-header';
import TableBody from './components/table-body/table-body';
import TableFooter from './components/table-footer/table-footer';
import { TableProps } from './types/interfaces';
import { getI18n } from 'react-i18next';
import TableFilter from './components/table-filter/table-filter';

export class Table<A, T, E> extends Component<TableProps<A, T, E>> {
  constructor(props: TableProps<A, T, E>) {
    super(props);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  componentDidMount() {
    // Listen for language changes
    getI18n().on('languageChanged', this.handleLanguageChange);
  }

  componentWillUnmount() {
    // Remove the event listener when the component unmounts
    getI18n().off('languageChanged', this.handleLanguageChange);
  }

  handleLanguageChange() {
    this.forceUpdate();
  }

  override render() {
    return (
      <main className={styles['container']}>
        <TableHeader {...this.props.headerData} />
        <TableBody {...this.props.rootData} />
        <TableFooter {...this.props.footerData} />
        <TableFilter {...this.props.filterData} />
      </main>
    );
  }
}

export default Table;
