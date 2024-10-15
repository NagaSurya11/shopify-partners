import { ApolloClient, ApolloError, ApolloQueryResult, FetchResult, gql, OperationVariables } from "@apollo/client";
import { catchError, from, map } from "rxjs";

export abstract class AbstractCRUDRepository {
    private client: ApolloClient<any>;
    constructor(client: ApolloClient<any>) {
        this.client = client;
    }

    protected watchQuery<T>(query: string, variables?: OperationVariables) {
        return this.client.watchQuery<T>({
            query: gql(query),
            variables: variables ?? {}
        }).map(result => this.responseHandler<T>(result));
    }

    protected mutate<T>(mutation: string, variables: OperationVariables) {
        return from(
            this.client.mutate({
                mutation: gql(mutation),
                variables: variables ?? {}
            })
        ).pipe(
            map((response) => this.responseHandler<T>(response)),
            catchError((error: ApolloError) => {
                console.error('Mutation error: ', error);
                throw new Error(this.errorExtracter(error))
            })
        );
    }

    private responseHandler<T>(result: ApolloQueryResult<T> | FetchResult<T>) {
        if (!!result.errors && result.errors.length > 0) {
            console.error(result.errors[0].message);
            throw new Error(result.errors[0]?.extensions && result.errors[0]?.extensions['code'] ? result.errors[0]?.extensions['code'] as string: 'INTERNAL_SERVER_ERROR');
        }
        return result.data;
    }

    public errorExtracter(error: ApolloError) {
        return error.graphQLErrors[0]?.extensions && error.graphQLErrors[0]?.extensions['code'] ? error.graphQLErrors[0]?.extensions['code'] as string: 'INTERNAL_SERVER_ERROR';
    }
}