import { Component } from 'react';
import { initialAuthProviderState } from './types/constants';
import { AuthService } from './services';
import { AuthContextInterface, AuthProviderProps, SCustomEvent } from './types/interfaces';
import { AuthProviderState } from './types/interfaces/auth-provider-state.interface';
import { AuthContextProvider } from './contexts';
import { share, Subject, takeUntil } from 'rxjs';
import { AuthEvents } from './types/enums/auth-event.enums';

export class AuthProvider extends Component<AuthProviderProps, AuthProviderState> {
  private $destroy: Subject<void>;
  private authService;
  constructor(props: any) {
    super(props);
    this.$destroy = new Subject();
    this.state = initialAuthProviderState;
    this.authService = AuthService;
  }

  private handleAuthEvents(event: SCustomEvent<AuthEvents>) {
    switch (event.type) {
      case AuthEvents.ADAPTER_INITIALIZED:
        console.log(event.payload.getToken());
        this.setState(event.payload);
        break;
      case AuthEvents.TOKEN_EXPIRED:
        this.setState(initialAuthProviderState);
        this.authService.logout();
        break;
      default:
        break;
    }
  }

  override componentDidMount(): void {
    const self = this;
    self.authService.onEvents()
      .pipe(takeUntil(this.$destroy), share())
      .subscribe({
        next(value) {
          self.handleAuthEvents(value);
        },
        error(err) {
          console.error(err);
        },
      })
  }

  override componentWillUnmount(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  override render() {
    if (this.state.isAuthenticated) {
      return (
        <AuthContextProvider value={this.state as AuthContextInterface}>
          {this.props.children}
        </AuthContextProvider>
      )
    } else {
      return <div>Loading...</div>;
    }
  }
}
