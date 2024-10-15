import { Component } from 'react';

import styles from './side-nav.module.scss';
import { List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';

import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import AddBoxTwoToneIcon from '@mui/icons-material/AddBoxTwoTone';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import { I18nContext } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { withRouter } from '../../../routing/hooks';
import { SideNavPropsInterface } from '../../types/interfaces';

class SideNav extends Component<SideNavPropsInterface, { activeRoutePath: string }> {
  sideNavList: { icon: JSX.Element, name: string, routePath: string }[];

  constructor(props: SideNavPropsInterface) {
    super(props);
    this.state = {
      activeRoutePath: '/'
    }
    this.sideNavList = [
      { icon: <DashboardTwoToneIcon />, name: 'SIDENAV.LISTITEMS.DASHBOARD', routePath: '/' },
      { icon: <AddBoxTwoToneIcon />, name: 'SIDENAV.LISTITEMS.CREATE_BUNDLE', routePath: '/create-bundle' },
      { icon: <EditNoteTwoToneIcon />, name: 'SIDENAV.LISTITEMS.EDIT_BUNDLE', routePath: '/edit-bundle' }
    ];
  }
  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <main className={`${styles['side-nav']} ${this.props.isSideNavExpanded ? styles['expanded'] : ''}`}>
            <List className={styles['list']}>
              {this.sideNavList.map(({ icon, name, routePath }, index) => (
                <Tooltip key={name + String(index)} title={i18n.t(name)} placement='right'>
                  <NavLink className={`${styles['link']} ${this.props.router.location.pathname === routePath ? styles['active'] : ''}`}
                    to={routePath}>
                    <ListItemButton className={styles['list-item-btn']}>
                      <ListItemIcon className={styles['list-item-btn-icon']}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={i18n.t(name)} className={styles['list-item-btn-text']}></ListItemText>
                    </ListItemButton>
                  </NavLink>
                </Tooltip>
              ))}
            </List>
          </main>
        )}
      </I18nContext.Consumer>

    );
  }
}

export default withRouter(SideNav);
