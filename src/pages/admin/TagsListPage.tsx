import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import Searchbar from '@/components/ui/searchbar';
import PaginationControls from '@/components/ui/pagination-controls';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Context
import useLoadingStore from '@/store/loading';

// Utilities
import routes from '@/utilities/routes';
import { useDeleteTag, useTagsQuery } from '@/utilities/api/management/tag';

export default function TagsListPage() {
  // Context
  const { loading } = useLoadingStore();

  // Hooks
  const tags = useTagsQuery();
  const deleteTag = useDeleteTag();
  const { t, i18n } = useTranslation();
  const disabled = loading || deleteTag.isPending;

  // Render
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black rtl:flex rtl:flex-row-reverse rtl:gap-2'>
            <span className='gradient-gaming-text'>{t('dashboard.tags')}</span>{' '}
            {t('dashboard.management')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('dashboard.manageAllTags')}
          </p>
        </div>
        <Link to={routes.dashboard.tags.add}>
          <Button
            disabled={disabled}
            className='gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase rtl:flex-row-reverse'
          >
            <Plus className='h-4 w-4' />
            {t('dashboard.addTags')}
          </Button>
        </Link>
      </div>
      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>
              {t('dashboard.allTags')} ({tags?.data?.pagination?.totalDocs || 0}
              )
            </h2>
            <div className='flex items-center gap-3'>
              <Searchbar placeholder={t('common.searchInTags')} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.slug')}</TableHead>
                <TableHead className='ltr:text-end rtl:text-end'>
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags?.data?.docs?.map?.((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className='font-medium'>
                    #{tag.translations[i18n.language].title}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {tag.slug}
                  </TableCell>
                  <TableCell className='text-end'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link to={routes.dashboard.tags.edit(tag.id)}>
                        <Button disabled={disabled} variant='ghost' size='icon'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteTag.mutate(tag.id)}
                        disabled={disabled}
                        variant='ghost'
                        size='icon'
                        className='text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {tags?.data?.pagination && (
            <PaginationControls pagination={tags.data.pagination} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
