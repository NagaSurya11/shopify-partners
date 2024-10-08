export interface AuthContextInterface {
    getToken: () => string;
    logout: () => void;
}
