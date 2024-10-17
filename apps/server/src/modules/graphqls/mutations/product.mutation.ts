
import { GraphQLFieldConfig, GraphQLID, GraphQLList, GraphQLNonNull, Source } from "graphql";
import { ProductOutput } from "../outputs";
import { ProductInput } from "../inputs";
import { OProduct } from "../../types/interfaces";
import { ProductController } from "../../controllers";
import { isAuthenticated } from "../validators";


export const AddProducts: GraphQLFieldConfig<Source, Object, { products: Array<OProduct> }> = {
    type: new GraphQLList(ProductOutput),
    args: {
        products: {
            type: new GraphQLNonNull(new GraphQLList(ProductInput))
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.AddProducts(args.products);
    }
}

export const AddProduct: GraphQLFieldConfig<Source, Object, { product: OProduct }> = {
    type: ProductOutput,
    args: {
        product: {
            type: new GraphQLNonNull(ProductInput)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.AddProduct(args.product);
    }
}

export const UpdateProduct: GraphQLFieldConfig<Source, Object, { product_id: string, product: OProduct }> = {
    type: ProductOutput,
    args: {
        product_id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        product: {
            type: new GraphQLNonNull(ProductInput)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.UpdateProduct(args.product_id, args.product);
    }
}

