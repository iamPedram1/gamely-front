import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateReportMutate } from '@/utilities/api/report';
import { ReportReasonType, ReportType } from '@/types/management/report';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
  type: ReportType;
}

const reportTypes: Array<{ value: ReportReasonType; label: string }> = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'misinformation', label: 'Misinformation' },
  { value: 'violence', label: 'Violence or Threats' },
  { value: 'other', label: 'Other' },
];

export default function ReportDialog({
  open,
  onOpenChange,
  targetId,
  type,
}: ReportDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<ReportReasonType>('spam');
  const [description, setDescription] = useState('');

  const report = useCreateReportMutate({
    onSuccess: () => {
      setReason('spam');
      setDescription('');
      onOpenChange(false);
    },
  });

  const handleSubmit = () => {
    if (!reason || !description.trim()) return;

    report.mutate({ reason, type, description, targetId });
  };

  const handleCancel = () => {
    setReason('spam');
    setDescription('');
    onOpenChange(false);
  };

  const getReportTitle = () => {
    switch (type) {
      case 'post':
        return t('report.reportPost');
      case 'user':
        return t('report.reportUser');
      case 'comment':
        return t('report.reportComment');
      default:
        return t('report.reportContent');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 sm:max-w-[500px]'>
        <DialogHeader className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='p-2 rounded-lg bg-red-100 dark:bg-red-900'>
              <Flag className='h-5 w-5 text-red-600' />
            </div>
            <DialogTitle>{getReportTitle()}</DialogTitle>
          </div>
          <DialogDescription>
            {t('report.reportDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Report Type */}
          <div className='space-y-3'>
            <Label className='text-base font-semibold'>
              {t('report.reportReason')}
            </Label>
            <RadioGroup
              className='flex flex-col gap-3'
              value={reason}
              onValueChange={(value) => setReason(value as ReportReasonType)}
            >
              {reportTypes.map((type) => (
                <div key={type.value} className='flex items-center gap-2'>
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label
                    htmlFor={type.value}
                    className='font-normal cursor-pointer'
                  >
                    {t(`report.reasons.${type.value}`, type.label)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description' className='text-base font-semibold'>
              {t('report.additionalDetails')}
            </Label>
            <Textarea
              id='description'
              placeholder={t('report.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className='resize-none'
            />
            <p className='text-sm text-muted-foreground'>
              {t('report.descriptionHint')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!description.trim() || report.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {report.isPending ? t('report.submitting') : t('report.submitReport')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}