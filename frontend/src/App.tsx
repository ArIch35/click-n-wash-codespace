import './App.css';
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import AppRoutes from './AppRoutes';
import NotificationProvider from './providers/Notification.provider';
import store from './redux.store';

function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </NotificationProvider>
      </MantineProvider>
    </Provider>
  );
}

export default App;
