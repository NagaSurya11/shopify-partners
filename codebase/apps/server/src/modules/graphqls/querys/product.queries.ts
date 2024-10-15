import { GraphQLList, GraphQLFieldConfig, Source, GraphQLNonNull, GraphQLID, GraphQLString } from "graphql";
import { ListProductOutput, ProductOutput, TotalPriceAndDiscountPrice } from "../outputs";
import { ProductController } from "../../controllers";
import { ListProductsInput, TotalPriceAndDiscountPriceInput } from "../inputs";
import { GetTotalAndDiscountPriceInput, ListProductsInput as IListProductInput, ProductFilterInput as IProductFilterInput } from '../../types/interfaces'
import { isAuthenticated } from "../validators";
import { ProductFilterInput } from "../inputs/product-filter-input";

export const ListProducts: GraphQLFieldConfig<Source, Object, { listProductsInput: IListProductInput }> = {
    type: ListProductOutput,
    args: {
        listProductsInput: {
            type: new GraphQLNonNull(ListProductsInput)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.FetchProducts(args.listProductsInput);
    }
}

export const GetProductById: GraphQLFieldConfig<Source, Object, { id: string }> = {
    type: ProductOutput,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.GetProductById(args.id);
    }
}

export const GetTotalPriceAndDiscountPrice: GraphQLFieldConfig<Source, Object, { input: GetTotalAndDiscountPriceInput }> = {
    type: TotalPriceAndDiscountPrice,
    args: {
        input: {
            type: new GraphQLNonNull(TotalPriceAndDiscountPriceInput)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.GetTotalPriceAndDiscountPrice(args.input);
    }
}

export const GetMainCategories: GraphQLFieldConfig<Source, Object, { selectedProductIds?: Array<string> }> = {
    type: new GraphQLList(GraphQLString),
    args: {
        selectedProductIds: {
            type: new GraphQLList(GraphQLString)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.GetMainCategories(args.selectedProductIds);
    }
}

export const GetSubCategories: GraphQLFieldConfig<Source, Object, { main_category: string,  selectedProductIds?: Array<string>}> = {
    type: new GraphQLList(GraphQLString),
    args: {
        main_category: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selectedProductIds: {
            type: new GraphQLList(GraphQLString)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.GetSubCategories(args.main_category, args.selectedProductIds);
    }
}

export const FetchAllProductIds: GraphQLFieldConfig<Source, Object, { filter: IProductFilterInput }> = {
    type: new GraphQLList(GraphQLString),
    args: {
        filter: {
            type: new GraphQLNonNull(ProductFilterInput)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return ProductController.FetchAllProductIds(args.filter);
    }
}