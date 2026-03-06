import React, { HTMLAttributes, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@snappin/ui/lib/utils";
import { Label } from "../../label";
import { ComboBox, type ComboBoxOption } from "../components/comboboxInput";

interface InlineComboFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value: string | null | undefined;
  label?: string;
  options: ComboBoxOption[];
  onSave: (value: string) => void;
  format?: (value: string, options: ComboBoxOption[]) => string;
  placeholder?: string;
  popularValues?: string[];
  popularLabel?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  showOptionValue?: boolean;
  className?: string;
}

const defaultFormat = (value: string, options: ComboBoxOption[]) =>
  options.find((o) => o.value === value)?.label ?? value;

export const InlineComboField = React.forwardRef<
  HTMLDivElement,
  InlineComboFieldProps
>(
  (
    {
      value,
      label,
      options,
      onSave,
      format,
      placeholder = "–",
      popularValues,
      disabled,
      popularLabel,
      searchPlaceholder,
      showOptionValue,
      className,
    },
    ref,
  ) => {
    const [editing, setEditing] = useState(false);
    const originalValue = useRef(value ?? "");

    const handleEdit = () => {
      originalValue.current = value ?? "";
      setEditing(true);
    };

    const handleChange = (newValue: string) => {
      setEditing(false);
      if (newValue !== originalValue.current) {
        onSave(newValue);
      }
    };

    const displayValue = value
      ? format
        ? format(value, options)
        : defaultFormat(value, options)
      : null;

    return (
      <div className={cn("group/inline-field flex flex-col gap-2", className)}>
        {label && <Label>{label}</Label>}

        {editing ? (
          <ComboBox
            ref={ref}
            value={value ?? ""}
            options={options}
            onChange={handleChange}
            disabled={disabled}
            popularValues={popularValues}
            popularLabel={popularLabel}
            searchPlaceholder={searchPlaceholder}
            showOptionValue={showOptionValue}
            // open the popover immediately
            defaultOpen
          />
        ) : (
          <div
            onClick={handleEdit}
            className="flex gap-2 cursor-pointer items-center"
          >
            <span className={cn(!displayValue && "text-muted-foreground/50")}>
              {displayValue ?? placeholder}
            </span>
            <Pencil className="size-3 shrink-0 opacity-0 text-muted-foreground transition-opacity group-hover/inline-field:opacity-60" />
          </div>
        )}
      </div>
    );
  },
);

InlineComboField.displayName = "InlineComboBox";

export default InlineComboField;
