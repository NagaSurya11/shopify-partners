import { Component } from 'react';
import React, { useCallback, useState } from "react";
import { PieChart as RePieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import styles from './pie-chart.module.scss';
import { PieChartProps, PieChartState } from './types/interfaces';

export class PieChart extends Component<PieChartProps, PieChartState> {
  constructor(props: PieChartProps) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.setActiveIndex = this.setActiveIndex.bind(this);
  }
  setActiveIndex(_: any, activeIndex: number) {
    this.setState({ activeIndex });
  }

  override render() {
    const renderActiveShape = (props: any) => {
      const RADIAN = Math.PI / 180;
      const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value,
      } = props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 10) * cos;
      const sy = cy + (outerRadius + 10) * sin;
      const mx = cx + (outerRadius + 30) * cos;
      const my = cy + (outerRadius + 30) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? "start" : "end";

      return (
        <g>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
            {payload.name}
          </text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
          />
          <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={fill}
            fill="none"
          />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill="#333"
          >{`PV ${value}`}</text>
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={18}
            textAnchor={textAnchor}
            fill="#999"
          >
            {`(Rate ${(percent * 100).toFixed(2)}%)`}
          </text>
        </g>
      );
    };

    return (
      <ResponsiveContainer className={styles['container']}>
        <RePieChart
          margin={{
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
          }}
        >
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.props.data}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            dataKey={this.props.dataKey}
            onMouseEnter={this.setActiveIndex}
          >
            {this.props.data.map((value, index) => (
              <Cell key={`cell-${index}`} fill={value.fill} />
            ))}
          </Pie>
        </RePieChart>
      </ResponsiveContainer>
    );
  }
}

export default PieChart;
