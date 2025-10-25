import equal from 'fast-deep-equal';
import { setAlertState } from '@/store/alert';
import { convertNumberToPersian } from '@/utilities/helperPack';
import type { SubmitErrorHandler } from 'react-hook-form';

type ControllerFieldState = {
  invalid: boolean;
  isTouched: boolean;
  isDirty: boolean;
  error: any;
};

/**
 * This function will set react-hook-form field property as dirty
 * @returns Returns a object to set field as dirty.
 **/
export const setAsDirty = () => ({
  shouldDirty: true,
  shouldTouch: true,
  shouldValidate: true,
});

/**
 * Returns an object containing the error status and helper text for a given field state.
 *
 * @param {ControllerFieldState} fieldState The field state to get the error and helper text for.
 * @param {boolean} conditionToThrowError The optional condition to throw error.
 * @returns {{error: boolean, helperText: string}} An object containing the error status and helper text.
 */
export const getErrorAndHelperText = (
  fieldState: any,
  conditionToThrowError = true
) => ({
  error: conditionToThrowError ? (fieldState.error ? true : false) : false,
  helperText: conditionToThrowError
    ? convertNumberToPersian(fieldState.error?.message || '')
    : '',
});

/**
 * Recursively extracts all error messages from nested React Hook Form errors.
 */
function extractMessages(errors: Record<string, any>): string[] {
  const messages: string[] = [];

  for (const key in errors) {
    const err = errors[key];
    if (!err) continue;

    if (err.message) messages.push(err.message);
    if (typeof err === 'object') {
      messages.push(...extractMessages(err));
    }
  }

  return messages;
}

/**
 * Creates a reusable onError handler for React Hook Form.
 *
 * @param setAlertState - function to show alerts (title, severity)
 */
export const createOnErrorHandler: SubmitErrorHandler<any> = (errors) => {
  const messages = extractMessages(errors).filter(Boolean);

  if (messages.length > 0) setAlertState(messages[0], 'error');
};

/**
 * Returns a new object containing only the keys that have changed
 * between the old object and the new one.
 */
export function getChangedFields<T extends Record<string, any>>(
  oldObj: T,
  newObj: T
): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in newObj) {
    if (!equal(oldObj[key], newObj[key])) {
      changed[key] = newObj[key];
    }
  }

  return changed;
}
