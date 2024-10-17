import { Component } from 'react';

import styles from './area-chart.module.scss';
import { Area, CartesianGrid, AreaChart as ReAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { I18nContext } from 'react-i18next';
import { AreaChartProps } from './types/interfaces';

export class AreaChart extends Component<AreaChartProps> {
  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <ResponsiveContainer>
            <ReAreaChart
              width={500}
              height={400}
              data={this.props.data}
              margin={{
                top: 20,
                right: 50,
                left: 20,
                bottom: 20
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={this.props.xDataKey}
                name={i18n.t(this.props.xDatai18nKey)}
                unit={this.props.xUnit}
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey={this.props.yDataKey}
                name={i18n.t(this.props.yDatai18nKey)}
                unit={this.props.yUnit}
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </ReAreaChart>
          </ResponsiveContainer>
        )}
      </I18nContext.Consumer>

    );
  }
}

export default AreaChart;
