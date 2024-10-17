import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { ProductOutput } from "./product-output";

export const ListProductOutput = new GraphQLObjectType({
    name: 'ListProductOutput',
    fields: {
        rows: {
            type: new GraphQLList(ProductOutput)
        },
        totalRows: {
            type: GraphQLInt
        },

    }
})