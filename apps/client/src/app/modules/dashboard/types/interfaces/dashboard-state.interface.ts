import { AreaChartDataType } from "../../components/area-chart/types/interfaces";
import { BarChartDataType } from "../../components/bar-chart/types/interfaces";
import { PieChartDataType } from "../../components/pie-chart/types/interfaces";
import { ScatteredChartDataType } from "../../components/scattered-chart/types/interfaces";

export interface DashboardState {
    totalSoldVsPriceRangePieChartData: {
        isLoading: boolean;
        data: PieChartDataType;
    },
    totalSoldVsPriceRangeBarChartData: {
        isLoading: boolean;
        data: BarChartDataType;
    },
    totalSoldVsPriceVsRevenueScatteredChartData: {
        isLoading: boolean;
        data: ScatteredChartDataType;
    },
    totalSoldVsRevenueVSPriceAreaChartData: {
        isLoading: boolean;
        data: AreaChartDataType;
    }
}