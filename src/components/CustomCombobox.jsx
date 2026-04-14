import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';
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
import { FormControl } from '@/components/ui/form';
import {
  fetchBrands,
  fetchCategories,
  fetchBrandById,
  fetchCategoryById,
} from '@/utils/queries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BrandForm from './forms/BrandForm';
import { toast } from 'sonner';
import { TbEdit } from 'react-icons/tb';

export function CustomCombobox({ onChange, value, name, isSuperAdmin }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [creatingBrand, setIsCreatingBrand] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    data: listData = [],
    isLoading: isListLoading,
    error: listError,
  } = useQuery({
    queryKey: [name, search],
    queryFn: () => {
      if (name === 'category') {
        return fetchCategories(search);
      } else {
        return fetchBrands(search);
      }
    },
  });

  const {
    data: singleItemData,
    // isLoading: isSingleItemLoading,
    error: singleItemError,
  } = useQuery({
    queryKey: [name, value],
    queryFn: () => {
      if (name === 'category') {
        return fetchCategoryById(value);
      } else {
        return fetchBrandById(value);
      }
    },
    enabled: !search && !!value && !listData.find((item) => item.id === value),
  });
  //   console.log('listData', listData);
  //   console.log('singleItemData', singleItemData);

  useEffect(() => {
    if (listError || singleItemError) {
      const error = listError || singleItemError;
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [listError, singleItemError]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const getDisplayValue = () => {
    if (!value) return `Select ${name}...`;
    const listItem = listData.find((item) => item.id === value);
    if (listItem) return listItem?.name;
    if (singleItemData) return singleItemData?.name;
    return 'Loading...';
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full justify-between text-[14px] leading-[20px] ${
                !value ? 'text-[#B2C2D2]' : 'text-[#36454F]'
              } placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4`}
            >
              {getDisplayValue()}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 sm:min-w-[320px] ">
          <Command shouldFilter={false} className="text-[#36454F]">
            <CommandInput
              placeholder={`Search ${name}...`}
              onValueChange={(search) => setSearch(search)}
            />
            <CommandList>
              <CommandEmpty>
                {isListLoading || !listData ? (
                  'Loading...'
                ) : (
                  <Button
                    disabled={openModal}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsCreatingBrand(true);
                      setOpenModal(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create &apos;{search}&apos; {name}
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {listData.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                    className="group flex justify-between items-center text-[#36454F]"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === item.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {item.name}
                    </div>
                    {isSuperAdmin && (
                      <Button
                        variant="ghost"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                      >
                        <TbEdit className="h-4 w-4 group-hover:block hidden" />
                      </Button>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[426px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E] capitalize">
              Edit {name}
            </DialogTitle>
          </DialogHeader>
          <BrandForm
            setOpenBrandModal={setOpenModal}
            name={name}
            selectedItem={selectedItem}
            isCreating={creatingBrand}
            onChange={onChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

CustomCombobox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isSuperAdmin: PropTypes.bool,
};
