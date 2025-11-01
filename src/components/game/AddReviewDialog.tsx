import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Send } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAddGameReviewMutation } from '@/utilities/api/gameReview';
import { createOnErrorHandler } from '@/utilities';

const reviewSchema = z.object({
  rate: z
    .number()
    .min(1, 'Rate is required')
    .max(5, 'Rate must be between 1 and 5'),
  description: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must be less than 500 characters'),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface RatingStarsProps {
  rate: number;
  onRate: (rate: number) => void;
  error?: boolean;
}

function RatingStars({ rate, onRate, error }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          className={`transition-all duration-200 cursor-pointer hover:scale-110 ${
            error ? 'text-red-500' : ''
          }`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRate(star)}
        >
          <Star
            className={`h-6 w-6 ${
              star <= (hoverRating || rate)
                ? 'fill-yellow-400 text-yellow-400'
                : error
                ? 'text-red-300'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

interface AddReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  gameTitle: string;
}

export default function AddReviewDialog({
  open,
  onOpenChange,
  gameId,
  gameTitle,
}: AddReviewDialogProps) {
  // Hooks
  const { t } = useTranslation();
  const formMethods = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
  });
  const addGameReview = useAddGameReviewMutation({
    onSuccess: () => handleCancel(),
  });

  // Utilities
  const onSubmit = (data: Required<ReviewForm>) => {
    addGameReview.mutate({ gameId, data });
  };

  const handleCancel = () => {
    formMethods.reset();
    onOpenChange(false);
  };

  // Render
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20'>
              <Star className='h-5 w-5 text-yellow-600' />
            </div>
            <div>
              <DialogTitle className='text-xl'>
                {t('game.addReview')}
              </DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                {t('game.reviewFor')} "{gameTitle}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit, createOnErrorHandler)}
            className='space-y-6'
          >
            {/* Rating */}

            <FormItem>
              <FormLabel className='text-base font-semibold'>
                {t('game.yourRating')} *
              </FormLabel>
              <FormControl>
                <Controller
                  control={formMethods.control}
                  name='rate'
                  defaultValue={0}
                  render={({ field, fieldState }) => (
                    <div className='space-y-2'>
                      <RatingStars
                        rate={field.value}
                        onRate={field.onChange}
                        error={!!fieldState.error}
                      />
                      {field.value > 0 && (
                        <p className='text-sm text-muted-foreground'>
                          {field.value} {t('game.outOf5Stars')}
                        </p>
                      )}
                    </div>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Review Description */}

            <FormItem>
              <FormLabel className='text-base font-semibold'>
                {t('game.reviewDescription')} *
              </FormLabel>
              <FormControl>
                <Controller
                  control={formMethods.control}
                  name='description'
                  defaultValue=''
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Textarea
                        placeholder={t('game.reviewPlaceholder')}
                        rows={4}
                        className='resize-none'
                        {...field}
                      />
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>{t('game.reviewHint')}</span>
                        <span>{field.value.length}/500</span>
                      </div>
                    </div>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter className='gap-2'>
              <Button type='button' variant='outline' onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button
                type='submit'
                disabled={formMethods.formState.isSubmitting}
                className='bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
              >
                <Send className='h-4 w-4 mr-2' />
                {formMethods.formState.isSubmitting
                  ? t('game.submittingReview')
                  : t('game.submitReview')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
