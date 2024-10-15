import { Component } from 'react';

import styles from './grapphql-client.module.scss';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { AuthContextConsumer } from '../auth';
import { ApolloProvider } from '@apollo/client';
import { GraphQLClientProviderProps } from './types/interfaces';

export class GrapphqlClientProvider extends Component<GraphQLClientProviderProps> {

  constructor(props: GraphQLClientProviderProps) {
    super(props);

  }
  getApolloClient(token: string) {
    const apolloLink = createHttpLink({
      uri: 'http://localhost:3333/api/graphql',
      headers: {
        Authorization: token
      }
    })
    return new ApolloClient({
      link: apolloLink,
      cache: new InMemoryCache()
    })
  }

  override render() {
    return (
      <AuthContextConsumer>
        {(value) => (
          <ApolloProvider client={this.getApolloClient(value.getToken())}>
            {this.props.children}
          </ApolloProvider>
        )}
      </AuthContextConsumer>
    );
  }
}
