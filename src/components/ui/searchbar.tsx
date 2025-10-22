import * as React from 'react';
import { Search } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

//  Components
import { Input } from '@/components/ui/input';

// Custom Utilities
import { debounce } from '@/utilities/helperPack';

// Custom Types
interface SearchbarProps {
  placeholder?: string;
}

type FormProps = { search: string };

const Searchbar = (props: SearchbarProps) => {
  // Props
  const { placeholder = 'Search ...' } = props;

  // Hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const { control } = useForm<FormProps>({
    defaultValues: { search: searchParams.get('search') },
  });

  // Utilities
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.set('search', e.target.value);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const debouneChange = debounce(handleChange, 1000);

  // Render
  return (
    <div className='relative'>
      <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
      <Controller
        name='search'
        control={control}
        rules={{ onChange: debouneChange }}
        render={({ field }) => (
          <Input
            placeholder={placeholder}
            className='pl-10 w-[250px]'
            value={field.value}
            onChange={debouneChange}
          />
        )}
      />
    </div>
  );
};

export default Searchbar;
