import { useMemo } from 'react';
import { object } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Components
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Context
import useLoadingStore from '@/store/loading';

// Custom Utilities
import { createOnErrorHandler } from '@/utilities';
import { generateStringSchema } from '@/validations/common';
import { useCreateComment, useUpdateComment } from '@/utilities/api/comment';

// Types
import type { CommentProps } from '@/types/blog';

interface MutateCommentDialogProps {
  onClose: () => void;
  postId: string;
  replyToComment?: CommentProps;
  commentToEdit?: CommentProps;
}

const createCommentSchema = () =>
  object({
    comment: generateStringSchema('comment', 3, 255),
    replyToCommentId: generateStringSchema(
      'replyToId',
      undefined,
      undefined,
      false
    ).nullable(),
  });

type FormSchema = Zod.infer<ReturnType<typeof createCommentSchema>>;

const MutateCommentDialog = (props: MutateCommentDialogProps) => {
  // Props
  const { onClose, postId, commentToEdit, replyToComment } = props;

  // States
  const isEditMode = Boolean(commentToEdit);

  // Custom Hooks
  const { t, i18n } = useTranslation();

  // Context
  const { loading } = useLoadingStore();

  // Custom Hooks
  const schema = useMemo(createCommentSchema, [i18n.language]);
  const { control, handleSubmit } = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: commentToEdit
      ? { comment: commentToEdit.content, replyToCommentId: replyToComment?.id }
      : undefined,
  });

  const createComment = useCreateComment({
    onSuccess: onClose,
    autoAlert: { mode: 'add', name: 'Comment' },
  });
  const updateComment = useUpdateComment({
    onSuccess: onClose,
    autoAlert: { mode: 'update', name: 'Category' },
  });

  // Custom Utilities
  const onSubmit = (data: Required<FormSchema>) => {
    if (isEditMode)
      updateComment.mutate({ commentId: commentToEdit.id, postId, ...data });
    else createComment.mutate({ postId, ...data });
  };

  const disabled =
    loading || (isEditMode ? updateComment.isPending : createComment.isPending);

  // Render
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t('comment.editComment') : t('comment.addNewComment')}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t('comment.editCommentInPost')
              : t('comment.createNewComment')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, createOnErrorHandler)}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>
                {t('common.comment')} {t('form.required')}
              </Label>
              <Controller
                control={control}
                name='comment'
                render={({ field }) => (
                  <Textarea
                    id='comment'
                    placeholder={t('comment.whatsUp')}
                    required
                    rows={10}
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              disabled={disabled}
              onClick={onClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              disabled={disabled}
              type='submit'
              className='gradient-gaming'
            >
              {isEditMode ? t('comment.editComment') : t('comment.addComment')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MutateCommentDialog;
