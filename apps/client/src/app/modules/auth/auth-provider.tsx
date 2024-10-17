import { Component } from 'react';
import { auth0ProviderOptions, initialAuthProviderState } from './types/constants';
import { AuthProviderProps, SCustomEvent } from './types/interfaces';
import { AuthProviderState } from './types/interfaces/auth-provider-state.interface';
import { AuthContextProvider } from './contexts';
import { Auth0Context, Auth0Provider } from '@auth0/auth0-react';

export class AuthProvider extends Component<AuthProviderProps, AuthProviderState> {
    constructor(props: AuthProviderProps) {
        super(props);
        this.state = initialAuthProviderState;
    }

    override render() {
        return (
            <Auth0Provider {...auth0ProviderOptions}>
                <Auth0Context.Consumer>
                    {(value) => {
                        if (value.isLoading) {
                            return <>Loading...</>
                        }
                        if (!value.isAuthenticated) {
                            value.loginWithRedirect();
                        } else if (!this.state.isAuthenticated) {
                            value.getAccessTokenSilently().then(async (token) => {
                                console.log(`Bearer ${token}`);
                                this.setState({
                                    isAuthenticated: true,
                                    getToken: () => `Bearer ${token}`,
                                    logout: () => value.logout({ logoutParams: { returnTo: window.location.origin } }),
                                    userProfile: {
                                        email: value.user?.email ?? '',
                                        name: value.user?.name ?? '',
                                        profilePicture: value.user?.picture ?? ''
                                    }
                                })
                            });
                        }
                        return (
                            (this.state.isAuthenticated ?
                                <AuthContextProvider value={this.state} children={this.props.children} />
                                : <>Loading...</>)
                        )
                    }}
                </Auth0Context.Consumer>
            </Auth0Provider>
        )
    }
}
