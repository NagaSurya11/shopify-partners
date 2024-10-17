import { render } from '@testing-library/react';

import {AuthProvider} from './auth-provider.tsx';

describe('AuthProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthProvider children={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
