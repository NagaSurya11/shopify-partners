import { GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";

export const ProductInput = new GraphQLInputObjectType({
    name: 'ProductInput',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        main_category: {
            type: new GraphQLNonNull(GraphQLString)
        },
        sub_category: {
            type: new GraphQLNonNull(GraphQLString)
        },
        image: {
            type: new GraphQLNonNull(GraphQLString)
        },
        ratings: {
            type: GraphQLFloat
        },
        no_of_ratings: {
            type: GraphQLInt
        },
        actual_price: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    }
});
