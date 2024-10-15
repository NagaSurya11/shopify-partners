import { render } from '@testing-library/react';

import TableFilter from './table-filter';

describe('TableFilter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TableFilter />);
    expect(baseElement).toBeTruthy();
  });
});
