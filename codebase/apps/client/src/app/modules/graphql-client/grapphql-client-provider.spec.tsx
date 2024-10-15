import { render } from '@testing-library/react';

import GrapphqlClient from './grapphql-client-provider';

describe('GrapphqlClient', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GrapphqlClient />);
    expect(baseElement).toBeTruthy();
  });
});
