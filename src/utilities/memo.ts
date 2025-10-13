import isEqual from 'fast-deep-equal';

/**
 * Checks if two values are the same by comparing their stringified versions.
 *
 * @param {*} a - The first value to compare.
 * @param {*} b - The second value to compare.
 * @returns {boolean} Returns true if the values are the same, false otherwise.
 */
export const isSame = (a: any, b: any): boolean => isEqual(a, b);
