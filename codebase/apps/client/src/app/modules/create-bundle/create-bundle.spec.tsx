import { render } from '@testing-library/react';

import CreateBundle from './create-bundle';

describe('CreateBundle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateBundle />);
    expect(baseElement).toBeTruthy();
  });
});
