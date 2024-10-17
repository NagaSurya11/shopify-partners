import { Auth0ProviderOptions } from "@auth0/auth0-react";
import { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";
import { Auth0ClientOptions } from '@auth0/auth0-spa-js';

export const keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'dev',
    clientId: 'shopify-partners-client'
};

export const keyCloakInitOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
    checkLoginIframe: false
}

export const auth0ProviderOptions: Auth0ProviderOptions | Auth0ClientOptions = {
    clientId: 'ocNWwGXKmcLyHICG7eP298BNCZJyzNUL',
    domain: 'dev-4sw1x68wd1xamebs.us.auth0.com',
    authorizationParams: {
        audience: 'https://dev-4sw1x68wd1xamebs.us.auth0.com/api/v2/',
        redirect_uri: window.location.origin
    }
}
