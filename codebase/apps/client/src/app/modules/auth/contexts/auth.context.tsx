import { createContext } from "react";
import { AuthContextInterface } from "../types/interfaces";
import { initialAuthProviderState } from "../types/constants";

const AuthContext = createContext<AuthContextInterface>(initialAuthProviderState);

export const AuthContextConsumer = AuthContext.Consumer;
export const AuthContextProvider = AuthContext.Provider;
