'use client';
import { create } from 'zustand';

export type SeverityType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationStateProps {
  severity: SeverityType | '';
  open?: boolean;
  message?: string;
  duration?: number;
}

// Custom Types
const initialState: NotificationStateProps = {
  severity: '',
  message: '',
  open: false,
  duration: 2500,
};

type AlertStoreProps = NotificationStateProps & {
  addAlert: (alert: Omit<NotificationStateProps, 'open'>) => void;
  closeAlert: () => void;
  reInitialAlert: () => void;
};

const useAlertStore = create<AlertStoreProps>()((set) => ({
  ...initialState,
  addAlert: (alert) => set(() => ({ ...alert, open: true })),
  closeAlert: () => set((prev) => ({ ...prev, open: false })),
  reInitialAlert: () => set(() => initialState),
}));

export default useAlertStore;
