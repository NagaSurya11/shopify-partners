import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { SortOrder } from "../enums";

export const SortInput = new GraphQLInputObjectType({
    name: 'SortInput',
    fields: {
        sortBy: {
            type: new GraphQLNonNull(GraphQLString)
        },
        sortOrder: {
            type: new GraphQLNonNull(SortOrder)
        }
    }
});