import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PaginationProps } from '@/utilities/pagination';

interface PaginationControlsProps {
  pagination: PaginationProps;
}

function PaginationControls({ pagination }: PaginationControlsProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('limit') ?? 20);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, pagination.totalDocs);

  // Utilities
  const handleSizeChange = (limit: number | string) => {
    searchParams.set('limit', limit.toString());
    setSearchParams(searchParams);
  };

  const handlePageChange = (page: number | string) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  // Render
  return (
    <div className='mt-8 flex items-center justify-center flex-wrap gap-5 px-2 lg:justify-between'>
      <div className='flex items-center gap-4'>
        <p className='text-sm text-muted-foreground'>
          {t('pagination.showing')} {startItem} {t('pagination.to')} {endItem}{' '}
          {t('pagination.of')} {pagination.totalDocs} {t('pagination.results')}
        </p>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            {t('pagination.itemsPerPage')}:
          </span>
          <Select value={pageSize.toString()} onValueChange={handleSizeChange}>
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 40, 60, 80, 100].map((size) => (
                <SelectItem
                  key={`pagination-limit-${size}`}
                  value={size.toString()}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className='h-4 w-4 rtl:rotate-180' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className='h-4 w-4 rtl:rotate-180' />
        </Button>

        <div className='flex items-center gap-1'>
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size='icon'
                  onClick={() => handlePageChange(pageNum)}
                  className={currentPage === pageNum ? 'gradient-gaming' : ''}
                >
                  {pageNum}
                </Button>
              );
            }
          )}
        </div>

        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
        >
          <ChevronRight className='h-4 w-4 rtl:rotate-180' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(pagination.totalPages)}
          disabled={currentPage === pagination.totalPages}
        >
          <ChevronsRight className='h-4 w-4 rtl:rotate-180' />
        </Button>
      </div>
    </div>
  );
}

export default PaginationControls;
