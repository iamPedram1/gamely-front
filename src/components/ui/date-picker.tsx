import * as React from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/utilities/tailwind';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUpdateEffect } from '@/hooks/utils';
import { getDate } from '@/utilities';
import { useTranslation } from 'react-i18next';

interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value '> {
  onChange?: (date: Date | null) => void;
  value?: Date | string | null;
  disabled?: boolean;
}

export function DatePicker({
  className,
  value,
  disabled,
  onChange,
}: DatePickerProps) {
  // States
  const [date, setDate] = React.useState<Date | null>(
    typeof value === 'string' && Boolean(value)
      ? dayjs(value).toDate()
      : value instanceof Date
      ? value
      : null
  );

  // Hooks
  useUpdateEffect(() => {
    setDate(
      typeof value === 'string' && Boolean(value)
        ? dayjs(value).toDate()
        : value instanceof Date
        ? value
        : null
    );
  }, [value]);

  // Utilities
  const handleChange = (date: Date) => {
    setDate(date);
    onChange(date);
  };

  // Render
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            id='date'
            variant={'outline'}
            className={cn(
              'w-[300px] justify-center font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='h-4 w-4' />
            {date ? getDate(date.toISOString()) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            disabled={disabled}
            initialFocus
            mode='default'
            defaultMonth={new Date()}
            selected={date}
            onDayClick={(date) => handleChange(date)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
