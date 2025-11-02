import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BlockUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  onConfirm: () => void;
}

export default function BlockUserDialog({
  open,
  onOpenChange,
  username,
  onConfirm,
}: BlockUserDialogProps) {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='flex items-center gap-2 mb-2'>
            <div className='p-2 rounded-lg bg-orange-100 dark:bg-orange-900'>
              <Shield className='h-5 w-5 text-orange-600' />
            </div>
            <AlertDialogTitle>{t('user.blockUser')}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {t('user.blockUserDescription', { username })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex gap-4'>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className='bg-orange-600 hover:bg-orange-700'
          >
            {t('common.block')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
