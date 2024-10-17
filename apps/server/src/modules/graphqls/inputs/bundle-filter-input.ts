import { GraphQLInputObjectType } from "graphql";
import { BetweenFloatInput } from "./between-input";

export const BundleFilterInput = new GraphQLInputObjectType({
    name: 'BundleFilterInput',
    fields: {
        discount_percentage: {
            type: BetweenFloatInput
        },
        total_sold: {
            type: BetweenFloatInput
        },
        bundle_price: {
            type: BetweenFloatInput
        }
    }
})