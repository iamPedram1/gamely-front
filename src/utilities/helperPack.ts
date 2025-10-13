import { appDomain } from './appVariables';

/**
 * Converts number to fa-IR locale string.
 *
 * @param {number} num - The number to convert.
 * @returns {string} The locale string.
 */
export const toLocaleNumString = (num: number): string =>
  num.toLocaleString('fa-IR');

export const generateRandomNumber = (minRange = 1, maxRange = 10000) => {
  const min = Math.ceil(minRange);
  const max = Math.floor(maxRange);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Converts number into an string to the persian one.
 *
 * @param {number | number} str - The number to convert.
 * @returns {string} The persian number if the input is not a valid number.
 */
export const convertNumberToPersian = (str: string | number): string => {
  if (
    (typeof str !== 'string' && typeof str !== 'number') ||
    str === undefined ||
    str === null
  )
    return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  try {
    // @ts-ignore
    return str.toString().replace(/\d/g, (x) => farsiDigits[x]);
  } catch (error) {
    return str as any;
  }
};

/**
 * Converts persian number into an string to the latin one.
 *
 * @param {number | number} str - The number to convert.
 * @returns {string | undefined} The latin number .
 */
export const convertPersianDigitsToLatin = (str: string | number): string => {
  const s = typeof str === 'number' ? str.toString() : str;

  try {
    // @ts-ignore
    return s.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
  } catch (error) {
    return s;
  }
};

/**
 * Returns number equivalent in persian text.
 *
 * @param {number} number - the number to convert.
 * @param {fa | ar} number - the format of the returned text.
 * @returns {string | undefined} Returns the converted number in persian language or undefined if the input is not a valid number .
 */
export const getNumberTitle = (
  number: number,
  format: 'fa' | 'fa-ordinal' = 'fa-ordinal'
): string | undefined => {
  switch (number) {
    case 0:
      return 'صفر';
    case 1:
      return format === 'fa-ordinal' ? 'اول' : 'یک';
    case 2:
      return format === 'fa-ordinal' ? 'دوم' : 'دو';
    case 3:
      return format === 'fa-ordinal' ? 'سوم' : 'سه';
    case 4:
      return format === 'fa-ordinal' ? 'چهارم' : 'چهار';
    case 5:
      return format === 'fa-ordinal' ? 'پنجم' : 'پنج';
    case 6:
      return format === 'fa-ordinal' ? 'ششم' : 'شش';
    case 7:
      return format === 'fa-ordinal' ? 'هفتم' : 'هفت';
    case 8:
      return format === 'fa-ordinal' ? 'هشتم' : 'هشت';
    case 9:
      return format === 'fa-ordinal' ? 'نهم' : 'نه';
    case 10:
      return format === 'fa-ordinal' ? 'دهم' : 'ده';
    case 11:
      return format === 'fa-ordinal' ? 'یازدهم' : 'یازده';
    case 12:
      return format === 'fa-ordinal' ? 'دوازدهم' : 'دوازده';
    case 13:
      return format === 'fa-ordinal' ? 'سیزدهم' : 'سیزده';
    case 14:
      return format === 'fa-ordinal' ? 'چهاردهم' : 'چهارده';
    case 15:
      return format === 'fa-ordinal' ? 'پانزدهم' : 'پانزده';
    case 16:
      return format === 'fa-ordinal' ? 'شانزدهم' : 'شانزده';
    case 17:
      return format === 'fa-ordinal' ? 'هفدهم' : 'هفده';
    case 18:
      return format === 'fa-ordinal' ? 'هجدهم' : 'هجده';
    case 19:
      return format === 'fa-ordinal' ? 'نوزدهم' : 'نوزده';
    case 20:
      return format === 'fa-ordinal' ? 'بیستم' : 'بیست';
    case 21:
      return format === 'fa-ordinal' ? 'بیست و یکم' : 'بیست و یک';
    case 22:
      return format === 'fa-ordinal' ? 'بیست و دوم' : 'بیست و دو';
    case 23:
      return format === 'fa-ordinal' ? 'بیست و سوم' : 'بیست و سه';
    case 24:
      return format === 'fa-ordinal' ? 'بیست و چهارم' : 'بیست و چهار';
    case 25:
      return format === 'fa-ordinal' ? 'بیست و پنجم' : 'بیست و پنج';
    default:
      return convertNumberToPersian(number.toString());
  }
};

/**
 * Deep clones an object or array using JSON.stringify and JSON.parse.
 * @template T
 * @param {T} state - The object or array to be deep cloned.
 * @returns {T} - The deep cloned object or array.
 */
export const deepClone = <T>(state: T): T => JSON.parse(JSON.stringify(state));

/**
 * Scrolls the window to the bottom of the page smoothly.
 * @returns {void}
 */
export const scrollToBottom = (): void =>
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });

/**
 * Scrolls the window to the top of the page smoothly.
 * @returns {void}
 */
export const scrollToTop = (): void =>
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

/**
 * Helper utility function to stringify JSON with support for undefined values.
 * @param data - The data to be stringified.
 * @returns The stringified JSON.
 */
export const stringifyWithUndefined = (data: any): string => {
  return JSON.stringify(data, (_, value) => {
    if (typeof value === 'undefined') return '__undefined__';

    return value;
  });
};

/**
 * Generates a query string from an object.
 * @param {Record<string, any>} obj - The object containing key-value pairs for the query string.
 * @returns {string} The generated query string.
 */
export const generateQueryString = (obj: Record<string, any>): string => {
  const params: string[] = [];

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (Array.isArray(value)) {
      const arrayValues = value.map((item) => `"${item}"`);
      params.push(`${encodeURIComponent(key)}=[${arrayValues}]`);
    } else {
      if (value)
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });

  return params.join('&');
};

/**
 * Converts searchParams to a URL query string.
 *
 * @param {URLSearchParams} searchParams - The searchParams object to convert.
 * @param {boolean} [excludePagination] - Optional. If true, excludes pagination parameters ('page' and 'limit') from the query string.
 * @returns {string} The URL query string generated from the searchParams.
 */
export const searchParamsToQuery = (
  searchParams: URLSearchParams,
  excludePagination: boolean
): string => {
  const query = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (excludePagination && ['page', 'limit'].includes(key)) return;
    query.set(key, value);
  });
  return query.toString();
};

/**
 * Checks if a URL query parameter is a valid JSON string.
 *
 * @param {string} queryParam - The URL query parameter to check.
 * @returns {boolean} True if the query parameter is a valid JSON string, false otherwise.
 */
export const isValidJSON = (queryParam: string): boolean => {
  try {
    JSON.parse(queryParam);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Removes duplicates from an array of strings.
 *
 * @param {string[]} items - The array of strings to remove duplicates from.
 * @returns {string[]} The array with duplicates removed.
 */
export const removeDuplicates = (items: string[]): string[] => {
  const uniqueStrings = new Set<string>();

  items.forEach((str) => uniqueStrings.add(str));

  return Array.from(uniqueStrings);
};

/**
 * Converts a number to Persian riyal format.
 *
 * @param value The number to be converted.
 * @param disableSuffix Whether to disable the "ریال" suffix.
 * @returns The converted number in Persian riyal format.
 */
export const convertToPersianRiyal = (
  value: number,
  disableSuffix?: boolean
): string => {
  if (typeof value === 'number') {
    const price = new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
    }).format(value);
    return disableSuffix ? price.replace('ریال', '') : price;
  }
  return '';
};

/**
 * Converts a number to Persian tooman format.
 *
 * @param value The number to be converted.
 * @param disableSuffix Whether to disable the "تومان" suffix.
 * @returns The converted number in Persian tooman format.
 */
export const convertToPersianTooman = (
  value: number,
  disableSuffix?: boolean
): string => {
  if (typeof value === 'number') {
    const price = convertNumberToPersian(
      new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value)
    );

    if (disableSuffix) return price;
    return `${price} تومان`;
  }
  return '';
};

/**
 * Scrolls the document to the given ref element.
 *
 * @param {React.MutableRefObject<HTMLElement | null>} ref The ref of the element to scroll to.
 * @param {'smooth' | 'auto'} behavior The scroll behavior.
 */
export const scrollToRef = (
  ref: React.MutableRefObject<HTMLElement | null>,
  behavior: 'smooth' | 'auto'
) => {
  if (ref.current)
    ref.current.scrollIntoView({
      behavior,
    });
};

/**
 * Scrolls the document to the given element with the specified ID.
 *
 * @param {string} id The ID of the element to scroll to.
 * @param {'smooth' | 'auto'} behavior The scroll behavior.
 */
export const scrollToId = (id: string, subtract: number = 0) => {
  let obj = document.getElementById(id);
  if (!obj) return;
  let currentTop = 0;
  if (obj.offsetParent) currentTop += obj.offsetTop;

  window.scroll(0, currentTop - subtract);
};

/**
 * Returns a string suffixed with 'px' if not already suffixed.
 * @param {string | number} input - The input string or number.
 * @returns {string} The input suffixed with 'px'.
 */
export const getSuffixedWithPx = (input: string | number): string => {
  if (typeof input === 'string' && input.includes('px')) return input;
  return `${input}px`;
};

/**
 * Truncates a string to a specified length and appends "..." if the text exceeds that length.
 *
 * @param {string} text - The text to be truncated.
 * @param {number} length - The maximum length of the text before truncation.
 * @returns {string} The truncated text with "..." appended if it exceeds the specified length.
 *
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;

  return text.substring(0, length) + '...';
};

export const extractHtmlText = (
  htmlString: string,
  limit: number = 42
): string => {
  const tempEl = document.createElement('div');
  tempEl.innerHTML = htmlString;

  const textContent = tempEl.textContent || '';

  return (
    textContent.substring(0, limit) + (textContent.length > limit ? '...' : '')
  );
};

const formatter = new Intl.NumberFormat('fa-IR', {
  style: 'decimal',
  maximumFractionDigits: 0,
});

export const toPersianTooman = (value: string | number) => {
  return formatter.format(parseInt(convertPersianDigitsToLatin(value)));
};

/**
 * Creates a debounced function that delays invoking the provided function
 * until after a specified delay in milliseconds has elapsed since
 * the last time the debounced function was invoked.
 *
 * @param {T} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {(...args: any[]) => void} A new debounced function.
 */
export const debounce = <T extends Function>(
  func: T,
  delay: number
): ((...args: any[]) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

export function isHTMLStringEmpty(htmlString: string) {
  return (
    // remove all tags...
    htmlString
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // strip scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // strip styles
      .replace(/<[^>]+>/g, '') // strip all tags
      .replace(/&nbsp;/gi, ' ') // fix non-break spaces
      .replace(/\s+/g, '').length === 0 // drop all whitespace
  );
}

export const toSafeNumber = (v: any) => {
  const n = Number(v ?? 0);

  return Number.isFinite(n) ? n : 0;
};

export const getSecureCookieFlags = (expireDate: string) => ({
  secure: true,
  httpOnly: true,
  priority: 'high',
  sameSite: 'lax',
  expires: new Date(expireDate),
  domain: appDomain,
});

/**
 * Utility function to create a non-blocking server action that can be invoked with {@link runParallelAction}.
 * Learn more at https://github.com/icflorescu/next-server-actions-parallel.
 *
 * @example
 * const listUsers = createParallelAction(async () => { // 👈 don't forget the `async` keyword
 *   return await prisma.user.findMany();
 * });
 *
 * const listProducts = createParallelAction(async () => {
 *   return await prisma.product.findMany();
 })
 */
export function createParallelAction<T, U extends unknown[]>(
  action: (...args: U) => Promise<T>
) {
  return async (...args: U) => [action(...args)] as const;
}
