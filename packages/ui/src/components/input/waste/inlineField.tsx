import { useRef, useState } from "react";
import { cn } from "@snappin/ui/lib/utils";
import { Label } from "../../label";
import { Input, InputWrapper } from "../../input";

interface InlineFieldProps {
  value: string | null | undefined;
  label?: string;
  prefix?: string;
  onChange: (value: string) => void;
  format?: (value: string) => string;
  placeholder?: string;
  displayName?: string;
  className?: string;
  inputClassName?: string;
}

export const InlineField = ({
  value,
  onChange,
  label,
  format,
  placeholder = "–",
  displayName,
  className,
  inputClassName,
}: InlineFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value ?? "");
  const originalValue = useRef(value ?? "");

  const handleEdit = () => {
    originalValue.current = value ?? "";
    setLocalValue(value ?? "");
    setEditing(true);
  };

  const handleCommit = () => {
    setEditing(false);
    if (localValue !== originalValue.current) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCommit();
    if (e.key === "Escape") {
      setLocalValue(originalValue.current);
      setEditing(false);
    }
  };

  const displayValue = value ? (format ? format(value) : value) : null;

  return (
    <div className={cn("group/inline-field flex flex-col gap-1", className)}>
      {label && (
        <Label className="text-sm text-muted-foreground">{label}</Label>
      )}

      {editing ? (
        <InputWrapper className="border-0 text-sm bg-accent/50 p-1 shadow-none ring-0 rounded-none h-fit">
          <Input
            autoFocus
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("overflow-hidden", inputClassName)}
          />
        </InputWrapper>
      ) : (
        <span
          onClick={handleEdit}
          className={cn(
            "leading-snug p-1 text-sm cursor-pointer hover:bg-accent",
            displayValue ? "text-foreground" : "text-muted-foreground/50",
          )}
        >
          {displayName ?? displayValue ?? placeholder}
        </span>
      )}
    </div>
  );
};