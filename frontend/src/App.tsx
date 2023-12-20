import '@mantine/core/styles.css';
import './App.css';

import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import NotificationProvider from './providers/Notification.provider';
import AuthenticationProvider from './providers/authentication.provider';
import store from './redux.store';

function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <AuthenticationProvider>
          <NotificationProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </NotificationProvider>
        </AuthenticationProvider>
      </MantineProvider>
    </Provider>
  );
}

export default App;
