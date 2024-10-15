export interface BarChartSingleData {
    name: string;
    total_sold: string;
    fill?: string;
}

export interface ScatteredChartSingleData {
    total_sold: number;
    bundle_price: number;
    revenue: number;
    fill?: string;
}

export type TotalSoldByPriceBarOrPieChart = Array<BarChartSingleData>;
export type TotalSoldByPriceScatteredChartData = Array<ScatteredChartSingleData>;