"use client";

import React, { HTMLAttributes, useState, useRef, useEffect } from "react";
import { Label } from "../../label";
import { Calendar } from "../../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { cn } from "../../../lib/utils";
import { CalendarIcon } from "lucide-react";
import { Input, InputWrapper } from "../../input";

type InputState = "idle" | "focus" | "calendar";

interface DateInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  label?: string;
  /** ISO timestamp string e.g. "2026-01-10T00:00:00Z" */
  value?: string | null;
  placeholder?: string;
  state?: InputState; // manual override
  onChange?: (isoString: string) => void;
}

/** "10 Jan 2026" */
const formatDisplay = (date: Date): string =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/** "10/01/2026" — DD/MM/YYYY for editing */
const formatEditing = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/** Parse DD/MM/YYYY → Date | null */
const parseEditing = (str: string): Date | null => {
  const [dd, mm, yyyy] = str.split("/");
  if (!dd || !mm || !yyyy || yyyy.length < 4) return null;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return isNaN(d.getTime()) ? null : d;
};

const isoToDate = (iso?: string | null): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

const wrapperStateClass: Record<InputState, string> = {
  idle: "bg-transparent border-2 border-border focus-within:border",
  focus:
    "has-[:focus-visible]:border-2 has-[:focus-visible]:border-blue-300 bg-transparent",
  calendar: "border-blue-300 border-2 bg-transparent",
};

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      label,
      value,
      placeholder = "DD/MM/YYYY",
      state: externalState,
      onChange,
      className,
      ...rest
    },
    ref,
  ) => {
    const [internalState, setInternalState] = useState<InputState>("idle");
    const [editText, setEditText] = useState<string>("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const state: InputState = externalState ?? internalState;
    const selectedDate = isoToDate(value);

    // Sync calendar open ↔ state
    useEffect(() => {
      if (calendarOpen) setInternalState("calendar");
      else if (internalState === "calendar") setInternalState("idle");
    }, [calendarOpen, internalState]);

    // ── Input handlers ───────────────────────────────────────────────────

    const handleFocus = () => {
      setInternalState("focus");
      setEditText(selectedDate ? formatEditing(selectedDate) : "");
    };

    const handleBlur = () => {
      if (editText) {
        const parsed = parseEditing(editText);
        if (parsed) {
          // Compare by date parts, not ISO string (avoids timezone mismatch)
          const isSameDate =
            selectedDate &&
            parsed.getFullYear() === selectedDate.getFullYear() &&
            parsed.getMonth() === selectedDate.getMonth() &&
            parsed.getDate() === selectedDate.getDate();

          if (!isSameDate) {
            onChange?.(parsed.toISOString());
          }
        }
      }
      setEditText("");
      if (internalState !== "calendar") setInternalState("idle");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/[^\d/]/g, "");

      // Auto-insert slashes: "10" → "10/", "10/01" → "10/01/"
      if (raw.length === 2 && !raw.includes("/")) raw += "/";
      if (raw.length === 5 && raw.split("/").length === 2) raw += "/";

      setEditText(raw);

      if (raw.length === 10) {
        const parsed = parseEditing(raw);
        if (parsed) onChange?.(parsed.toISOString());
      }
    };

    // ── Calendar handler ─────────────────────────────────────────────────

    const handleCalendarSelect = (date: Date | undefined) => {
      if (!date) return;
      onChange?.(date.toISOString());
      setCalendarOpen(false);
      setInternalState("idle");
    };

    // ── Display value ────────────────────────────────────────────────────

    const isEditing = state === "focus";
    const displayValue = isEditing
      ? editText
      : selectedDate
        ? formatDisplay(selectedDate)
        : "";

    return (
      <div ref={ref} className={cn("flex flex-col gap-2.5", className)} {...rest}>
        {label && <Label>{label}</Label>}

        <InputWrapper
          className={cn(
            "min-h-11 border border-bg-4 text-sm",
            wrapperStateClass[state],
          )}
        >
          {/* Text input */}
          <Input
            ref={inputRef}
            value={displayValue}
            placeholder={placeholder}
            maxLength={10}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
          />

          {/* Calendar icon trigger */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "ml-2 flex shrink-0 cursor-pointer items-center rounded p-0.5 transition-colors",
                  calendarOpen
                    ? "text-blue-500"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <CalendarIcon size={16} strokeWidth={1.75} />
              </button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0"
              align="center"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={handleCalendarSelect}
                initialFocus
                weekStartsOn={1}
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export default DateInput;
