const mapping: Record<string, string> = {
  follows: 'follow',
  investments: 'investment',
  investors: 'investor',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
