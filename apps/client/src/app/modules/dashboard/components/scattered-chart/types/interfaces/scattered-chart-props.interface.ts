
export type ScatteredChartDataType = {
    [key:string]: number | string;
    fill: string
}[];
export interface ScatteredChartProps {
    xDataKey: string;
    yDataKey: string;
    zDatakey: string;
    data: ScatteredChartDataType;
    xDatai18nKey: string;
    yDatai18nKey: string;
    zDatai18nKey: string;

    xUnit?: string;
    yUnit?: string;
    zUnit?: string;
}