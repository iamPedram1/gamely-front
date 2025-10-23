import { create } from 'zustand';

export type SeverityType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationStateProps {
  id: string;
  severity: SeverityType;
  message: string;
  duration?: number;
}

type AlertStoreProps = {
  notifications: NotificationStateProps[];
  addAlert: (alert: Omit<NotificationStateProps, 'id'>) => void;
  removeAlert: (id: string) => void;
  clearAllAlerts: () => void;
};

const useAlertStore = create<AlertStoreProps>()((set) => ({
  notifications: [],
  addAlert: (alert) =>
    set((state) => {
      const newNotification: NotificationStateProps = {
        ...alert,
        id: `${Date.now()}-${Math.random()}`,
        duration: alert.duration || 3000,
      };

      // Keep only the last 2 notifications, then add the new one (max 5 total)
      const updatedNotifications = [
        ...state.notifications.slice(-4),
        newNotification,
      ];

      return { notifications: updatedNotifications };
    }),
  removeAlert: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAllAlerts: () => set({ notifications: [] }),
}));

export default useAlertStore;
