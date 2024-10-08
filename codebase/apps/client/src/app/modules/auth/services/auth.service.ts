import Keycloak from "keycloak-js"
import { keycloakConfig, keyCloakInitOptions } from "../types/constants";
import { AuthProviderState, SCustomEvent, SHasEventsInterface } from "../types/interfaces";
import { Subject } from "rxjs";
import { AuthEvents } from "../types/enums/auth-event.enums";

class AuthServiceClass implements SHasEventsInterface<AuthEvents, AuthProviderState>{
    private static instance: AuthServiceClass;
    private keyClock!: Keycloak;

    constructor() {
        this.init();
        this.events = new Subject();
    }
    events: Subject<SCustomEvent<AuthEvents, AuthProviderState>>;

    onEvents() {
        return this.events.asObservable();
    };

    private dispatchTokenExpired() {
        this.events.next({type: AuthEvents.TOKEN_EXPIRED});
    }

    private dispatchOnAdapterReady(authenticated: boolean) {
        this.events.next({type: AuthEvents.ADAPTER_INITIALIZED, payload: {
            isAuthenticated: authenticated,
            getToken: this.getToken.bind(this),
            logout: this.logout.bind(this)
        }});
    }

    private handleEvents() {
        this.keyClock.onTokenExpired = this.dispatchTokenExpired.bind(this);
        this.keyClock.onReady = this.dispatchOnAdapterReady.bind(this);
    }

    public static getInstance() {
        if (!AuthServiceClass.instance) {
            AuthServiceClass.instance = new AuthServiceClass();
        }
        return AuthServiceClass.instance;
    }

    private init(): void {
        this.keyClock = new Keycloak(keycloakConfig);
        this.handleEvents();
        this.keyClock.init(keyCloakInitOptions);
    }

    getToken() {
        return `Bearer ${this.keyClock?.token}`;
    }

    isLoggedIn() {
        return this.keyClock?.authenticated;
    }

    logout() {
        this.keyClock?.logout();
    }
}

export const AuthService = AuthServiceClass.getInstance();