import { LazyRouteFunction } from "react-router-dom";
import { notificationActions } from "../slices/notification.slice";
import { connect } from "react-redux";
import { withApolloClient } from "../graphql-client/hooks";
import { withRouter } from "../routing/hooks";

export const DashboardModule: LazyRouteFunction<any> = async () => {
    const { Dashboard }  = await import('./dashboard');
    const mapDispatchToProps = {
        showNotification: notificationActions.showNotification
    }
    return { Component: connect(null, mapDispatchToProps)(withApolloClient(withRouter(Dashboard))) };
}