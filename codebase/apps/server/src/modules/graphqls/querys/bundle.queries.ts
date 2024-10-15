import { GraphQLFieldConfig, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString, Source } from "graphql";
import { BundleOutput, BundleSearchOutput, ListBundleOutput } from "../outputs";
import { BundleController } from "../../controllers";
import { ListBundleInput } from "../../types/interfaces";
import { ListBundlesInput } from "../inputs";
import { isAuthenticated } from "../validators";

export const GetBundleById: GraphQLFieldConfig<Source, Object, { id: string }> = {
    type: BundleOutput,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return BundleController.GetBundleById(args.id);
    }
}

export const OrderBundle: GraphQLFieldConfig<Source, Object, { id: string }> = {
    type: BundleOutput,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return BundleController.OrderBundle(args.id)
    }
}

export const ListBundles: GraphQLFieldConfig<Source, Object, { listBundlesInput: ListBundleInput }> = {
    type: ListBundleOutput,
    args: {
        listBundlesInput: {
            type: ListBundlesInput
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context)
        return BundleController.FetchBundles(args.listBundlesInput)
    }
}

export const SearchBundles: GraphQLFieldConfig<Source, Object, { searchTerm: string }> = {
    type: new GraphQLList(BundleSearchOutput),
    args: {
        searchTerm: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context)
        return BundleController.SearchBundlesByName(args.searchTerm)
    }
}