import { Check, ChevronsUpDown } from 'lucide-react';

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
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

interface FilterComboboxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  list: readonly { readonly label: string; readonly value: string }[];
  setSelectedValue: (value: string) => void;
  selectedValue: string;
  showLabel: string;
}

export default function FilterCombobox({
  open,
  setOpen,
  list,
  setSelectedValue,
  selectedValue,
  showLabel,
}: FilterComboboxProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValue
            ? list.find((item) => item.value === selectedValue)?.label
            : `Select ${showLabel}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Select ${showLabel}...`} />
          <CommandEmpty>No {showLabel} found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {list.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setSelectedValue(
                      currentValue === selectedValue ? '' : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
