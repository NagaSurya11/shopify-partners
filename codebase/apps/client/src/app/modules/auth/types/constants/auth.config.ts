import { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";

export const keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'dev',
    clientId: 'shopify-partners-client'
};

export const keyCloakInitOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
    checkLoginIframe: false
}

