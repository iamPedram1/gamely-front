import { setAlertState } from '@/store/alert';

export type AlertCrudType =
  | 'delete'
  | 'cancel'
  | 'update'
  | 'create'
  | 'add'
  | 'edit'
  | 'upload'
  | 'read';

/**
 * Displays a success message for a CRUD operation.
 *
 * @param type The type of CRUD operation.
 * @param featureName The name of the feature being operated on.
 * @param backendMessage Optional message returned from the backend.
 * @returns Nothing.
 */
export const setSuccessCrudAlert = (
  type: AlertCrudType,
  featureName: string,
  backendMessage?: string
) => {
  let message = '';
  if (backendMessage) return setAlertState(backendMessage, 'success', 2000);

  switch (type) {
    case 'create':
      message = `${featureName} was created successfully.`;
      break;
    case 'add':
      message = `${featureName} was added successfully.`;
      break;
    case 'update':
      message = `${featureName} was updated successfully.`;
      break;
    case 'cancel':
      message = `${featureName} was canceled successfully.`;
      break;
    case 'read':
      message = `${featureName} was fetched successfully.`;
      break;
    case 'delete':
      message = `${featureName} was deleted successfully.`;
      break;
    case 'edit':
      message = `${featureName} was edited successfully.`;
      break;
    default:
      message = 'The operation was completed successfully.';
  }

  setAlertState(message, 'success');
};

/**
 * Displays a failure message for a CRUD operation.
 *
 * @param type The type of CRUD operation.
 * @param featureName The name of the feature being operated on.
 * @param backendMessage Optional message returned from the backend.
 * @returns Nothing.
 */
export const setFailedCrudAlert = (
  type: AlertCrudType,
  featureName: string,
  backendMessage?: string
) => {
  if (backendMessage) return setAlertState(backendMessage, 'error', 2000);

  let message = '';

  switch (type) {
    case 'create':
      message = `Failed to create ${featureName.toLowerCase()}.`;
      break;
    case 'add':
      message = `Failed to add ${featureName.toLowerCase()}.`;
      break;
    case 'update':
      message = `Failed to update ${featureName.toLowerCase()}.`;
      break;
    case 'cancel':
      message = `Failed to cancel ${featureName.toLowerCase()}.`;
      break;
    case 'delete':
      message = `Failed to delete ${featureName.toLowerCase()}.`;
      break;
    case 'read':
      message = `Failed to fetch ${featureName.toLowerCase()}.`;
      break;
    case 'edit':
      message = `Failed to edit ${featureName.toLowerCase()}.`;
      break;
    case 'upload':
      message = `Failed to upload ${featureName.toLowerCase()}.`;
      break;
    default:
      message = 'An error occurred while performing the operation.';
  }

  setAlertState(message, 'error', 3000);
};
