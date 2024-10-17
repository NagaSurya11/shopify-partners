import { render } from '@testing-library/react';

import ScatteredChart from './scattered-chart';

describe('ScatteredChart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ScatteredChart />);
    expect(baseElement).toBeTruthy();
  });
});
