// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { AuthProvider } from './modules/auth';

import NxWelcome from './nx-welcome';

export function App() {
  return (
    <AuthProvider>
      <NxWelcome title="client" />
    </AuthProvider>
  );
}

export default App;
