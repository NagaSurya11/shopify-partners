import { Component } from 'react';
import styles from './core.module.scss';

import { getI18n } from 'react-i18next';
import { CorePropsInterface, CoreState } from './types/interfaces';
import { Outlet } from 'react-router-dom';
import SideNav from './components/side-nav/side-nav';
import Header from './components/header/header';

export class Core extends Component<CorePropsInterface, CoreState> {

  constructor(props: CorePropsInterface) {
    super(props);
    this.state = {
      isSideNavExpanded: false,
      activeRoutPath: '/'
    }
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


  toggleSideNav(isExpanded: boolean) {
    this.setState({ isSideNavExpanded: isExpanded });
  }

  override render() {
    return (
      <main className={`${styles['light-theme']} ${styles['main']}`}>
        <Header isSideNavExpanded={this.state.isSideNavExpanded} toggleSideNav={this.toggleSideNav.bind(this)} />
        <section className={`${styles['main-container']} ${this.state.isSideNavExpanded ? styles['expanded'] : ''}`}>
          <SideNav isSideNavExpanded={this.state.isSideNavExpanded} />
          <section className={styles['layout']}>
            <Outlet />
          </section>
        </section>
      </main>
    );
  }
}
export default Core;
