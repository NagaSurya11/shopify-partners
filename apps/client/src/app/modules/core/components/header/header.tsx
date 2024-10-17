import { Component } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import styles from './header.module.scss';
import Avatar from '@mui/material/Avatar';
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { AuthContextConsumer } from '../../../auth';
import Logout from '@mui/icons-material/Logout';
import { getI18n } from 'react-i18next';
import { HeaderProps } from '../../types/interfaces';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import Check from '@mui/icons-material/Check';
import { I18nContext } from 'react-i18next';


class Header extends Component<HeaderProps, { anchorEL: Element | null }> {
  languageList: { i18nKey: string, languageKey: string }[] = [
    {
      i18nKey: 'HEADER.PROFILE.MENUITEMS.LANGUAGES.ENGLISH_US',
      languageKey: 'en-US'
    },
    {
      i18nKey: 'HEADER.PROFILE.MENUITEMS.LANGUAGES.GERMAN_GERMANY',
      languageKey: 'de-DE'
    },
  ]
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      anchorEL: null
    }
  }
  handleUserProfileClick(event: React.MouseEvent) {
    this.setState({ anchorEL: event.currentTarget });
  }

  handleUserProfileMenuClose() {
    this.setState({ anchorEL: null });
  }

  handleLogout(logout: () => void) {
    logout();
    this.handleUserProfileMenuClose();
  }

  changeLanguage(languageKey: string) {
    getI18n().changeLanguage(languageKey);
    this.handleUserProfileMenuClose();
  }

  stringAvatar(firstName?: string, lastName?: string) {
    if (firstName && lastName) {
      return {
        children: `${firstName.charAt(0)}${lastName.charAt(0)}`,
      };
    }
    return {};
  }

  override render() {
    const { isSideNavExpanded, toggleSideNav } = this.props;
    return (
      <AuthContextConsumer>
        {({ userProfile, logout }) => (
          <I18nContext.Consumer>
            {({ i18n }) => (
              <header className={styles['header']}>
                <section className={styles['title-section']}>
                  {isSideNavExpanded ?
                    <Tooltip title={i18n.t('HEADER.MENU_ICON.TOOLTIP.COLLAPSE')} placement='bottom'>
                      <MenuOpenIcon className={styles['hamburger']} onClick={() => toggleSideNav(false)} />
                    </Tooltip>
                    : <Tooltip title={i18n.t('HEADER.MENU_ICON.TOOLTIP.EXPAND')} placement='bottom'>
                      <MenuOutlinedIcon className={styles['hamburger']} onClick={() => toggleSideNav(true)} />
                    </Tooltip>}
                  <span className={styles['app-name']}>
                    Shopify Partners
                  </span>
                </section>
                <span className={styles['user-profile']} onClick={this.handleUserProfileClick.bind(this)}>
                  <Avatar className={styles['avator']} src={userProfile.profilePicture} />
                  {userProfile.name}
                  <KeyboardArrowDownIcon className={styles['chevron-down-icon']} />
                </span>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={this.state.anchorEL}
                  open={Boolean(this.state.anchorEL)}
                  onClose={this.handleUserProfileMenuClose.bind(this)}
                  anchorOrigin={{
                    vertical: 'bottom',  // Opens below the clicked div
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <LanguageOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>{i18n.t('HEADER.PROFILE.MENUITEMS.CHOOSE_LANGUAGE')}</ListItemText>
                  </MenuItem>
                  {this.languageList.map(({ i18nKey, languageKey }) => (
                    <MenuItem key={languageKey} onClick={() => this.changeLanguage(languageKey)}>
                      {i18n.language === languageKey ?
                        <>
                          <ListItemIcon>
                            <Check />
                          </ListItemIcon>
                          <ListItemText>{i18n.t(i18nKey)}</ListItemText>
                        </>
                        : <ListItemText inset>{i18n.t(i18nKey)}</ListItemText>}
                    </MenuItem>
                  ))}
                  <Divider className={styles['divider']} />
                  <MenuItem onClick={() => this.handleLogout(logout)}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {i18n.t('HEADER.PROFILE.MENUITEMS.LOGOUT')}
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </header>
            )}
          </I18nContext.Consumer>
        )}
      </AuthContextConsumer>

    );
  }
}

export default Header;
