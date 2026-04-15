"use client";

import React, { HTMLAttributes, useMemo } from "react";
import type { ComboBoxOption } from "@snappin/ui/components/input/components/comboboxInput";
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";
import { ComboBox } from "@snappin/ui/components/input/components/comboboxInput";

// ── Types ──────────────────────────────────────────────────────────────────

export interface VendorOption {
  /** MongoDB ObjectId or any unique ID */
  value: string;
  /** Display name e.g. "Spotify India LLP" */
  label: string;
  /** Optional website domain e.g. "spotify.com" — used to fetch logo */
  domain?: string | null;
}

interface VendorComboBoxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: VendorOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  popoverWidth?: string;
  /** Recently used vendor IDs to pin at top */
  recentValues?: string[];
  recentLabel?: string;
}

// ── Map VendorOption → ComboBoxOption ──────────────────────────────────────

function toComboBoxOption(vendor: VendorOption): ComboBoxOption {
  return {
    value: vendor.value,
    label: vendor.label,
    icon: getLogoByDomain(vendor?.domain ?? vendor.label, "size-5"),
    keywords: vendor.domain ? [vendor.domain] : [],
  };
}

// ── Component ──────────────────────────────────────────────────────────────

export const VendorComboBox = React.forwardRef<
  HTMLDivElement,
  VendorComboBoxProps
>(
  (
    {
      label = "Supplier",
      placeholder = "Select supplier...",
      searchPlaceholder = "Search supplier...",
      options,
      value,
      defaultValue,
      disabled,
      recentLabel = "RECENT",
      className,
      ...rest
    },
    ref,
  ) => {
    const comboOptions = useMemo(
      () => options.map(toComboBoxOption),
      [options],
    );

    return (
      <ComboBox
        label={label}
        ref={ref}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        options={comboOptions}
        value={defaultValue ?? value}
        onChange={() => {}}
        disabled={disabled}
        popoverWidth="min-w-xs w-fit"
        popularLabel={recentLabel}
        showOptionValue={false}
        alphabetical={false}
        className={className}
        {...rest}
      />
    );
  },
);

VendorComboBox.displayName = "VendorComboBox";

export default VendorComboBox;
