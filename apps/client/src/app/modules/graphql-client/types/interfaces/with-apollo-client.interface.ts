import { ApolloClient } from "@apollo/client";

// Define the props to include Apollo Client
export interface WithApolloClientProps {
    client: ApolloClient<any>;
}