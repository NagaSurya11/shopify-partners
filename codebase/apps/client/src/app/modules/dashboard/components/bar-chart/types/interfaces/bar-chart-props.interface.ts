export type BarChartDataType = {
    [key: string]: number | string,
    name: string,
    fill: string
}[];
export interface BarChartProps {
    dataKey: string;
    /**
     * key should be same as dataKey
     */
    data: BarChartDataType;
    datai18nKey: string;
}