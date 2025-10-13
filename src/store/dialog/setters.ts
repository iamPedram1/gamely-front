'use client';
import { SeverityType } from '@/store/alert';
import useDialogStore, { DialogSlice, SubmitHandler } from './slice';

export type OpenDialogConfigType = Partial<
  Pick<
    DialogSlice,
    'title' | 'submitTitle' | 'submitColor' | 'cancelTitle' | 'cancelColor'
  > & { onSubmit?: SubmitHandler }
>;

/**
 * Imperatively opens the dialog (non-React wrapper).
 * Optionally accepts a config object to set properties before opening.
 * @param {object} [config] - Partial config to update dialog properties.
 * @param {ReactNode} [config.title] - The dialog title.
 * @param {string} [config.submitTitle] - The submit button title.
 * @param {ColorType} [config.submitColor] - The submit button color.
 * @param {string} [config.cancelTitle] - The cancel button title.
 * @param {ColorType} [config.cancelColor] - The cancel button color.
 * @param {SubmitHandler} [config.onSubmit] - The submit handler.
 * @see onOpenDialog
 * @example
 * onOpenDialog({
 *   title: 'آیا از حذف این گروه ویژگی مطمئن هستید؟',
 *   submitTitle: 'حذف',
 *   submitColor: 'error',
 *   onSubmit: () => deleteFeature({ featureId, categorySlug: category.data.slug }),
 * });
 */
export const onOpenDialog = (config?: OpenDialogConfigType) => {
  const state = useDialogStore.getState();
  if (config) {
    if (config.title !== undefined) state.onSetTitle(config.title);
    if (config.submitTitle !== undefined)
      state.onSetSubmitTitle(config.submitTitle);
    if (config.submitColor !== undefined)
      state.onSetSubmitColor(config.submitColor);
    if (config.cancelTitle !== undefined)
      state.onSetCancelTitle(config.cancelTitle);
    if (config.cancelColor !== undefined)
      state.onSetCancelColor(config.cancelColor);
    if (config.onSubmit !== undefined)
      state.onSetSubmitHandler(config.onSubmit);
  }
  state.onOpenDialog();
};

/**
 * Imperatively closes the dialog (non-React wrapper).
 * @see onCloseDialog
 */
export const onCloseDialog = () => {
  useDialogStore.getState().onCloseDialog();
};

/**
 * Imperatively sets the dialog title (non-React wrapper).
 * @param {React.ReactNode} title - The new title.
 * @see onSetDialogTitle
 */
export const onSetDialogTitle = (title: React.ReactNode) => {
  useDialogStore.getState().onSetTitle(title);
};

/**
 * Imperatively sets the submit button title (non-React wrapper).
 * @param {string} submitTitle - The new submit title.
 * @see onSetDialogSubmitTitle
 */
export const onSetDialogSubmitTitle = (submitTitle: string) => {
  useDialogStore.getState().onSetSubmitTitle(submitTitle);
};

/**
 * Imperatively sets the submit button color (non-React wrapper).
 * @param {ColorType} submitColor - The new color.
 * @see onSetDialogSubmitColor
 */
export const onSetDialogSubmitColor = (submitColor: SeverityType) => {
  useDialogStore.getState().onSetSubmitColor(submitColor);
};

/**
 * Imperatively sets the cancel button title (non-React wrapper).
 * @param {string} cancelTitle - The new cancel title.
 * @see onSetDialogCancelTitle
 */
export const onSetDialogCancelTitle = (cancelTitle: string) => {
  useDialogStore.getState().onSetCancelTitle(cancelTitle);
};

/**
 * Imperatively sets the cancel button color (non-React wrapper).
 * @param {ColorType} cancelColor - The new color.
 * @see onSetDialogCancelColor
 */
export const onSetDialogCancelColor = (cancelColor: SeverityType) => {
  useDialogStore.getState().onSetCancelColor(cancelColor);
};

/**
 * Imperatively sets the submit handler (non-React wrapper).
 * @param {SubmitHandler | undefined} submitHandler - The handler or undefined.
 * @see onSetDialogSubmitHandler
 */
export const onSetDialogSubmitHandler = (
  submitHandler: SubmitHandler | undefined
) => {
  useDialogStore.getState().onSetSubmitHandler(submitHandler);
};
