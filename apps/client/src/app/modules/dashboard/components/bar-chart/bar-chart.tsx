import { Component } from 'react';

import styles from './bar-chart.module.scss';
import { XAxis, BarChart as ReBarChart, Bar, CartesianGrid, Tooltip, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { BarChartProps } from './types/interfaces';
import { I18nContext } from 'react-i18next';

export class BarChart extends Component<BarChartProps> {
  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <ResponsiveContainer>
            <ReBarChart
              data={this.props.data}
              margin={{
                top: 20,
                right: 40,
                left: 0,
                bottom: 20
              }}
              barSize={20}
            >
              <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey={this.props.dataKey} name={i18n.t(this.props.datai18nKey)} background={{ fill: "#eee" }}>
                {this.props.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default BarChart;
