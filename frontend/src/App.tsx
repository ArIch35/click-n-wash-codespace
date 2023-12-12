import './App.css';
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function App() {

  return (
    <MantineProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
