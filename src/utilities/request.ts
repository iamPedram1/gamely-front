/**
 * Checks if the status code indicates a successful response.
 * @param {number} status - The status code to check.
 * @returns {boolean} Returns true if the status code is between 200 and 210 (inclusive), indicating success. Otherwise, returns false.
 */
export const isSucceed = (status: number): boolean =>
  status >= 200 && status <= 210;

/**
 * Constructs a URL with an optional query string.
 *
 * @param {string} url - The base URL to which the query string will be appended.
 * @param {Record<string, any>} [query] - An optional object representing the query parameters.
 * @returns {string} The complete URL with the query string if provided.
 */
export const getUrlWithQueryString = (
  url: string,
  query: Record<string, any> = {}
): string => {
  if (Object.values(query).length === 0) return url;

  const searchParams = new URLSearchParams(query).toString();

  return `${url}${searchParams ? `?${searchParams}` : ''}`;
};

/**
 * Filters the query parameters from the request object based on a whitelist of allowed keys.
 *
 * @param {Record<string, unknown>} query - The request object containing query parameters.
 * @param {string[]} whitelistKeyNames - An array of strings representing the allowed keys in the request.
 * @returns {Record<string, unknown>} A new object containing only the whitelisted query parameters.
 */
export const filterQueryParamsByWhitelist = (
  query: Record<string, unknown>,
  whitelistKeyNames: string[]
): Record<string, unknown> => {
  return Object.entries(query).reduce((prev, [key, value]) => {
    if (whitelistKeyNames.includes(key)) return { ...prev, [key]: value };
    else return prev;
  }, {});
};
