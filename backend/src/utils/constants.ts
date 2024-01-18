interface RoutePair {
  path: string;
  method: string;
}

export const users: Record<string, string> = {};

export const routesWithoutAuth: RoutePair[] = [
  { path: '/api/laundromats', method: 'GET' },
  { path: '/api/generateToken', method: 'GET' },
  // Add more routes that should be accessible without auth here
];

export const timeBuffer = 15 * 60000; // 15 minutes
