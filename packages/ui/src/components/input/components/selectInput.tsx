"use client";

import React, { HTMLAttributes } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";
import { Label } from "../../label";
import { cn } from "../../../lib/utils";
import { Small } from "../../typography";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  label?: string;
  options?: Option[];
  value?: string;
  defaultValue?: string;
  open?: boolean;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export const SelectInput = React.forwardRef<HTMLDivElement, SelectInputProps>(
  (
    {
      label,
      options,
      value,
      defaultValue,
      onValueChange,
      onOpenChange,
      className,
      open,
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-2.5", className)} {...rest}>
        {label && <Label>{label}</Label>}

        <div className="relative">
          <Select
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            onOpenChange={onOpenChange}
            open={open}
          >
            {/* Trigger */}
            <SelectTrigger
              className={cn(
                "w-full min-w-40 bg-transparent shadow-none has-focus-visible:border-blue-300 border-2 border-bg-4 transition-all rounded-md min-h-11 duration-150",
                // Hide the default shadcn chevron when we render our own indicator
                // state !== 'idle' && '[&>svg]:hidden'
              )}
            >
              <SelectValue />
            </SelectTrigger>

            {/* Dropdown */}
            <SelectContent
              align="start"
              style={{ width: "var(--radix-select-trigger-width)" }}
              position="popper"
              className="px-0 py-0 drop-shadow-xl drop-shadow-gray-200"
              sideOffset={2}
            >
              <SelectGroup className="px-0">
                {options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <Small className="text-sm! font-medium text-foreground">
                      {opt.label}
                    </Small>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
