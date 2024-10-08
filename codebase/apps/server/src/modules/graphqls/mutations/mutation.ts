import { GraphQLObjectType } from "graphql";
import { AddProduct, AddProducts, UpdateProduct } from "./product.mutation";
import { CreateBundle } from "./bundle.mutation";

export const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        AddProduct,
        AddProducts,
        UpdateProduct,
        CreateBundle
    }
});