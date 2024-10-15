import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const BundleSearchOutput = new GraphQLObjectType({
    name: 'BundleSearchOutput',
    fields: {
        bundle_id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});