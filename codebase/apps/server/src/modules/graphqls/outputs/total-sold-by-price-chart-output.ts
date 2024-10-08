import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const TotalSoldByPriceBarOrPieChartData = new GraphQLObjectType({
    name: 'TotalSoldByPriceBarOrPieChartData',
    fields: {
        total_sold: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});