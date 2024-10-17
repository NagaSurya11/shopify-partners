import { GraphQLFieldConfig, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString, Source } from "graphql";
import { BundleOutput } from "../outputs";
import { BundleController } from "../../controllers";
import { CreateBundleInput as ICreateBundleInput } from "../../types/interfaces";
import { CreateBundleInput } from "../inputs";
import { isAuthenticated } from "../validators";

export const CreateBundle: GraphQLFieldConfig<Source, Object, { input: ICreateBundleInput }> = {
    type: BundleOutput,
    args: {
        input: {
            type: new GraphQLNonNull(CreateBundleInput)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return BundleController.CreateBundle(args.input);
    }
}

export const UpdateBundle: GraphQLFieldConfig<Source, Object, { input: ICreateBundleInput, bundle_id: string }> = {
    type: BundleOutput,
    args: {
        input: {
            type: new GraphQLNonNull(CreateBundleInput)
        },
        bundle_id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return BundleController.UpdateBundle(args.input, args.bundle_id);
    }
}

export const DeleteBundles: GraphQLFieldConfig<Source, Object, { bundleIds: Array<string> }> = {
    type: GraphQLString,
    args: {
        bundleIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString))
        }
    },
    resolve: (_, args, context) => {
        isAuthenticated(context);
        return BundleController.DeleteBundles(args.bundleIds);
    }
}