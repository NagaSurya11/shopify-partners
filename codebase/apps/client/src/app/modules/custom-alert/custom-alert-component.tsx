import { Component } from 'react';

import styles from './custom-alert-component.module.scss';
import { I18nContext } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { CustomAlertProps } from './types/interfaces/custom-alert-props.interface';
import CloseIcon from '@mui/icons-material/Close';


export class CustomAlertComponent extends Component<CustomAlertProps> {

  handleClose(value?: any) {
    this.props.onClose(value);
  }

  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Dialog
            PaperProps={{ className: styles['alert-container'] }}
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
              {i18n.t(this.props.contentText)}
            </DialogContent>
            <DialogActions className={styles['footer']}>
              <Button variant='outlined' color='primary' onClick={() => this.handleClose()}>
                {i18n.t(this.props.cancelText)}
              </Button>
              <Button focusRipple variant='contained' color={this.props.warn ? 'error' : 'primary'} onClick={() => this.handleClose(this.props.data ?? true)}>
                {i18n.t(this.props.confirmText)}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default CustomAlertComponent;
