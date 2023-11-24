"use client";
import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

/**
 * Renders a store switcher component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.className - The CSS class name for the component.
 * @param {Array} props.items - The list of items for the store switcher.
 * @returns {JSX.Element} The rendered store switcher component.
 */
export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps): JSX.Element {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false); // state to track if the popover is open

  // map through the items array and return an object with the label and value properties
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  })); // [{ label: 'Store 1', value: '1' }, { label: 'Store 2', value: '2' }]

  // check if the item.id is the same as the params.storeId and assign it to a variable called currentStoreId
  const currentStoreName = formattedItems.find(
    (item) => item.value === params.storeId
  );

  /**
   * Handles the selection of a store.
   *
   * @param store - The selected store object containing a value and label.
   */
  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
            {currentStoreName?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStoreName?.value === store.value 
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
                <CommandItem
                    onSelect={() => {
                        setOpen(false); // close the popover
                        storeModal.onOpen(); // open the modal
                    }}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Store
                </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
