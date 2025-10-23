import { useStore } from 'zustand';
import useDialogStore, { SubmitHandler } from './slice';

/**
 * React hook to select whether the dialog is shown.
 * @returns {boolean} True if dialog is visible.
 */
export const useShowDialog = (): boolean =>
  useDialogStore((state) => state.showDialog);

/**
 * React hook to select the dialog title.
 * @returns {React.ReactNode} The current title.
 */
export const useDialogTitle = (): React.ReactNode =>
  useDialogStore((state) => state.title);

/**
 * React hook to select the submit button title.
 * @returns {string} The current submit title.
 */
export const useDialogSubmitTitle = (): string =>
  useDialogStore((state) => state.submitTitle);

/**
 * React hook to select the submit button color.
 * @returns {any} The current submit color.
 */
export const useDialogSubmitColor = (): any =>
  useDialogStore((state) => state.submitColor);

/**
 * React hook to select the cancel button title.
 * @returns {string} The current cancel title.
 */
export const useDialogCancelTitle = (): string =>
  useDialogStore((state) => state.cancelTitle);

/**
 * React hook to select the cancel button color.
 * @returns {any} The current cancel color.
 */
export const useDialogCancelColor = (): any =>
  useDialogStore((state) => state.cancelColor);

/**
 * React hook to select the submit handler.
 * @returns {SubmitHandler | undefined} The current handler.
 */
export const useSubmitHandler = (): SubmitHandler | undefined =>
  useDialogStore((state) => state.submitHandler);

/**
 * React hook for batched access to all dialog actions.
 * Useful for components that need multiple setters.
 * @returns Actions for opening, closing, and configuring the dialog.
 * @see useDialogStore
 */
export const useDialogActions = () =>
  useStore(useDialogStore, (state) => ({
    onOpenDialog: state.onOpenDialog,
    onCloseDialog: state.onCloseDialog,
    onSetTitle: state.onSetTitle,
    onSetSubmitTitle: state.onSetSubmitTitle,
    onSetSubmitColor: state.onSetSubmitColor,
    onSetCancelTitle: state.onSetCancelTitle,
    onSetCancelColor: state.onSetCancelColor,
    onSetSubmitHandler: state.onSetSubmitHandler,
  }));
