import { GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { ProductIdQuantityInput } from "./productid-quantity-input";

export const TotalPriceAndDiscountPriceInput = new GraphQLInputObjectType({
    name: 'TotalPriceAndDiscountPriceInput',
    fields: {
        products: {
            type: new GraphQLNonNull(new GraphQLList(ProductIdQuantityInput))
        },
        discount_percentage: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    }
});
