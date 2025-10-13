import { convertNumberToPersian } from '@/utilities/helperPack';

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
