
import { AlertColor } from "@mui/material";
import { WithApolloClientProps } from "../../../graphql-client/types/interfaces";
import { WithRouterPropsInterface } from "../../../routing/types/interfaces";
interface ManageBundlePropsInterface {
    showNotification: (entity: {severity: AlertColor, message: string}) => void;
}

export type ManageBundleProps = ManageBundleWrapperProps & ManageBundlePropsInterface & WithApolloClientProps & WithRouterPropsInterface;

export interface ManageBundleWrapperProps {
    mode: 'EDIT' | 'CREATE';
}