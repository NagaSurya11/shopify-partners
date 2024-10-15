// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './modules/auth';
import { GrapphqlClientProvider } from './modules/graphql-client';
import i18n from './modules/i18n/i18n';
import { RouterProvider } from 'react-router-dom';
import { router } from './modules/routing';
import Notification from './modules/notification/notification';
import { configureStore } from '@reduxjs/toolkit';
import { NOTIFICATION_FEATURE_KEY, notificationReducer } from './modules/slices/notification.slice';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: { [NOTIFICATION_FEATURE_KEY]: notificationReducer },
  // Additional middleware can be passed to this array
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
  // Optional Redux store enhancers
  enhancers: [],
});

export function App() {
  return (
    <AuthProvider>
      <GrapphqlClientProvider>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <RouterProvider router={router} />
            <Notification />
          </Provider>
        </I18nextProvider>
      </GrapphqlClientProvider>
    </AuthProvider>
  );
}

export default App;
