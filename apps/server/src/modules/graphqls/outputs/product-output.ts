import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const ProductOutput = new GraphQLObjectType({
    name: 'Product',
    fields: {
        product_id: {
            type: new GraphQLNonNull(GraphQLID)
        },
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
            type: new GraphQLNonNull(GraphQLFloat)
        },
        no_of_ratings: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        actual_price: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    }
});
