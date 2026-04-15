"use client";

import React, { HTMLAttributes, InputHTMLAttributes, useState } from "react";
import { Label } from "../label";
import { cn } from "../../lib/utils";
import { Input, InputWrapper } from "../input";
import { Small } from "../typography";
import { parseToMinorAmount, formatMinorAmount } from "@snappin/lib/amount/formatMinorAmount";

interface TextInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  placeholder?: string;
  value?: number; // minor units (e.g. 1400 = 14.00)
  disable?: boolean;
  onChange?: (value: number) => void; // returns minor units
  prefix?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue">;
}

/** Always renders with 2 decimal places for editing clarity e.g. 1400 → "14.00" */
const toEditString = (minor: number | undefined): string => {
  if (minor == null) return "";
  return (minor / 100).toFixed(2);
};

export const AmountInput = React.forwardRef<HTMLDivElement, TextInputProps>(
  ({ label, placeholder, value, onChange, disable, inputProps, className, prefix, ...rest }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>(() => toEditString(value));
    const [isFocused, setIsFocused] = useState(false);

    // When not focused, always reflect the external value formatted nicely
    const resolvedDisplay = isFocused ? displayValue : formatMinorAmount(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Allow digits, optional single decimal point, up to 2 decimal places
      if (!/^\d*\.?\d{0,2}$/.test(raw)) return;
      setDisplayValue(raw);
      onChange?.(parseToMinorAmount(raw));
    };

    const handleFocus = () => {
      // Show the editable decimal string, not the formatted display string
      setDisplayValue(toEditString(value));
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      const minor = parseToMinorAmount(displayValue);
      // Reformat on blur: "14" → "14.00"
      setDisplayValue(toEditString(minor));
      if (minor !== value) {
        onChange?.(minor);
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2 mx-0.5", className)} {...rest}>
        {label && <Label>{label}</Label>}
        <InputWrapper className="min-h-11 gap-0.5 w-full focus-visible:outline-0 has-focus-visible:border-blue-300 has-focus-visible:ring has-focus-visible:ring-blue-300">
          {prefix && <Small className="text-foreground">{prefix}</Small>}
          <Input
            {...inputProps}
            inputMode="decimal"
            value={resolvedDisplay}
            placeholder={placeholder ?? "0.00"}
            disabled={disable}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="text-sm font-medium"
          />
        </InputWrapper>
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";
export default AmountInput;