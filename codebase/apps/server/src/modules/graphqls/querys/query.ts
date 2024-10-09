import { GraphQLObjectType } from "graphql";
import { GetMainCategories, GetSubCategories , GetProductById, GetTotalPriceAndDiscountPrice, ListProducts } from "./product.queries";
import { GetBundleById, ListBundles, OrderBundle } from "./bundle.queries";
import { GetTotalSoldAndRevenueByPriceAreaChartData, GetTotalSoldByPriceScatteredChartData, GetTotalSoldByPriceBarOrPieChartData } from "./chart.queries";

export const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        ListProducts,
        GetProductById,
        GetBundleById,
        OrderBundle,
        GetTotalPriceAndDiscountPrice,
        ListBundles,
        GetTotalSoldByPriceBarOrPieChartData,
        GetTotalSoldByPriceScatteredChartData,
        GetTotalSoldAndRevenueByPriceAreaChartData,
        GetMainCategories,
        GetSubCategories
    }
})
