import {  GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";

export const TotalPriceAndDiscountPrice = new GraphQLObjectType({
    name: 'TotalPriceAndDiscountPrice',
    fields: {
        totalPrice: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        discountPrice: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    }
});
