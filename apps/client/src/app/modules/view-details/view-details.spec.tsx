import { render } from '@testing-library/react';

import ViewDetails from './view-details';

describe('ViewDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewDetails />);
    expect(baseElement).toBeTruthy();
  });
});
