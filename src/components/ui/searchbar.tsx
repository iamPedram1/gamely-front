import * as React from 'react';
import { Search } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

//  Components
import { Input } from '@/components/ui/input';

// Utilities
import { debounce } from '@/utilities/helperPack';
import { useTranslation } from 'react-i18next';

// Custom Types
interface SearchbarProps {
  placeholder?: string;
}

type FormProps = { search: string };

const Searchbar = (props: SearchbarProps) => {
  // Props
  const { placeholder } = props;

  // Hooks
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const { control } = useForm<FormProps>({
    defaultValues: { search: searchParams.get('search') },
    values: { search },
  });

  // Utilities
  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(() => {
      const sp = new URLSearchParams(searchParams);
      if (e.target.value) sp.set('search', e.target.value);
      else sp.delete('search');
      sp.set('page', '1');
      return sp;
    });
  }, 1000);

  // Render
  return (
    <div className='relative'>
      <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
      <Controller
        name='search'
        control={control}
        rules={{ onChange: handleChange }}
        render={({ field }) => (
          <Input
            placeholder={placeholder || `${t('common.search')} ...`}
            className='pl-10 w-[250px]'
            {...field}
          />
        )}
      />
    </div>
  );
};

export default Searchbar;
