import { render } from '@testing-library/react';

import AuthProvider from './auth-provider';

describe('AuthProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthProvider />);
    expect(baseElement).toBeTruthy();
  });
});
