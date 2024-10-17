import { LazyRouteFunction } from "react-router-dom";
import { notificationActions } from "../slices/notification.slice";
import { connect } from "react-redux";
import { withApolloClient } from "../graphql-client/hooks";
import { withRouter } from "../routing/hooks";

export const CreateBundleModule: LazyRouteFunction<any> = async () => {
    const { CreateBundle }  = await import('./create-bundle');
    const mapDispatchToProps = {
        showNotification: notificationActions.showNotification
    }
    return { Component: connect(null, mapDispatchToProps)(withApolloClient(withRouter(CreateBundle))) };
}