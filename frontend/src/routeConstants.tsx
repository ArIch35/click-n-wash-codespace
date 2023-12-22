import { RouteProps } from 'react-router-dom';
import BalancePage from './pages/BalancePage';
import BookingsPage from './pages/BookingsPage';
import HomePage from './pages/HomePage';
import MissingPage from './pages/MissingPage';
import SettingsPage from './pages/SettingsPage';

export const routes: RouteProps[] = [
  {
    path: '/',
    element: <HomePage />,
    index: true,
  },
  {
    path: '/bookings',
    element: <BookingsPage />,
  },
  {
    path: '/balance',
    element: <BalancePage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '*',
    element: <MissingPage />,
  },
];
