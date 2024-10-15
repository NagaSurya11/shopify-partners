import { Component } from 'react';

import styles from './view-details.module.scss';
import { ViewDetailsProps } from './types/interfaces';
import { I18nContext } from 'react-i18next';
import { Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Rating } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export class ViewDetails extends Component<ViewDetailsProps, {currentImageIndex: number}> {
  constructor(props: ViewDetailsProps) {
    super(props);
    this.state = {
      currentImageIndex: 0
    };
  }
  handleClose(value?: any) {
    this.setState({currentImageIndex: 0});
    this.props.onClose(value);
  }
  handleImageCarouselPageChange(pageNumber: number) {
    this.setState({currentImageIndex: pageNumber - 1});
  }
  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Dialog
            PaperProps={{ className: styles['view-details'] }}
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
                !!this.props.breadCrumbs
                && this.props.breadCrumbs.length > 0
                && (
                  <Breadcrumbs aria-label="breadcrumb">
                    {this.props.breadCrumbs.map((value, index) => (
                      <span className={styles['bread-crumb-text']} key={index}>{value}</span>
                    ))}
                  </Breadcrumbs>
                )
              }
              {
                !!this.props.images
                && this.props.images.length > 0
                && (
                  <div className={styles['carousel']}>
                    <div className={styles['image-container']}>
                      <img className={styles['image']} src={this.props.images[this.state.currentImageIndex]} alt={`carousel-img-${0}`}></img>
                    </div>
                    <Pagination siblingCount={0} color='primary' size='small' onChange={(_, page) => this.handleImageCarouselPageChange(page)} count={this.props.images.length} showFirstButton showLastButton></Pagination>
                  </div>
                )
              }
              {
                this.props.name && 
                (
                  <span className={styles['name-text']}>{this.props.name}</span>
                )
              }
              {
                (this.props.price || this.props.price === 0) &&
                <span className={styles['price-text']}>{this.props.currencySymbol ?? ''} {this.props.price}</span>
              }
              {
                (this.props.ratings || this.props.ratings === 0) &&
                (this.props.noOfRatings || this.props.noOfRatings === 0) &&
                <section className={styles['ratings-container']}>
                  <Rating size='small' name="half-rating" defaultValue={this.props.ratings} precision={0.1} readOnly />
                  <span className={styles['no-of-ratings-text']}>{this.props.noOfRatings} {i18n.t('VIEW_DETAILS.NO_OF_RATINGS')}</span>
                </section>
              }
              {
                (this.props.totalSold || this.props.totalSold === 0) &&
                <section className={styles['total-sold-container']}>
                  <span className={styles['label']}>{i18n.t('VIEW_DETAILS.TOTAL_SOLD')}</span>
                  <span className={styles['value']}>{this.props.totalSold}</span>
                </section>
              }
              {
                (this.props.discountPercentage || this.props.discountPercentage === 0) &&
                <section className={styles['discount-percentage']}>
                  <span className={styles['label']}>{i18n.t('VIEW_DETAILS.DISCOUNT_PERCENTAGE')}</span>
                  <span className={styles['value']}>{this.props.discountPercentage}%</span>
                </section>
              }
            </DialogContent>
            <DialogActions className={styles['footer']}>
              <Button variant='outlined' color='primary' onClick={() => this.handleClose()}>
                {i18n.t(this.props.cancelText)}
              </Button>
              <Button focusRipple variant='contained' color='primary' onClick={() => this.handleClose(this.props.data ?? true)}>
                {i18n.t(this.props.confirmText)}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default ViewDetails;
