'use client';

import * as React from 'react';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

// Components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Utilities
import { cn } from '@/utilities/tailwind';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  maxSelected?: number;
}

export function MultiSelect({
  options = [],
  selected,
  onChange,
  placeholder,
  emptyText,
  searchPlaceholder,
  className,
  disabled = false,
  maxSelected,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation();
  console.log(options);

  const defaultPlaceholder = placeholder || t('multiSelect.selectItems');
  const defaultEmptyText = emptyText || t('multiSelect.noItemsFound');
  const defaultSearchPlaceholder = searchPlaceholder || t('multiSelect.search');

  const handleSelect = (value: string) => {
    const isSelected = selected.includes(value);

    if (isSelected) {
      onChange(selected.filter((item) => item !== value));
    } else {
      if (maxSelected && selected.length >= maxSelected) {
        return;
      }
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between p-2 h-9 bg-inherit hover:bg-inherit',
            !selected.length && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <div className='flex flex-wrap gap-1 flex-1'>
            {selected.length === 0 ? (
              <span className='text-black/90 dark:text-white/90 font-normal'>
                {defaultPlaceholder}
              </span>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant='secondary'
                  className='flex flex-row py-0.5 items-center justify-center'
                >
                  {option.label}
                  <button
                    className='ms-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRemove(option.value, e as any);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => handleRemove(option.value, e)}
                  >
                    <Cross2Icon className='h-3 w-3 relative text-muted-foreground hover:text-foreground' />
                  </button>
                </Badge>
              ))
            )}
          </div>
          {selected.length > 0 && (
            <button
              className='ms-2 ring-offset-background rounded-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleClear(e as any);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleClear}
            >
              <Cross2Icon className='h-4 w-4 shrink-0 opacity-50 hover:opacity-100' />
            </button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder={defaultSearchPlaceholder} />
          <CommandList>
            <CommandEmpty>{defaultEmptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                const isDisabled =
                  !isSelected &&
                  maxSelected !== undefined &&
                  selected.length >= maxSelected;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      if (!isDisabled) {
                        handleSelect(option.value);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      'cursor-pointer',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className='h-4 w-4' />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
