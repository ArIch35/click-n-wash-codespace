interface RoutePair {
  path: string;
  method: string;
}

export const users: Record<string, string> = {};

export const routesWithoutAuth: RoutePair[] = [
  { path: '/laundromats', method: 'GET' },
  {
    path: '/washingmachine',
    method: 'GET',
  },
  { path: '/generateToken', method: 'GET' },
  // Add more routes that should be accessible without auth here
];
