import { render } from '@testing-library/react';

import TableBody from './table-body';
import { TableBodyActions } from '../../types/enums';

describe('TableBody', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TableBody columns={[]} idColumnName={''} rows={[]} onTableBodyEvents={function (event: TableBodyActions, payload?: any): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
