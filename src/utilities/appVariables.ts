const isProduction = import.meta.env.NODE_ENV === 'production';

export const apiDomain = (import.meta.env.NEXT_PUBLIC_API_DOMAIN || '').trim();
export const apiBaseURL = `https://${apiDomain}/api`;
export const apiVersion = (
  import.meta.env.NEXT_PUBLIC_APP_API_VERSION || ''
).trim();
export const getAppBaseURL = (isAdminSide = false): string =>
  `${apiBaseURL}/v${apiVersion}${isAdminSide ? '/cms' : ''}`;

export const authTokenName = 'Authorization';
export const accessTokenCookieName = (
  import.meta.env.TOKEN_COOKIE_NAME || 'Access-Token'
).trim();
export const refreshTokenCookieName = (
  import.meta.env.REFRESH_TOKEN_COOKIE_NAME || 'Refresh-Token'
).trim();
const protocol = isProduction ? 'https' : 'http';
export const appDomain = (import.meta.env.NEXT_PUBLIC_APP_DOMAIN || '').trim();
export const userAppUrl = `${protocol}://${
  isProduction ? appDomain : `${appDomain}:3000`
}`;
export const adminAppUrl = `${protocol}://${
  isProduction ? `admin.${appDomain}` : `${appDomain}:3001`
}`;
