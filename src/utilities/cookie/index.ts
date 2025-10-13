export interface CookieOptions {
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  expires?: Date;
  maxAge?: number;
}

/**
 * Set a cookie
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.path) {
    cookie += `; path=${options.path}`;
  }

  if (options.expires) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.maxAge) {
    cookie += `; max-age=${options.maxAge}`;
  }

  if (options.secure) {
    cookie += '; Secure';
  }

  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  document.cookie = cookie;
}

/**
 * Delete a cookie
 */
export function deleteCookie(
  name: string,
  options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}
): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0), // Thu, 01 Jan 1970
  });
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ').map((c) => c.split('='));
  for (const [key, val] of cookies) {
    if (decodeURIComponent(key) === name) {
      return decodeURIComponent(val);
    }
  }
  return null;
}
