"use client";

import React, { HTMLAttributes, useState, useMemo, useRef, useEffect } from "react";
import { Label } from "../../label";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  // CommandSeparator,
} from "../../command";
import { cn } from "../../../lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ComboBoxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  keywords?: string[];
}

interface ComboBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: ComboBoxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  defaultOpen?: boolean;
  popularValues?: string[];
  popularLabel?: string;
  showOptionValue?: boolean;
  alphabetical?: boolean;
  disabled?: boolean;
  popoverWidth?: string;
}

function groupByLetter(options: ComboBoxOption[]): Record<string, ComboBoxOption[]> {
  return options.reduce<Record<string, ComboBoxOption[]>>((acc, opt) => {
    const letter = opt.label[0]?.toUpperCase() ?? "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(opt);
    return acc;
  }, {});
}

function IconWrapper({ icon }: { icon: React.ReactNode }) {
  if (!icon) return null;
  if (typeof icon === "string") {
    return <span className="flex h-5 w-5 items-center justify-center text-base leading-none">{icon}</span>;
  }
  return <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>;
}

export const ComboBox = React.forwardRef<HTMLDivElement, ComboBoxProps>(
  (
    {
      label,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      popularValues,
      popularLabel = "POPULAR",
      alphabetical = true,
      disabled = false,
      popoverWidth,
      defaultOpen,
      className,
      showOptionValue = true,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<string>(defaultValue ?? "");
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(defaultOpen ?? false);

    // ✅ Ref to reset scroll on each search change
    const listRef = useRef<HTMLDivElement>(null);

    const isSearching = search.trim().length > 0;
    const value = controlledValue ?? internalValue;
    const selected = options.find((o) => o.value === value);

    // ✅ Reset scroll to top whenever search term changes
    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    }, [search]);

    const handleOpenChange = (next: boolean) => {
      if (disabled) return;
      if (!next) setSearch("");
      setOpen(next);
    };

    const handleSelect = (optValue: string) => {
      const next = optValue === value ? "" : optValue;
      setInternalValue(next);
      onChange?.(next);
      setSearch("");
      setOpen(false);
    };

    // ── Scored filter — replaces cmdk's built-in shouldFilter ─────────────
    const filteredOptions = useMemo(() => {
      if (!isSearching) return options;

      const q = search.trim().toLowerCase();

      return options
        .map((opt) => {
          const v = opt.value.toLowerCase();
          const l = opt.label.toLowerCase();
          const kw = opt.keywords?.map((k) => k.toLowerCase()) ?? [];

          let score = 0;
          if (v === q)                                score = 100; // USD → USD
          else if (v.startsWith(q))                   score = 90;  // US  → USD
          else if (l === q)                           score = 80;
          else if (l.startsWith(q))                   score = 70;
          else if (kw.some((k) => k === q))           score = 60;
          else if (kw.some((k) => k.startsWith(q)))   score = 50;
          else if (v.includes(q) || l.includes(q))    score = 30;
          else if (kw.some((k) => k.includes(q)))     score = 20;
          else return null;

          return { opt, score };
        })
        .filter(Boolean)
        .sort((a, b) => b!.score - a!.score)
        .map((r) => r!.opt);
    }, [isSearching, search, options]);

    const popularOptions = useMemo(() => {
      if (!popularValues?.length) return [];
      return popularValues
        .map((v) => options.find((o) => o.value === v))
        .filter(Boolean) as ComboBoxOption[];
    }, [popularValues, options]);

    const remainingOptions = useMemo(() => {
      const popularSet = new Set(popularValues ?? []);
      return options.filter((o) => !popularSet.has(o.value));
    }, [options, popularValues]);

    const alphabetGroups = useMemo(
      () => (alphabetical ? groupByLetter(remainingOptions) : null),
      [alphabetical, remainingOptions],
    );

    const sortedLetters = useMemo(
      () => (alphabetGroups ? Object.keys(alphabetGroups).sort() : []),
      [alphabetGroups],
    );

    // ── Render option row ──────────────────────────────────────────────────
    const renderOption = (opt: ComboBoxOption) => (
      <CommandItem
        key={opt.value}
        value={opt.value} 
        onSelect={() => handleSelect(opt.value)}
        className={cn(
          "flex cursor-pointer text-sm items-center hover:bg-accent! data-[selected=true]:bg-accent! gap-3 rounded-md px-2 py-3",
          opt.value === value && "bg-card",
        )}
      >
        <IconWrapper icon={opt.icon} />
        {showOptionValue && opt.value !== opt.label ? (
          <>
            <span className="font-semibold text-foreground">{opt.value}</span>
            <span className="text-muted-foreground">{opt.label}</span>
          </>
        ) : (
          <span className="font-medium text-foreground">{opt.label}</span>
        )}
      </CommandItem>
    );

    return (
      <div ref={ref} className={cn("flex flex-col gap-2.5", className)} {...rest}>
        {label && <Label>{label}</Label>}

        <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "flex min-h-11 w-full items-center justify-between rounded-md border-2 border-border-input cursor-pointer px-2 font-medium transition-all duration-150",
                "bg-transparent ring-1 ring-transparent text-foreground",
                "focus-within:ring-2 focus-within:ring-blue-300",
                disabled && "cursor-not-allowed opacity-60 text-sm",
              )}
            >
              <span className="flex items-center mr-2 text-sm gap-2">
                {selected?.icon && <IconWrapper icon={selected.icon} />}
                {selected ? (
                  selected.label
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </span>
              {open ? (
                <ChevronUp size={16} className="text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground shrink-0" />
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent
            className={cn("p-5 rounded-lg drop-shadow-xl drop-shadow-black/5", popoverWidth)}
            align="start"
            style={{ width: "var(--radix-popover-trigger-width)" }}
            sideOffset={6}
          >
            <Command shouldFilter={false}>
              <div className="px-1 pb-4 py-1">
                <CommandInput
                  placeholder={searchPlaceholder}
                  className="h-10"
                  value={search}
                  onValueChange={setSearch}
                />
              </div>

              <CommandList
                ref={listRef}
                className="max-h-72 overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <CommandEmpty className="py-4 text-center text-muted-foreground">
                  {emptyText}
                </CommandEmpty>

                {/* ── Searching: scored + ranked flat list ── */}
                {isSearching && (
                  <CommandGroup>
                    {filteredOptions.map(renderOption)}
                  </CommandGroup>
                )}

                {/* ── Browsing: popular + alphabetical groups ── */}
                {!isSearching && (
                  <>
                    {popularOptions.length > 0 && (
                      <>
                        <CommandGroup
                          heading={
                            <span className="px-2 text-xs font-semibold tracking-wider text-muted-foreground">
                              {popularLabel}
                            </span>
                          }
                        >
                          {popularOptions.map(renderOption)}
                        </CommandGroup>
                        {/* {(alphabetGroups || remainingOptions.length > 0) && <CommandSeparator />} */}
                      </>
                    )}

                    {alphabetical && alphabetGroups
                      ? sortedLetters.map((letter) => (
                          <React.Fragment key={letter}>
                            <CommandGroup
                              heading={
                                <span className="px-2 text-xs font-semibold tracking-wider text-muted-foreground">
                                  {letter}
                                </span>
                              }
                            >
                              {(alphabetGroups[letter] ?? []).map(renderOption)}
                            </CommandGroup>
                            {/* {i < sortedLetters.length - 1 && <CommandSeparator />} */}
                          </React.Fragment>
                        ))
                      : remainingOptions.map(renderOption)}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

ComboBox.displayName = "ComboBox";

export default ComboBox;