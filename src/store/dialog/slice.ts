import { create } from 'zustand';

/**
 * Type for the submit handler function.
 */
export type SubmitHandler = () => Promise<void> | void;

/**
 * Interface for the dialog store state and actions.
 * @interface DialogSlice
 * @property {boolean} showDialog - Whether the dialog is visible.
 * @property {React.ReactNode} title - The title of the dialog.
 * @property {string} submitTitle - The text for the submit button.
 * @property {any} submitColor - The color variant for the submit button.
 * @property {string} cancelTitle - The text for the cancel button.
 * @property {any} cancelColor - The color variant for the cancel button.
 * @property {SubmitHandler | undefined} submitHandler - Optional handler for submit action.
 * @property {onOpenDialog} onOpenDialog - Opens the dialog.
 * @property {onCloseDialog} onCloseDialog - Closes the dialog.
 * @property {onSetTitle} onSetTitle - Sets the dialog title.
 * @property {onSetSubmitTitle} onSetSubmitTitle - Sets the submit button title.
 * @property {onSetSubmitColor} onSetSubmitColor - Sets the submit button color.
 * @property {onSetCancelTitle} onSetCancelTitle - Sets the cancel button title.
 * @property {onSetCancelColor} onSetCancelColor - Sets the cancel button color.
 * @property {onSetSubmitHandler} onSetSubmitHandler - Sets the submit handler.
 */
export interface DialogSlice {
  showDialog: boolean;
  title: React.ReactNode;
  submitTitle: string;
  submitColor: any;
  cancelTitle: string;
  cancelColor: any;
  submitHandler: SubmitHandler | undefined;
  onOpenDialog: () => void;
  onCloseDialog: () => void;
  onSetTitle: (title: React.ReactNode) => void;
  onSetSubmitTitle: (submitTitle: string) => void;
  onSetSubmitColor: (submitColor: any) => void;
  onSetCancelTitle: (cancelTitle: string) => void;
  onSetCancelColor: (cancelColor: any) => void;
  onSetSubmitHandler: (submitHandler: SubmitHandler | undefined) => void;
}

/**
 * Creates and returns the Zustand store for managing dialog state.
 * This store simplifies handling MUI dialogs, including visibility, titles, colors, and submit handler.
 *
 * @example
 * import { useDialogStore } from './path/to/dialog';
 * const { showDialog, onOpenDialog } = useDialogStore();
 *
 * @returns The Zustand store instance.
 */
export const useDialogStore = create<DialogSlice>((set) => ({
  showDialog: false,
  title: '',
  submitTitle: '',
  submitColor: 'primary',
  cancelTitle: '',
  cancelColor: 'primary',
  submitHandler: undefined,
  /**
   * Opens the dialog by setting showDialog to true.
   */
  onOpenDialog: () => set({ showDialog: true }),
  /**
   * Closes the dialog by setting showDialog to false.
   */
  onCloseDialog: () => set({ showDialog: false }),
  /**
   * Sets the title of the dialog.
   * @param {React.ReactNode} title - The new title (can be string or JSX).
   */
  onSetTitle: (title: React.ReactNode) => set({ title }),
  /**
   * Sets the submit button title.
   * @param {string} submitTitle - The new submit button text.
   */
  onSetSubmitTitle: (submitTitle: string) => set({ submitTitle }),
  /**
   * Sets the submit button color variant.
   * @param {any} submitColor - The new color (e.g., 'primary', 'secondary').
   */
  onSetSubmitColor: (submitColor: any) => set({ submitColor }),
  /**
   * Sets the cancel button title.
   * @param {string} cancelTitle - The new cancel button text.
   */
  onSetCancelTitle: (cancelTitle: string) => set({ cancelTitle }),
  /**
   * Sets the cancel button color variant.
   * @param {any} cancelColor - The new color (e.g., 'primary', 'secondary').
   */
  onSetCancelColor: (cancelColor: any) => set({ cancelColor }),
  /**
   * Sets the submit handler function.
   * @param {SubmitHandler | undefined} submitHandler - The async function to call on submit, or undefined to clear.
   */
  onSetSubmitHandler: (submitHandler: SubmitHandler | undefined) =>
    set({ submitHandler }),
}));

export default useDialogStore;
