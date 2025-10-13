'use client';
import useDialogStore, { SubmitHandler } from './slice';

/**
 * Synchronous getter for whether the dialog is shown.
 * @returns {boolean} True if dialog is visible.
 * @see useShowDialog
 */
export const getShowDialog = (): boolean =>
  useDialogStore.getState().showDialog;

/**
 * Synchronous getter for the dialog title.
 * @returns {React.ReactNode} The current title.
 * @see useTitle
 */
export const getDialogTitle = (): React.ReactNode =>
  useDialogStore.getState().title;

/**
 * Synchronous getter for the submit button title.
 * @returns {string} The current submit title.
 * @see useSubmitTitle
 */
export const getDialogSubmitTitle = (): string =>
  useDialogStore.getState().submitTitle;

/**
 * Synchronous getter for the submit button color.
 * @returns {any} The current submit color.
 * @see useSubmitColor
 */
export const getDialogSubmitColor = (): any =>
  useDialogStore.getState().submitColor;

/**
 * Synchronous getter for the cancel button title.
 * @returns {string} The current cancel title.
 * @see useCancelTitle
 */
export const getDialogCancelTitle = (): string =>
  useDialogStore.getState().cancelTitle;

/**
 * Synchronous getter for the cancel button color.
 * @returns {any} The current cancel color.
 * @see useCancelColor
 */
export const getDialogCancelColor = (): any =>
  useDialogStore.getState().cancelColor;

/**
 * Synchronous getter for the submit handler.
 * @returns {SubmitHandler | undefined} The current handler.
 * @see useSubmitHandler
 */
export const getDialogSubmitHandler = (): SubmitHandler | undefined =>
  useDialogStore.getState().submitHandler;
