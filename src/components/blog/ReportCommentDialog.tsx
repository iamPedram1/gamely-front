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

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  contentType: 'comment' | 'post' | 'user';
  onSubmit: (data: { type: string; description: string }) => void;
}

const reportTypes = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'misinformation', label: 'Misinformation' },
  { value: 'violence', label: 'Violence or Threats' },
  { value: 'other', label: 'Other' },
];

export default function ReportCommentDialog({
  open,
  onOpenChange,
  contentId,
  contentType,
  onSubmit,
}: ReportDialogProps) {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState('spam');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!reportType || !description.trim()) {
      return;
    }

    onSubmit({
      type: reportType,
      description: description.trim(),
    });

    // Reset form
    setReportType('spam');
    setDescription('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setReportType('spam');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <div className='flex items-center gap-2 mb-2'>
            <div className='p-2 rounded-lg bg-red-100 dark:bg-red-900'>
              <Flag className='h-5 w-5 text-red-600' />
            </div>
            <DialogTitle>{t('comment.reportContent')}</DialogTitle>
          </div>
          <DialogDescription>
            {t('comment.reportContentDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Report Type */}
          <div className='space-y-3'>
            <Label className='text-base font-semibold'>
              {t('comment.reportType')}
            </Label>
            <RadioGroup value={reportType} onValueChange={setReportType}>
              {reportTypes.map((type) => (
                <div key={type.value} className='flex items-center space-x-2'>
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label
                    htmlFor={type.value}
                    className='font-normal cursor-pointer'
                  >
                    {t(`comment.reportTypes.${type.value}`, type.label)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description' className='text-base font-semibold'>
              {t('comment.reportDescription')}
            </Label>
            <Textarea
              id='description'
              placeholder={t('comment.reportDescriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className='resize-none'
            />
            <p className='text-sm text-muted-foreground'>
              {t('comment.reportDescriptionHint')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!description.trim()}
            className='bg-red-600 hover:bg-red-700'
          >
            {t('comment.submitReport')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
