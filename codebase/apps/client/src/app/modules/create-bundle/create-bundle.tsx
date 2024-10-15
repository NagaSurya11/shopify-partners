import { Component } from 'react';

import styles from './create-bundle.module.scss';
import { ManageBundleCore } from '../manage-bundle/manage-bundle';
import { ManageBundleProps, ManageBundleWrapperProps } from '../manage-bundle/types/interfaces';

export class CreateBundle extends Component<ManageBundleProps> {
  constructor(props: ManageBundleProps) {
    super(props);
  }
  override render() {
    return (
      <ManageBundleCore {...this.props} mode='CREATE' />
    );
  }
}

export default CreateBundle;
