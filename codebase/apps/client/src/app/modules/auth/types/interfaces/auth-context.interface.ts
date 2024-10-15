import { KeycloakProfile } from "keycloak-js";

export interface AuthContextInterface {
    getToken: () => string;
    logout: () => void;
    userProfile: KeycloakProfile;
}
