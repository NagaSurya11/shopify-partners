import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull } from "graphql";

export const BetweenFloatInput = new GraphQLInputObjectType({
    name: 'BetweenFloatInput',
    fields: {
        from: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        to: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    }
});
