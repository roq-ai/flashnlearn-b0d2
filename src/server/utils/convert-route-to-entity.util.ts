const mapping: Record<string, string> = {
  documents: 'document',
  'flash-cards': 'flash_card',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
