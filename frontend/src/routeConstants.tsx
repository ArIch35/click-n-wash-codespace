import { RouteProps } from 'react-router-dom';
import BalancePage from './pages/BalancePage';
import BookingsPage from './pages/BookingsPage';
import HomePage from './pages/HomePage';
import LaundromatsPage from './pages/LaundromatsPage';
import MissingPage from './pages/MissingPage';
import SettingsPage from './pages/SettingsPage';
import ManagePage from './pages/ManagePage';

type Route = RouteProps & {
  requireAuth?: boolean;
};

export const routes: Route[] = [
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
    path: '/managebookings',
    element: <ManagePage />,
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
    path: '/laundromats',
    element: <LaundromatsPage />,
    requireAuth: true,
  },
  {
    path: '*',
    element: <MissingPage />,
  },
];
