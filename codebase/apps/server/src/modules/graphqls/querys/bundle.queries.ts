import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, Source } from "graphql";
import { BundleOutput, ListBundleOutput } from "../outputs";
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