import { GraphQLFieldConfig, GraphQLList, Source } from "graphql";
import { TotalSoldAndRevenueByPriceAreaChart, TotalSoldByPriceBarOrPieChartData, TotalSoldByPriceScatteredChartData } from "../outputs";
import { ChartController } from "../../controllers";
import { isAuthenticated } from "../validators";

export const GetTotalSoldByPriceBarOrPieChartData: GraphQLFieldConfig<Source, Object, {}> = {
    type: new GraphQLList(TotalSoldByPriceBarOrPieChartData),
    resolve: (_, _args, context) => {
        isAuthenticated(context);
        return ChartController.GetTotalSoldByPriceBarOrPieChartData();
    }
}

export const GetTotalSoldByPriceScatteredChartData: GraphQLFieldConfig<Source, Object, {}> = {
    type: new GraphQLList(TotalSoldByPriceScatteredChartData),
    resolve: (_, _args, context) => {
        isAuthenticated(context);
        return ChartController.TotalSoldByPriceScatteredChartData();
    }
}

export const GetTotalSoldAndRevenueByPriceAreaChartData: GraphQLFieldConfig<Source, Object, {}> = {
    type: new GraphQLList(TotalSoldAndRevenueByPriceAreaChart),
    resolve: (_, _args, context) => {
        isAuthenticated(context);
        return ChartController.TotalSoldAndRevenueByPriceAreaChartData();
    }
}