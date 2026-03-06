import { useRef, useState } from "react";
import { cn } from "@snappin/ui/lib/utils";
import { Label } from "../../label";
import { Input, InputWrapper } from "../../input";
import { formatMinorAmount, parseToMinorAmount } from "@snappin/lib/amount/formatMinorAmount";

interface InlineAmountFieldProps {
  value: number | null | undefined;
  label?: string;
  prefix?: string;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const InlineAmountField = ({
  value,
  label,
  prefix = "",
  onChange,
  placeholder = "–",
  className,
  inputClassName,
}: InlineAmountFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(() => value != null ? formatMinorAmount(value) : "");
  const originalMinor = useRef(value ?? null);

  const handleEdit = () => {
    originalMinor.current = value ?? null;
    setLocalValue(value != null ? formatMinorAmount(value) : "");
    setEditing(true);
  };

  const handleCommit = () => {
    setEditing(false);
    const next = localValue.trim() === "" ? null : parseToMinorAmount(localValue);
    if (next !== originalMinor.current) {
      onChange(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCommit();
    if (e.key === "Escape") {
      setLocalValue(originalMinor.current != null ? formatMinorAmount(originalMinor.current) : "");
      setEditing(false);
    }
  };

  const displayValue = value != null ? `${prefix}${formatMinorAmount(value)}` : null;

  return (
    <div className={cn("group/inline-amount-field flex flex-col gap-1", className)}>
      {label && (
        <Label className="text-xs text-muted-foreground">{label}</Label>
      )}

      {editing ? (
        <InputWrapper className="border-0 text-sm bg-accent/50 p-1 shadow-none ring-0 rounded-none h-auto">
          <Input
            autoFocus
            inputMode="decimal"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("text-sm text-right", inputClassName)}
          />
        </InputWrapper>
      ) : (
        <span
          onClick={handleEdit}
          className={cn(
            "text-sm leading-snug p-1 cursor-pointer hover:bg-accent",
            displayValue ? "text-foreground" : "text-muted-foreground/50",
          )}
        >
          {displayValue ?? placeholder}
        </span>
      )}
    </div>
  );
};