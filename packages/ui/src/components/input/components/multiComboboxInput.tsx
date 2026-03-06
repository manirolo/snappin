"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Label } from "../../label";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../command";
import { cn } from "../../../lib/utils";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "../../button";

export interface MultiComboBoxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  keywords?: string[];
}

export interface MultiComboBoxProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: MultiComboBoxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MultiComboBox = React.forwardRef<
  HTMLDivElement,
  MultiComboBoxProps
>(
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
      defaultOpen,
      disabled = false,
      className,
    },
    ref,
  ) => {
    const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(defaultOpen ?? false);
    const listRef = useRef<HTMLDivElement>(null);

    const value = controlledValue ?? internal;
    const isSearching = search.trim().length > 0;
    const selectedOptions = options.filter((o) => value.includes(o.value));

    useEffect(() => {
      if (listRef.current) listRef.current.scrollTop = 0;
    }, [search]);

    const handleOpenChange = (next: boolean) => {
      if (disabled) return;
      if (!next) setSearch("");
      setOpen(next);
    };

    const toggle = (val: string) => {
      const next = value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val];
      setInternal(next);
      onChange?.(next);
    };

    const removeOne = (val: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const next = value.filter((v) => v !== val);
      setInternal(next);
      onChange?.(next);
    };

    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      setInternal([]);
      onChange?.([]);
    };

    // ── Scored search ──────────────────────────────────────────────────────
    const filteredOptions = useMemo(() => {
      if (!isSearching) return options;
      const q = search.trim().toLowerCase();
      return options
        .map((opt) => {
          const v = opt.value.toLowerCase();
          const l = opt.label.toLowerCase();
          const kw = opt.keywords?.map((k) => k.toLowerCase()) ?? [];
          let score = 0;
          if (v === q) score = 100;
          else if (v.startsWith(q)) score = 90;
          else if (l === q) score = 80;
          else if (l.startsWith(q)) score = 70;
          else if (kw.some((k) => k === q)) score = 60;
          else if (kw.some((k) => k.startsWith(q))) score = 50;
          else if (v.includes(q) || l.includes(q)) score = 30;
          else if (kw.some((k) => k.includes(q))) score = 20;
          else return null;
          return { opt, score };
        })
        .filter(Boolean)
        .sort((a, b) => b!.score - a!.score)
        .map((r) => r!.opt);
    }, [isSearching, search, options]);

    // ── Option row ─────────────────────────────────────────────────────────
    const renderOption = (opt: MultiComboBoxOption) => {
      const selected = value.includes(opt.value);
      return (
        <CommandItem
          key={opt.value}
          value={opt.value}
          onSelect={() => toggle(opt.value)}
          className="flex items-center gap-2.5 py-1.5 px-2 cursor-pointer rounded-md"
        >
          <div
            className={cn(
              "size-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
              selected
                ? "bg-foreground border-foreground"
                : "border-muted-foreground/40",
            )}
          >
            {selected && (
              <Icon icon="lucide:check" className="size-2.5 text-background" />
            )}
          </div>
          <span className="flex-1 text-sm font-medium text-foreground">
            {opt.label}
          </span>
        </CommandItem>
      );
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2.5", className)}>
        {label && <Label>{label}</Label>}

        <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant={"outline"}
              className={cn(
                "h-8 font-medium hover:bg-transparent shadow-[0px_2px_0px_var(--color-slate-100)]",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <div className="flex justify-between w-full">
                {/* Chips / placeholder */}
                <div className="flex flex-1 flex-wrap gap-1.5 py-1.5 min-w-0">
                  {value.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      {placeholder}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-foreground">
                      {value.length} selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  {value.length > 0 && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={clearAll}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          clearAll(e as unknown as React.MouseEvent);
                        }
                      }}
                      className="rounded-full p-0.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={13} />
                    </div>
                  )}
                  {open ? (
                    <ChevronUp size={16} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={6}
            style={{ width: "var(--radix-popover-trigger-width" }}
            className="p-0 rounded-lg shadow-md drop-shadow-xl border border-border overflow-hidden"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-9 border-none"
                inputClassName="border-0 has-[:focus-visible]:ring-0 h-10 rounded-none"
                value={search}
                onValueChange={setSearch}
              />
              <CommandList
                ref={listRef}
                className="max-h-60 overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <CommandEmpty className="py-1 text-center text-sm text-muted-foreground">
                  {emptyText}
                </CommandEmpty>

                {isSearching ? (
                  <CommandGroup>
                    {filteredOptions.map(renderOption)}
                  </CommandGroup>
                ) : (
                  <CommandGroup>{options.map(renderOption)}</CommandGroup>
                )}
              </CommandList>

              {/* Footer */}
              {value.length > 0 && (
                <div className="border-t border-border px-3 py-2.5 flex items-center justify-between">
                  <span className="text-[13px] tracking-wide text-muted-foreground">
                    {value.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[13px] cursor-pointer tracking-wide text-destructive hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

MultiComboBox.displayName = "MultiComboBox";
export default MultiComboBox;
