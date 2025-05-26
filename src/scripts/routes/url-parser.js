function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat('/:id');
  }

  return pathname || '/';
}

export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  const segments = pathname.split('/').filter(Boolean); // hapus string kosong

  return {
    route: segments[0] || '',
    id: segments[1] || '',
  };
}

export function getActiveRoute() {
  const pathname = getActivePathname();

  if (/^\/detail\/.+$/.test(pathname)) {
    return '/detail/:id';
  }

  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}
