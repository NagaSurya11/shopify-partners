import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { ProductIdQuantityInput } from "./productid-quantity-input";

export const CreateBundleInput = new GraphQLInputObjectType({
    name: 'CreateBundleInput',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        discount_percentage: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        products: {
            type: new GraphQLNonNull(new GraphQLList(ProductIdQuantityInput))
        }
    }
});
