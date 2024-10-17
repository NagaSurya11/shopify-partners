import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ProductIdQuantity } from "./productid-quantity-output";

export const BundleOutput = new GraphQLObjectType({
    name: 'BundleOutput',
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
        },
        Products: {
            type: new GraphQLNonNull(new GraphQLList(ProductIdQuantity))
        }
    }
});
