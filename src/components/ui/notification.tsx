'use client';

import * as Toast from '@radix-ui/react-toast';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { TriangleAlert, X } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';

// Store
import useAlertStore from '@/store/alert';
import type { SeverityType } from '@/store/alert/slice';
import { useBoolean } from '@/hooks/state';

function NotificationItem({
  id,
  message,
  severity,
  duration,
  onRemove,
}: {
  id: string;
  message: string;
  severity: SeverityType;
  duration: number;
  onRemove: (id: string) => void;
}) {
  const isVisible = useBoolean();
  const isExiting = useBoolean();

  // Map toast severity to icon + color
  const { Icon, color, border, bgColor } = useMemo(() => {
    switch (severity) {
      case 'success':
        return {
          Icon: CheckCircledIcon,
          color: 'text-green-400',
          border: 'border-green-500/40',
          bgColor: 'bg-green-950/50',
        };
      case 'error':
        return {
          Icon: TriangleAlert,
          color: 'text-red-400',
          border: 'border-red-500/40',
          bgColor: 'bg-red-950/50',
        };
      case 'warning':
        return {
          Icon: ExclamationTriangleIcon,
          color: 'text-yellow-400',
          border: 'border-yellow-500/40',
          bgColor: 'bg-yellow-950/50',
        };
      case 'info':
      default:
        return {
          Icon: InfoCircledIcon,
          color: 'text-blue-400',
          border: 'border-blue-500/40',
          bgColor: 'bg-blue-950/50',
        };
    }
  }, [severity]);

  useEffect(() => {
    const timer = setTimeout(isVisible.setTrue, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      isExiting.setTrue();
      setTimeout(() => onRemove(id), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const handleClose = () => {
    isExiting.setTrue();
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <Toast.Root
      open={true}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
      duration={duration}
      className={`
        flex items-center gap-3
        ${bgColor} backdrop-blur-sm text-white rounded-lg px-4 py-3
        shadow-lg border ${border}
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        w-full max-w-sm
        ${
          isExiting.state
            ? 'translate-y-[120%] opacity-0'
            : isVisible.state
            ? 'translate-y-0 opacity-100'
            : 'translate-y-[120%] opacity-0'
        }
      `}
      style={{ transition: 'transform 0.3s ease-out, opacity 0.3s ease-out' }}
    >
      <div className={`${color} flex-shrink-0`}>
        <Icon className='w-5 h-5' />
      </div>

      <div className='flex-1 min-w-0'>
        {message && (
          <Toast.Title className='font-medium leading-tight text-sm break-words'>
            {message}
          </Toast.Title>
        )}
      </div>

      <Toast.Close
        className={`hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label='Close'
        onClick={handleClose}
      >
        <X className='w-5 h-5' />
      </Toast.Close>
    </Toast.Root>
  );
}

export default function NotificationProvider() {
  const { notifications, removeAlert } = useAlertStore();

  return (
    <Toast.Provider swipeDirection='right'>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          message={notification.message}
          severity={notification.severity}
          duration={notification.duration || 3000}
          onRemove={removeAlert}
        />
      ))}

      <Toast.Viewport className='fixed bottom-4 right-4 flex flex-col-reverse gap-2 w-full max-w-sm outline-none z-[999] p-4 pointer-events-none [&>*]:pointer-events-auto' />
    </Toast.Provider>
  );
}
