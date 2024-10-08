import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { CategoryInput } from "./category-input";
import { BetweenFloatInput } from "./between-input";

export const ProductFilterInput = new GraphQLInputObjectType({
    name: 'ProductFilterInput',
    fields: {
        categories: {
            type: new GraphQLList(CategoryInput)
        },
        actualPrice: {
            type: BetweenFloatInput
        },
        ratings: {
            type: BetweenFloatInput
        },
        selectedProductIds: {
            type: new GraphQLList(GraphQLID)
        }
    }
})