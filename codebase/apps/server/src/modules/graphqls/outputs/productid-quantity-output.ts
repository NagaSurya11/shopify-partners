import {  GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";

export const ProductIdQuantity = new GraphQLObjectType({
    name: 'ProductIdQuantity',
    fields: {
        product_id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        quantity: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
});
