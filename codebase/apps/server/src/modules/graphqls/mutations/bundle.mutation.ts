import { GraphQLFieldConfig, GraphQLNonNull, Source } from "graphql";
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