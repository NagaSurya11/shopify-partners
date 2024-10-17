import { auth0ProviderOptions } from "../types/constants";
import { AuthProviderState, SCustomEvent, SHasEventsInterface } from "../types/interfaces";
import { Subject } from "rxjs";
import { AuthEvents } from "../types/enums/auth-event.enums";
import { Auth0Client } from '@auth0/auth0-spa-js';

class AuthServiceClass implements SHasEventsInterface<AuthEvents, AuthProviderState>{
    private static instance: AuthServiceClass;
    private authClient!: Auth0Client;
    events: Subject<SCustomEvent<AuthEvents, AuthProviderState>>;
    constructor() {
        this.events = new Subject();
        this.init();
    }

    onEvents() {
        return this.events.asObservable();
    };

    private async dispatchOnAdapterReady(authenticated: boolean) {
        const user = await this.authClient.getUser();
        const token = await this.authClient.getTokenSilently();
        this.events.next({type: AuthEvents.ADAPTER_INITIALIZED, payload: {
            isAuthenticated: authenticated,
            getToken: () => `Bearer ${token}`,
            logout: this.logout.bind(this),
            userProfile: {
                email: user?.email ?? '',
                name: user?.name ?? '',
                profilePicture: user?.picture ?? ''
            }
        }});
    }

    public static getInstance() {
        if (!AuthServiceClass.instance) {
            AuthServiceClass.instance = new AuthServiceClass();
        }
        return AuthServiceClass.instance;
    }

    private init() {
        this.authClient = new Auth0Client(auth0ProviderOptions);
    }

    async authenticate() {
        if (await this.authClient.isAuthenticated()) {
            await this.dispatchOnAdapterReady(true);
        } else {
            await this.authClient.loginWithRedirect();
        }
    }

    logout() {
        this.authClient.logout({logoutParams: {returnTo: window.location.origin}});
    }
}

export const AuthService = AuthServiceClass.getInstance();