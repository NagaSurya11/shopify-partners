import { Component } from 'react';

import styles from './edit-bundle.module.scss';
import { ManageBundleProps } from '../manage-bundle/types/interfaces';
import ManageBundle from '../manage-bundle/manage-bundle';

export class EditBundle extends Component<ManageBundleProps> {
  override render() {
    return (
      <ManageBundle {...this.props} mode='EDIT' />
    );
  }
}
