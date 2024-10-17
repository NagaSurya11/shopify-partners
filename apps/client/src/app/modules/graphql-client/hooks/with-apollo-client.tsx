import React, { Component, FC } from 'react';
import { useApolloClient } from '@apollo/client';
import { WithApolloClientProps } from '../types/interfaces';



// Higher-Order Component (HOC) to inject Apollo Client
export const withApolloClient = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithApolloClientProps>
): FC<P> => {
  return (props: P) => {
    const client = useApolloClient();

    return <WrappedComponent {...props} client={client} />;
  };
};
