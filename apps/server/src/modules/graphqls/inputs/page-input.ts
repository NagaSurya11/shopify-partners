import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from "graphql";
import { PageSize } from "../enums";

export const PageInput = new GraphQLInputObjectType({
    name: 'Page',
    fields: {
        size: {
            type: new GraphQLNonNull(PageSize)
        },
        number: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
});
