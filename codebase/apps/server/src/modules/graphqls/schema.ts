import { GraphQLSchema } from "graphql";
import { mutation } from "./mutations/mutation";
import { query } from "./querys/query";

export const schema = new GraphQLSchema({
    query,
    mutation
})