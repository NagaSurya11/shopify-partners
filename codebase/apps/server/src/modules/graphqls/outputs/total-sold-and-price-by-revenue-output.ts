import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const TotalSoldByPriceScatteredChartData = new GraphQLObjectType({
    name: 'TotalSoldByPriceScatteredChartData',
    fields: {
        total_sold: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        bundle_price: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        revenue: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        fill: {
            type: GraphQLString
        }
    }
});