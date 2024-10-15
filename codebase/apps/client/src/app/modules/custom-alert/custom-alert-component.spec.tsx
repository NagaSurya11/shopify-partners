import { render } from '@testing-library/react';

import CustomAlertComponent from './custom-alert-component';

describe('CustomAlertComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomAlertComponent />);
    expect(baseElement).toBeTruthy();
  });
});
