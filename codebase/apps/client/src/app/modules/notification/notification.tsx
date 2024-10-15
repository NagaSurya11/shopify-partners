import { Component } from 'react';

import styles from './notification.module.scss';
import { Alert, Snackbar } from '@mui/material';
import { NotificationProps } from './types/interfaces';
import { connect } from 'react-redux';
import { selectAllNotification, notificationActions } from "../slices/notification.slice";
import { RootState } from '../slices/root-state.interface';
import { EntityId } from '@reduxjs/toolkit';
import { I18nContext } from 'react-i18next';


export class Notification extends Component<NotificationProps> {
  constructor(props: NotificationProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    
  }
  handleClose(id: EntityId) {
    this.props.removeNotification(id);
  }
  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <div className={`${styles['container']} ${styles['light-theme']}`}>
            {this.props.notifications.map((notification, index) => (
              <Snackbar
                key={notification.id + index}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                open={notification.open}
                autoHideDuration={5000}
                onClose={() => this.handleClose(notification.id)}
                >
                <Alert
                  onClose={() => this.handleClose(notification.id)}
                  severity={notification.severity}
                  variant="filled"
                  className={`${styles['alert-background']} ${styles[notification.severity]}`}
                  sx={{ width: '100%' }}
                >
                  {i18n.t(notification.message)}
                </Alert>
              </Snackbar>
            ))}
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default connect(
  (state: RootState) => (
    {
      notifications: selectAllNotification(state)
    }
  ),
  {
    removeNotification: notificationActions.removeNotification

  })(Notification);
