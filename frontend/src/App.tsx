import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import BaseLayout from './layout/BaseLayout';
import NotificationProvider from './providers/Notification.provider';
import AuthenticationProvider from './providers/authentication/Authentication.Provider';

function App() {
  return (
    <MantineProvider>
      <AuthenticationProvider>
        <NotificationProvider>
          <BrowserRouter>
            <BaseLayout>
              <AppRoutes />
            </BaseLayout>
          </BrowserRouter>
        </NotificationProvider>
      </AuthenticationProvider>
    </MantineProvider>
  );
}

export default App;
