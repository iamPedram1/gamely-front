import useAlertStore, { Severity } from './slice';

export const setAlertState = (
  message: string,
  severity: Severity = 'error',
  duration: number = 5000
): void => {
  if (typeof message !== 'string') return;
  useAlertStore.getState().addAlert({
    message,
    severity,
    duration: duration || 5000,
  });
};

export const reInitialAlert = (): void => {
  useAlertStore.getState().reInitialAlert();
};

export const closeAlert = (): void => {
  useAlertStore.getState().closeAlert();
};
