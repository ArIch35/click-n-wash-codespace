import {
  IconBook2,
  IconBuildingStore,
  IconFileUnknown,
  IconHome,
  IconInbox,
  IconSettings,
  IconTransactionEuro,
  TablerIconsProps,
} from '@tabler/icons-react';
import { RouteProps } from 'react-router-dom';
import AddLaundromatPage from './pages/AddLaundromatPage';
import BalancePage from './pages/BalancePage';
import BookingsPage from './pages/BookingsPage';
import HomePage from './pages/HomePage';
import InboxPage from './pages/InboxPage';
import LaundromatDetailsPage from './pages/LaundromatDetailsPage';
import ManageLaundromatsPage from './pages/ManageLaundromatsPage';
import MissingPage from './pages/MissingPage';
import SettingsPage from './pages/SettingsPage';
import SimulationPage from './pages/SimulationPage';

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
    path: '/inbox',
    element: <InboxPage />,
    label: 'Inbox',
    icon: IconInbox,
    onNavbar: true,
    requireAuth: true,
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
    path: '/simulate/:contractId',
    element: <SimulationPage />,
    label: 'Simulate bookings',
    icon: IconBook2,
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
