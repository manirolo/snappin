import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@snappin/ui/lib/utils";
import { Label } from "../../label";
import { DateInput } from "../components/dateInput";

interface InlineDateFieldProps {
  value: string | null | undefined; // ISO string
  label?: string;
  onSave: (isoString: string) => void;
  format?: (isoString: string) => string;
  placeholder?: string;
  className?: string;
}

const defaultFormat = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const InlineDateField = ({
  value,
  label,
  onSave,
  format,
  placeholder = "–",
  className,
}: InlineDateFieldProps) => {
  const [editing, setEditing] = useState(false);
  const originalValue = useRef(value ?? "");

  const handleEdit = () => {
    originalValue.current = value ?? "";
    setEditing(true);
  };

  const handleChange = (isoString: string) => {
    if (isoString !== originalValue.current) {
      onSave(isoString);
    }
  };

  // When the popover/input loses focus entirely, exit edit mode
  const handleBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setEditing(false);
    }
  };

  const displayValue = value
    ? (format ? format(value) : defaultFormat(value))
    : null;

  return (
    <div className={cn("group/inline-field flex flex-col gap-2", className)}>
      {label && <Label>{label}</Label>}

      {editing ? (
        <div onBlurCapture={handleBlurCapture}>
          <DateInput
            value={value}
            onChange={handleChange}
          />
        </div>
      ) : (
        <div
          onClick={handleEdit}
          className="flex gap-2 cursor-pointer items-center text-sm"
        >
          <span className={cn(!displayValue && "text-muted-foreground/50")}>
            {displayValue ?? placeholder}
          </span>
          <Pencil className="size-3 shrink-0 opacity-0 text-muted-foreground transition-opacity group-hover/inline-field:opacity-60" />
        </div>
      )}
    </div>
  );
};

export default InlineDateField;