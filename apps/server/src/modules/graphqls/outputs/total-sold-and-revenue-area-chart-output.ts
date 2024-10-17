import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const TotalSoldAndRevenueByPriceAreaChart = new GraphQLObjectType({
    name: 'TotalSoldAndRevenueByPriceAreaChart',
    fields: {
        total_sold: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        revenue: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    }
});