import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LoadingWrapper from '@/components/ui/loading-wrapper';
import PaginationControls from '@/components/ui/pagination-controls';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationProps } from '@/utilities/pagination';

interface AdminListLayoutProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  headerActions?: ReactNode;
  filterActions?: ReactNode;
  tableHeaders: string[];
  tableBody: ReactNode;
  pagination?: PaginationProps;
  isLoading?: boolean;
  emptyState?: {
    icon: ReactNode;
    title: string;
    description: string;
  };
  totalCount?: number;
}

export default function AdminListLayout({
  title,
  description,
  icon,
  headerActions,
  filterActions,
  tableHeaders,
  tableBody,
  pagination,
  isLoading = false,
  emptyState,
  totalCount = 0,
}: AdminListLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex items-center gap-3'>
          {icon && <div className='p-2 rounded-lg bg-primary/10'>{icon}</div>}
          <div>
            <h1 className='text-2xl md:text-4xl font-black'>
              <span className='gradient-gaming-text'>{title}</span>
            </h1>
            {description && (
              <p className='text-muted-foreground mt-2'>{description}</p>
            )}
          </div>
        </div>
        {headerActions}
      </div>

      {/* Content Card */}
      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <h2 className='text-xl font-bold'>
              {t('common.total')}: {totalCount}
            </h2>
            {filterActions && (
              <div className='flex items-center gap-3 flex-wrap'>
                {filterActions}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <LoadingWrapper isLoading={isLoading}>
            {totalCount === 0 && emptyState ? (
              <div className='text-center py-12 px-4'>
                <div className='flex justify-center mb-4'>
                  {emptyState.icon}
                </div>
                <h3 className='text-lg font-semibold mb-2'>
                  {emptyState.title}
                </h3>
                <p className='text-muted-foreground'>
                  {emptyState.description}
                </p>
              </div>
            ) : (
              <>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableHeaders.map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>{tableBody}</TableBody>
                  </Table>
                </div>
                {pagination && (
                  <div className='p-4 border-t'>
                    <PaginationControls pagination={pagination} />
                  </div>
                )}
              </>
            )}
          </LoadingWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
