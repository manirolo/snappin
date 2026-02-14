import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@snappin/ui/components/popover";
import { Button } from "@snappin/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@snappin/ui/components/command";
import { ScrollArea } from "@snappin/ui/components/scroll-area";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

function FilterItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={"ghost"}
      onClick={onClick}
      className="w-full flex justify-start"
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
    </Button>
  );
}

const countries = [
  "Andorra",
  "United Arab Emirates",
  "Afghanistan",
  "Antigua and Barbuda",
  "Anguilla",
  "Albania",
  "Armenia",
  "Angola",
  "Antarctica",
];

export function CountryFilter({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className="flex items-center justify-start gap-2 px-4 py-3 border-b text-sm font-medium">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          ←
        </button>
        <span>Country</span>
      </div>

      <Command>
        <CommandInput placeholder="Search country..." />
        <CommandEmpty>No country found.</CommandEmpty>

        <ScrollArea className="h-64">
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem key={country}>🌍 {country}</CommandItem>
            ))}
          </CommandGroup>
        </ScrollArea>
      </Command>
    </>
  );
}

export const FilterInvoice = () => {
  const [activeFilter, setActiveFilter] = useState<null | "country">(null);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline_2"
            size="sm"
            className="shadow-[0px_2px_0px_var(--color-gray-3)] hover:shadow-[0px_2px_0px_var(--color-shadow)] hover:border-shadow bg-white border border-gray-4"
          >
            <Icon icon="fluent:filter-16-filled" className="text-muted-foreground"/>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-64 p-2">
          {activeFilter === null && (
            <>
              <div className="text-sm font-medium mb-2 px-2 text-muted-foreground">
                Filter stats by
              </div>

              <FilterItem
                label="Vendor"
                icon={<Icon icon="" className="w-4 h-4" />}
              />
              <FilterItem
                label="Email Sender"
                icon={<Icon icon="" className="w-4 h-4" />}
              />
              <FilterItem
                label="Email Recipient"
                icon={<Icon icon="" className="w-4 h-4" />}
              />

              <FilterItem
                label="Currency"
                icon={<Icon icon="" className="w-4 h-4" />}
                onClick={() => setActiveFilter("country")}
              />

              <FilterItem
                label="Source"
                icon={<Icon icon="" className="w-4 h-4" />}
                onClick={() => setActiveFilter("country")}
              />
            </>
          )}

          {activeFilter === "country" && (
            <CountryFilter onBack={() => setActiveFilter(null)} />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
