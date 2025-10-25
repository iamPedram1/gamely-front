import useAlertStore, { SeverityType } from './slice';

export const setAlertState = (
  message: string,
  severity: SeverityType = 'error',
  duration: number = 5000
): void => {
  if (typeof message !== 'string') return;
  useAlertStore.getState().addAlert({
    message,
    severity,
    duration: duration || 5000,
  });
};
