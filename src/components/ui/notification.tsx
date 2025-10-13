'use client';

import * as Toast from '@radix-ui/react-toast';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { useMemo } from 'react';

// Store
import useAlertStore from '@/store/alert';

export default function NotificationProvider() {
  const { open, message, severity, closeAlert } = useAlertStore();

  // Map toast severity to icon + color
  const { Icon, color, border } = useMemo(() => {
    switch (severity) {
      case 'success':
        return {
          Icon: CheckCircledIcon,
          color: 'text-green-400',
          border: 'border-green-500/40',
        };
      case 'error':
        return {
          Icon: CrossCircledIcon,
          color: 'text-red-400',
          border: 'border-red-500/40',
        };
      case 'warning':
        return {
          Icon: ExclamationTriangleIcon,
          color: 'text-yellow-400',
          border: 'border-yellow-500/40',
        };
      case 'info':
      default:
        return {
          Icon: InfoCircledIcon,
          color: 'text-blue-400',
          border: 'border-blue-500/40',
        };
    }
  }, [severity]);

  return (
    <Toast.Provider swipeDirection='right' duration={3000}>
      <Toast.Root
        open={open}
        onOpenChange={(s) => !s && closeAlert()}
        className={`
          flex items-start gap-3
          bg-gray-900 text-white rounded-lg px-4 py-3
          shadow-lg border ${border}
          transition-all data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=open]:fade-in data-[state=closed]:fade-out
          data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
          data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[100%]
        `}
      >
        <div className={`mt-0.5 ${color}`}>
          <Icon className='w-5 h-5' />
        </div>

        <div className='flex flex-col'>
          {message && (
            <Toast.Title className='font-semibold leading-tight'>
              {message}
            </Toast.Title>
          )}
        </div>
      </Toast.Root>

      <Toast.Viewport className='fixed bottom-4 left-4 flex flex-col gap-2 w-80 outline-none z-[999]' />
    </Toast.Provider>
  );
}
