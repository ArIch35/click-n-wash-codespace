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
import BalancePage from './pages/BalancePage';
import BookingsPage from './pages/BookingsPage';
import HomePage from './pages/HomePage';
import InboxPage from './pages/InboxPage';
import LaundromatAddPage from './pages/LaundromatAddPage.tsx';
import LaundromatDetailsPage from './pages/LaundromatDetailsPage/LaundromatDetailsPage.tsx';
import LaundromatSimulationPage from './pages/LaundromatSimulationPage.tsx';
import LaundromatsManagePage from './pages/LaundromatsManagePage.tsx';
import MissingPage from './pages/MissingPage';
import SettingsPage from './pages/SettingsPage';
import WashingMachineDetailsPage from './pages/WashingMachineDetailsPage/WashingMachineDetailsPage.tsx';

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
    element: <LaundromatSimulationPage />,
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
    element: <LaundromatsManagePage />,
    label: 'Manage laundromats',
    icon: IconBuildingStore,
    onNavbar: true,
    requireAuth: true,
    requireVendor: true,
  },
  {
    path: '/add-laundromat',
    element: <LaundromatAddPage />,
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
  {
    path: '/edit-washingmachine/:id',
    element: <WashingMachineDetailsPage />,
    label: 'Washing Machine Details',
    icon: IconBuildingStore,
    requireAuth: true,
    requireVendor: true,
  },
];
