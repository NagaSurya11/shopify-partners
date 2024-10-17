import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";

export const CategoryInput = new GraphQLInputObjectType({
    name: 'CategoryInput',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        subCategories: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString))
        }
    }
});
