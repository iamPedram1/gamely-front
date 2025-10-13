// Custom Utility
import { apiBaseURL } from './appVariables';

/**
 * Prefixes the file URL with the base URL if necessary.
 * @param {string} URL - The file URL.
 * @returns {string} The prefixed file URL.
 */
export const prefixFileURL = (URL: string): string => {
  if (!URL) return '';
  if (URL.startsWith('blob:')) return URL;
  if (URL.startsWith('https://')) return URL;
  if (URL.startsWith('/images/errors')) return URL;

  const baseURL = apiBaseURL;

  return URL ? `${baseURL}/${URL}` : '';
};

/**
 * This function will detect if url is external
 * @param url the url to check
 * @returns Returns a boolean.
 **/
export const isExternalUrl = (url: string) => {
  if (
    url.startsWith('https') ||
    url.startsWith('http') ||
    url.startsWith('www')
  )
    return true;
  return false;
};

/**
 * Checks if string starts with / or not. If not / will be added to the start of the string.
 *
 * @param {string} str - Link to prefix with slash.
 * @returns {string} The prefixed link.
 */
export const prefixWithSlash = (str: string): string => {
  return str.startsWith('/') ? str : `/${str}`;
};

/**
 * Checks href and fix it if it doesn't start with /.
 *
 * @param {string} str - The title to convert.
 * @returns {string} The converted url.
 */
export const prefixHrefWithSlash = (str: string): string =>
  str.startsWith('/') ? str : `/${str}`;
