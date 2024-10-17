import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from "graphql";

export const ProductIdQuantityInput = new GraphQLInputObjectType({
    name: 'ProductIdQuantityInput',
    fields: {
        product_id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        quantity: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
});
