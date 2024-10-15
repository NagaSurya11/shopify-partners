import { GraphQLObjectType } from "graphql";
import { GetMainCategories, GetSubCategories , GetProductById, GetTotalPriceAndDiscountPrice, ListProducts, FetchAllProductIds } from "./product.queries";
import { GetBundleById, ListBundles, OrderBundle, SearchBundles } from "./bundle.queries";
import { GetTotalSoldAndRevenueByPriceAreaChartData, GetTotalSoldByPriceScatteredChartData, GetTotalSoldByPriceBarOrPieChartData } from "./chart.queries";

export const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        ListProducts,
        FetchAllProductIds,
        GetProductById,
        GetBundleById,
        OrderBundle,
        GetTotalPriceAndDiscountPrice,
        ListBundles,
        GetTotalSoldByPriceBarOrPieChartData,
        GetTotalSoldByPriceScatteredChartData,
        GetTotalSoldAndRevenueByPriceAreaChartData,
        GetMainCategories,
        GetSubCategories,
        SearchBundles
    }
})
