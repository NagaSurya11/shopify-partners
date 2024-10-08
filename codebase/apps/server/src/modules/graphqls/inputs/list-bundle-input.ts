import { GraphQLInputObjectType, GraphQLNonNull } from "graphql";
import { PageInput } from "./page-input";
import { SortInput } from "./sort-input";
import { BundleFilterInput } from "./bundle-filter-input";

export const ListBundlesInput = new GraphQLInputObjectType({
    name: 'ListBundlesInput',
    fields: {
        page: {
            type: new GraphQLNonNull(PageInput)
        },
        sort: {
            type: SortInput
        },
        filter: {
            type: BundleFilterInput
        }
    }
});