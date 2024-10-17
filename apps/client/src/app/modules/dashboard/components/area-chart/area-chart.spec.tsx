import { render } from '@testing-library/react';

import AreaChart from './area-chart';

describe('AreaChart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AreaChart />);
    expect(baseElement).toBeTruthy();
  });
});
