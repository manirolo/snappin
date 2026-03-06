import { useRef, useState } from "react";
import { cn } from "@snappin/ui/lib/utils";
import { Label } from "../../label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../select";

interface Option {
    value: string;
    label: string;
}

interface InlineSelectFieldProps {
    value: string | null | undefined;
    label?: string;
    options: Option[];
    onSave: (value: string) => void;
    format?: (value: string, options: Option[]) => string;
    placeholder?: string;
    className?: string;
}

const defaultFormat = (value: string, options: Option[]) =>
    options.find((o) => o.value === value)?.label ?? value;

export const InlineSelectField = ({
    value,
    label,
    options,
    onSave,
    format,
    placeholder = "–",
    className,
}: InlineSelectFieldProps) => {
    const [open, setOpen] = useState(false);
    const originalValue = useRef(value ?? "");

    const handleEdit = () => {
        originalValue.current = value ?? "";
        setOpen(true);
    };

    const handleValueChange = (newValue: string) => {
        setOpen(false);
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
        <div className={cn("group/inline-field flex flex-col gap-1", className)}>
            {label && (
                <Label className="text-xs text-muted-foreground">{label}</Label>
            )}

            <Select
                value={value ?? ""}
                onValueChange={handleValueChange}
                open={open}
                onOpenChange={setOpen}
            >
                {/* ✅ Real visible trigger styled as plain text — no box, no border */}
                <SelectTrigger
                    onClick={handleEdit}
                    className={cn(
                        "border-0 shadow-none bg-transparent ring-0 outline-none px-1 h-4 py-0 w-auto",
                        "text-sm hover:bg-accent cursor-pointer leading-snug font-normal justify-start gap-0",
                        "[&>svg]:hidden", // hide the chevron icon
                        open && "bg-accent/50",
                        displayValue ? "text-foreground" : "text-muted-foreground/50",
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent position="popper">
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default InlineSelectField;