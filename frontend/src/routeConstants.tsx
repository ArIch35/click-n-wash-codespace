import {
  IconBook2,
  IconBuildingStore,
  IconFileUnknown,
  IconHome,
  IconSettings,
  IconTransactionEuro,
  TablerIconsProps,
} from '@tabler/icons-react';
import { RouteProps } from 'react-router-dom';
import BalancePage from './pages/BalancePage';
import BookingsPage from './pages/BookingsPage';
import HomePage from './pages/HomePage';
import LaundromatsPage from './pages/LaundromatsPage';
import MissingPage from './pages/MissingPage';
import SettingsPage from './pages/SettingsPage';
import ManagePage from './pages/ManagePage';

type Route = RouteProps & {
  label: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  requireAuth?: boolean;
  requireVendor?: boolean;
};

export const routes: Route[] = [
  {
    path: '/',
    element: <HomePage />,
    label: 'Home',
    icon: IconHome,
    index: true,
  },
  {
    path: '/bookings',
    element: <BookingsPage />,
    label: 'Manage bookings',
    icon: IconBook2,
    requireAuth: true,
  },
  {
    path: '/managebookings',
    element: <ManagePage />,
  },
  {
    path: '/balance',
    element: <BalancePage />,
    label: 'Balance',
    icon: IconTransactionEuro,
    requireAuth: true,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    label: 'Settings',
    icon: IconSettings,
    requireAuth: true,
  },
  {
    path: '/laundromats',
    element: <LaundromatsPage />,
    label: 'Manage laundromats',
    icon: IconBuildingStore,
    requireAuth: true,
    requireVendor: true,
  },
  {
    path: '*',
    element: <MissingPage />,
    label: 'Missing',
    icon: IconFileUnknown,
  },
];
