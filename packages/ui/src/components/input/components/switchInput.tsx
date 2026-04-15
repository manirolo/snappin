"use client";

import React, { HTMLAttributes, useState } from "react";
import { Label } from "../../label";
import { cn } from "../../../lib/utils";

// ─── Raw Switch primitive ────────────────────────────────────────────────────

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const trackSize = {
  sm: { track: "h-4 w-7",   thumb: "h-3 w-3",     translate: "translate-x-[14px]" },
  md: { track: "h-6 w-10",   thumb: "h-3.5 w-3.5",  translate: "translate-x-[18px]" },
  lg: { track: "h-7 w-12",  thumb: "h-5 w-5",      translate: "translate-x-[20px]" },
};

const CustomSwitch = ({ checked, onCheckedChange, disabled, size = "md", className }: SwitchProps) => {
  const s = trackSize[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        // track
        "relative inline-flex shrink-0 items-center rounded-full p-1",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
        s.track,
        checked ? "bg-primary" : "bg-gray-4",
        className,
      )}
    >
      <span
        className={cn(
          // thumb
          "inline-block rounded-full bg-white shadow-xs",
          "transition-transform duration-200 ease-in-out",
          s.thumb,
          checked ? s.translate : "translate-x-0",
        )}
      />
    </button>
  );
};

// ─── SwitchInput wrapper ─────────────────────────────────────────────────────

interface SwitchInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (checked: boolean) => void;
}

export const SwitchInput = React.forwardRef<HTMLDivElement, SwitchInputProps>(
  (
    {
      label,
      description,
      checked: controlledChecked,
      defaultChecked = false,
      disabled,
      size = "md",
      onChange,
      className,
      ...rest
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const checked = controlledChecked ?? internalChecked;

    const handleChange = (val: boolean) => {
      setInternalChecked(val);
      onChange?.(val);
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between gap-4", className)}
        {...rest}
      >
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && <Label>{label}</Label>}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <CustomSwitch
          checked={checked}
          onCheckedChange={handleChange}
          disabled={disabled}
          size={size}
        />
      </div>
    );
  },
);

SwitchInput.displayName = "SwitchInput";
export default SwitchInput;