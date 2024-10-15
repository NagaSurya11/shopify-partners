export type PieChartDataType = {
    [key: string]: number | string,
    name: string,
    fill: string
}[];
export interface PieChartProps {
    dataKey: string;
    /**
     * key should be same as dataKey
     */
    data: PieChartDataType; 
}