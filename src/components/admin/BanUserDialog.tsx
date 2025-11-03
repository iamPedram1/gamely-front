import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { object, enum as zodEnum, string } from 'zod';
import { Ban } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Utilities
import { createOnErrorHandler } from '@/utilities';
import { generateStringSchema } from '@/validations/common';
import { Textarea } from '@/components/ui/textarea';

const createBanUserSchema = () =>
  object({
    reason: generateStringSchema('reason', 1, 255, false),
    type: zodEnum(['permanent', 'temporary']),
    endAt: string().nullable(),
  }).refine(
    (data) => {
      if (data.type === 'temporary' && !data.endAt) {
        return false;
      }
      return true;
    },
    {
      message: 'End date is required for temporary bans',
      path: ['endAt'],
    }
  );

type FormSchema = Zod.infer<ReturnType<typeof createBanUserSchema>>;

interface BanUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: FormSchema) => void;
  userName: string;
  isLoading?: boolean;
}

export default function BanUserDialog(props: BanUserDialogProps) {
  const { open, onClose, onConfirm, userName, isLoading = false } = props;

  // Hooks
  const { t, i18n } = useTranslation();
  const schema = useMemo(createBanUserSchema, [i18n.language]);
  const { control, handleSubmit, reset, setValue } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'permanent',
      endAt: null,
    },
  });
  const banType = useWatch({ control, name: 'type' });

  // Utilities
  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: FormSchema) => {
    const payload = {
      ...data,
      endAt: data.type === 'permanent' ? null : data.endAt,
    };
    onConfirm(payload);
    handleClose();
  };

  const handleTypeChange = (checked: boolean) => {
    const newType = checked ? 'temporary' : 'permanent';
    setValue('type', newType);
    if (newType === 'permanent') {
      setValue('endAt', null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='flex gap-2'>
          <DialogTitle className='flex items-center gap-2'>
            <Ban className='h-5 w-5 text-destructive' />
            {t('ban.banUser')}
          </DialogTitle>
          <DialogDescription>
            {t('ban.banUserDialogDescription', { name: userName })}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit, createOnErrorHandler)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            {/* Ban Type Toggle */}
            <div className='flex items-center justify-between space-x-2 rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <Label htmlFor='ban-type' className='text-base font-medium'>
                  {t('ban.temporaryBan')}
                </Label>
                <p className='text-sm text-muted-foreground'>
                  {banType === 'temporary'
                    ? t('ban.temporaryBanDescription')
                    : t('ban.permanentBanDescription')}
                </p>
              </div>
              <Controller
                control={control}
                name='type'
                render={({ field }) => (
                  <Switch
                    id='ban-type'
                    checked={field.value === 'temporary'}
                    onCheckedChange={handleTypeChange}
                    disabled={isLoading}
                  />
                )}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='reason'>{t('fields.reason')}</Label>
              <Controller
                control={control}
                name='reason'
                render={({ field }) => (
                  <Textarea id='reason' rows={4} {...field} />
                )}
              />
            </div>

            {/* End Date (only for temporary bans) */}
            {banType === 'temporary' && (
              <div className='space-y-2 min-w-full'>
                <Label htmlFor='endAt'>
                  {t('ban.endDate')} {t('form.required')}
                </Label>
                <Controller
                  control={control}
                  name='endAt'
                  render={({ field, fieldState }) => (
                    <div className='space-y-1 min-w-full'>
                      <DatePicker
                        className='min-w-full'
                        disabled={isLoading}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(date?.toISOString() || '')
                        }
                      />
                      {fieldState.error && (
                        <p className='text-sm text-destructive'>
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type='submit'
              variant='destructive'
              disabled={isLoading}
              className='gap-2'
            >
              <Ban className='h-4 w-4' />
              {t('ban.banUser')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
