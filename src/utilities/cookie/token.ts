import { NextResponse } from 'next/server';

// Custom Utilites
import {
  appDomain,
  refreshTokenCookieName,
  tokenCookieName,
} from '@shopify/utilities/appVariables';

// Types
import type {
  ReadonlyRequestCookies,
  ResponseCookies,
} from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const setAuthTokens = (
  cookies: ReadonlyRequestCookies | ResponseCookies,
  token: string,
  refreshToken: string,
  refreshTokenExpireDate: string,
  nextResponse?: NextResponse
) => {
  try {
    const options = {
      secure: true,
      httpOnly: true,
      priority: 'high',
      sameSite: 'lax',
      expires: new Date(refreshTokenExpireDate),
      domain: appDomain,
    } as const;

    cookies.set(tokenCookieName, token, options);
    cookies.set(refreshTokenCookieName, refreshToken, options);
    if (nextResponse) {
      nextResponse.cookies.set(tokenCookieName, token, options);
      nextResponse.cookies.set(refreshTokenCookieName, refreshToken, options);
    }
  } catch (error) {}
};

export const clearAuthTokens = (
  cookies: ReadonlyRequestCookies | ResponseCookies,
  nextResponse?: NextResponse
) => {
  try {
    const options = {
      secure: true,
      httpOnly: true,
      priority: 'high',
      sameSite: 'lax',
      maxAge: 0,
      domain: appDomain,
    } as const;

    cookies.set(tokenCookieName, '', options);
    cookies.set(refreshTokenCookieName, '', options);
    if (nextResponse) {
      nextResponse.cookies.set(tokenCookieName, '', options);
      nextResponse.cookies.set(refreshTokenCookieName, '', options);
    }
  } catch (error) {}
};
