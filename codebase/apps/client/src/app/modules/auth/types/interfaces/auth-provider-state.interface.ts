import { AuthContextInterface } from "./auth-context.interface";

export interface AuthProviderState extends AuthContextInterface {
    isAuthenticated: boolean;
}