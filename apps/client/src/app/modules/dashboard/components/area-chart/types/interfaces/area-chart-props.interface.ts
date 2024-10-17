export type AreaChartDataType = {
    [key: string]: number | string;
}[];
export interface AreaChartProps {
    xDataKey: string;
    yDataKey: string;
    data: AreaChartDataType;
    xDatai18nKey: string;
    yDatai18nKey: string;

    xUnit?: string;
    yUnit?: string;
}