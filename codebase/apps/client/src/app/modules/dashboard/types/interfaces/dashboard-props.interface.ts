import { AlertColor } from "@mui/material";
import { WithApolloClientProps } from "../../../graphql-client/types/interfaces";
import { WithRouterPropsInterface } from "../../../routing/types/interfaces";

interface DashboardPropsInterface {
    showNotification: (entity: {severity: AlertColor, message: string}) => void;
};

export type DashboardProps = DashboardPropsInterface & WithApolloClientProps & WithRouterPropsInterface;


