import { render } from '@testing-library/react';

import EditBundle from './edit-bundle';

describe('EditBundle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditBundle />);
    expect(baseElement).toBeTruthy();
  });
});
