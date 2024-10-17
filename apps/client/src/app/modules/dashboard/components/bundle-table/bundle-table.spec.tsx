import { render } from '@testing-library/react';

import BundleTable from './bundle-table';

describe('BundleTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BundleTable />);
    expect(baseElement).toBeTruthy();
  });
});
