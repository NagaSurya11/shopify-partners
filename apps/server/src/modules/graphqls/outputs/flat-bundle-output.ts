import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const FlatBundleOutput = new GraphQLObjectType({
    name: 'FlatBundleOutput',
    fields: {
        bundle_id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        discount_percentage: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        total_sold: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        bundle_price: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    }
});
