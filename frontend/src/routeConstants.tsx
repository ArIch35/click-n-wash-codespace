import { RouteProps } from 'react-router-dom';
import HomePage from './pages/HomePage';

export const routes: RouteProps[] = [
  {
    path: '/',
    element: <HomePage />,
    index: true,
  },
];
