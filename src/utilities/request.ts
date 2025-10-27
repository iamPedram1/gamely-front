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
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      // Append each value for the same key
      value.forEach((v) => params.append(key, String(v)));
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
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

/**
 * Convert a query string into an object.
 * Duplicate keys are stored as arrays.
 */
export function parseQueryStringToObject(
  queryString: string
): Record<string, any> {
  const result: Record<string, any> = {};
  const params = new URLSearchParams(queryString);

  for (const [key, value] of params) {
    if (key in result) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}
