import { Component } from 'react';

import styles from './scattered-chart.module.scss';
import { ResponsiveContainer, ScatterChart as ReScattererdChart, XAxis, YAxis, Tooltip, Scatter, CartesianGrid, ZAxis, Cell } from 'recharts';
import { I18nContext } from 'react-i18next';
import { ScatteredChartProps } from './types/interfaces';

export class ScatteredChart extends Component<ScatteredChartProps> {
  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <ResponsiveContainer>
            <ReScattererdChart
              margin={{
                top: 20,
                right: 30,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey={this.props.xDataKey} name={i18n.t(this.props.xDatai18nKey)} unit={this.props.xUnit} />
              <YAxis type="number" dataKey={this.props.yDataKey} name={i18n.t(this.props.yDatai18nKey)} unit={this.props.yUnit} />
              <ZAxis type="number" dataKey={this.props.zDatakey} name={i18n.t(this.props.zDatai18nKey)} unit={this.props.zUnit} range={[100, 1000]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={this.props.data} fill="#8884d8">
                {this.props.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ReScattererdChart>
          </ResponsiveContainer>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default ScatteredChart;
