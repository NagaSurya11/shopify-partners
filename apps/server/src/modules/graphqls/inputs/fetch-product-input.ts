import { GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { PageInput } from "./page-input";
import { SortInput } from "./sort-input";
import { ProductFilterInput } from "./product-filter-input";

export const ListProductsInput = new GraphQLInputObjectType({
    name: 'ListProductsInput',
    fields: {
        page: {
            type: new GraphQLNonNull(PageInput)
        },
        sort: {
            type: SortInput
        },
        filter: {
            type: ProductFilterInput
        }
    }
});
