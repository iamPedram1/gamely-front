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
 * Creates a reusable onError handler for React Hook Form.
 *
 * @param setAlert - function to show alerts (title, severity)
 */
export const createOnErrorHandler: SubmitErrorHandler<any> = (errors) => {
  console.log(errors);
  const messages = Object.values(errors)
    .map((err: any) => err?.message || '')
    .filter(Boolean);

  if (messages.length > 0) {
    console.log(messages);
    setAlertState(messages[0], 'error');
  }
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
