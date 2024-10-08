import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { FlatBundleOutput } from "./flat-bundle-output";

export const ListBundleOutput = new GraphQLObjectType({
    name: 'ListBundleOutput',
    fields: {
        rows: {
            type: new GraphQLList(FlatBundleOutput)
        },
        totalRows: {
            type: GraphQLInt
        },

    }
})