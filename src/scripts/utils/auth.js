const TOKEN_KEY = 'token';

export function getAccessToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === 'null' || token === 'undefined') {
      return null;
    }
    return token;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

export function putAccessToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

export function removeAccessToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('removeAccessToken: error:', error);
    return false;
  }
}

import { getActiveRoute } from '../routes/url-parser';

const unauthenticatedRoutesOnly = ['/', '/register'];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = '/home';
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = '/';
    return null;
  }

  return page;
}

export function getLogout() {
  removeAccessToken();
}
