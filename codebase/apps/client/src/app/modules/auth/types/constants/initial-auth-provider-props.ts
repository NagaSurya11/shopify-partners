import { KeycloakProfile } from "keycloak-js";
import { AuthProviderState } from "../interfaces";

export const initialAuthProviderState: AuthProviderState = {
    isAuthenticated: false,
    getToken: function (): string {
        throw new Error("Function not initialized.");
    },
    logout: function (): void {
        throw new Error("Function not initialized.");
    },
    userProfile: {}
}