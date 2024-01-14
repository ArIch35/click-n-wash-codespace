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
import ManageLaundromatsPage from './pages/ManageLaundromatsPage';
import MissingPage from './pages/MissingPage';
import SettingsPage from './pages/SettingsPage';
import AddLaundromatPage from './pages/AddLaundromatPage';
import LaundromatDetailsPage from './pages/LaundromatDetailsPage';

type Route = RouteProps & {
  label: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  onNavbar?: boolean;
  requireAuth?: boolean;
  requireVendor?: boolean;
};

export const routes: Route[] = [
  {
    path: '/',
    element: <HomePage />,
    label: 'Home',
    icon: IconHome,
    onNavbar: true,
    index: true,
  },
  {
    path: '/bookings',
    element: <BookingsPage />,
    label: 'Manage bookings',
    icon: IconBook2,
    onNavbar: true,
    requireAuth: true,
  },
  {
    path: '/balance',
    element: <BalancePage />,
    label: 'Balance',
    icon: IconTransactionEuro,
    onNavbar: true,
    requireAuth: true,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    label: 'Settings',
    icon: IconSettings,
    onNavbar: true,
    requireAuth: true,
  },
  {
    path: '/manage-laundromats',
    element: <ManageLaundromatsPage />,
    label: 'Manage laundromats',
    icon: IconBuildingStore,
    onNavbar: true,
    requireAuth: true,
    requireVendor: true,
  },
  {
    path: '/add-laundromat',
    element: <AddLaundromatPage />,
    label: 'Add laundromat',
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
  {
    path: '/edit-laundromat/:id',
    element: <LaundromatDetailsPage />,
    label: 'Laundromat Details',
    icon: IconBuildingStore,
    requireAuth: true,
    requireVendor: true,
  },
];
