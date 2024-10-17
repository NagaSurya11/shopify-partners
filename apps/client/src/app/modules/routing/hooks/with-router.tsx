import React, { ReactElement } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { WithRouterPropsInterface } from '../types/interfaces';

// Define the custom withRouter higher-order component
export function withRouter<P>(Component: React.ComponentType<P & WithRouterPropsInterface>) {
  const ComponentWithRouterProp = (props: Omit<P, keyof WithRouterPropsInterface>): ReactElement => {
    // Get routing props using hooks
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        {...(props as P)} // Pass through original props
        router={{ location, navigate, params }} // Pass routing props
      />
    );
  };

  return ComponentWithRouterProp;
}