"use client";

import React, { useState, useMemo, useRef } from "react";
import { Label } from "@snappin/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@snappin/ui/components/select";
import { cn } from "@snappin/ui/lib/utils";
import { HiX } from "react-icons/hi";
import type {
  DateFormatId,
  FileFormatComponent,
  InvoiceFileFormatPreference,
} from "@snappin/shared/organization/preference/invoiceFileFormatPreference.schema";
import { MONTHS_SHORT, MONTHS_LONG } from "@snappin/shared/date";

import { DATE_FORMAT_IDS } from "@snappin/shared/organization/preference/invoiceFileFormatPreference.schema";

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPONENT_LABELS: Record<FileFormatComponent, string> = {
  date: "DATE",
  vendor: "MERCHANT",
  invoiceId: "ID",
  amount: "AMOUNT",
  currency: "CURRENCY",
};

const DATE_FORMAT_EXAMPLES: Record<string, string> = {
  DD_MM_YYYY: "15_01_2024",
  MM_DD_YYYY: "01_15_2024",
  YYYY_MM_DD: "2024_01_15",
  DD_MM_YY: "15_01_24",
  MM_DD_YY: "01_15_24",
  YY_MM_DD: "24_01_15",
};

const AVAILABLE_COMPONENTS: FileFormatComponent[] = [
  "date",
  "vendor",
  "invoiceId",
  "amount",
  "currency",
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildPreview(pref: InvoiceFileFormatPreference): string {
  const sep = pref.separator;
  const parts = (pref.components ?? []).map((c) => {
    if (c === "date") {
      const example = DATE_FORMAT_EXAMPLES[pref.dateFormat] ?? "2024_01_15";
      return pref.uppercase ? example.toUpperCase() : example;
    }
    const label = COMPONENT_LABELS[c];
    return pref.uppercase ? label : label?.toLowerCase();
  });
  return parts.join(sep);
}

// ─── Ordered chip (selected, draggable, with arrows) ─────────────────────────

interface OrderedChipProps {
  component: FileFormatComponent;
  index: number;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  isDraggingOver: boolean;
}

const OrderedChip: React.FC<OrderedChipProps> = ({
  component,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver,
}) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, index)}
    onDragOver={(e) => onDragOver(e, index)}
    onDrop={(e) => onDrop(e, index)}
    className={cn(
      "flex items-center rounded-md border bg-foreground text-background border-foreground transition-all cursor-grab active:cursor-grabbing select-none",
      isDraggingOver && "opacity-50 scale-95",
    )}
  >
    <span className="px-2 py-1 text-xs font-medium leading-none">
      {COMPONENT_LABELS[component]}
    </span>

    <button
      type="button"
      onClick={onRemove}
      className="pr-1.5 hover:bg-white/10 rounded-r-md transition-colors"
      aria-label="Remove"
    >
      <HiX className="w-2 h-2" />
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface InvoiceFileNameFormatInputProps {
  value?: InvoiceFileFormatPreference;
  onChange?: (value: InvoiceFileFormatPreference) => void;
}

const DEFAULT_VALUE: InvoiceFileFormatPreference = {
  components: ["date", "vendor", "amount"],
  separator: "_",
  dateFormat: "YYYY_MM_DD",
  uppercase: false,
};

function formatDateExample(id: DateFormatId): string {
  const d = "15";
  const m2 = "05";
  const ms = MONTHS_SHORT[4];   // "May"
  const ml = MONTHS_LONG[4];    // "May" (full)
  const yyyy = "2025";

  const example: Record<DateFormatId, string> = {
    DD_MMM_YYYY:      `${d}_${ms}_${yyyy}`,
    DD_MMMM_YYYY:     `${d}_${ml}_${yyyy}`,
    MMM_DD_YYYY:      `${ms}_${d}_${yyyy}`,
    MMMM_DD_YYYY:     `${ml}_${d}_${yyyy}`,
    YYYY_MMM_DD:      `${yyyy}_${ms}_${d}`,
    YYYY_MMMM_DD:     `${yyyy}_${ml}_${d}`,
    DD_MM_YYYY:       `${d}_${m2}_${yyyy}`,
    MM_DD_YYYY:       `${m2}_${d}_${yyyy}`,
    YYYY_MM_DD:       `${yyyy}_${m2}_${d}`,
    YYYY_MM_DD_SLASH: `${yyyy}/${m2}/${d}`,
    YYYYMMDD:         `${yyyy}${m2}${d}`,
    DDMMYYYY:         `${d}${m2}${yyyy}`,
  };

  return `${id} (${example[id]})`;
}

export const FileNameFormatInput: React.FC<InvoiceFileNameFormatInputProps> = ({
  value,
  onChange,
}) => {
  const [internal, setInternal] = useState<InvoiceFileFormatPreference>(
    value ?? DEFAULT_VALUE,
  );
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const pref = value ?? internal;
  const components = pref?.components ?? [];

  const update = (partial: Partial<InvoiceFileFormatPreference>) => {
    const next = { ...pref, ...partial };
    setInternal(next);
    onChange?.(next);
  };

  const moveComponent = (from: number, to: number) => {
    const next = [...components];
    const [item] = next.splice(from, 1) as FileFormatComponent[];
    next.splice(to, 0, item!);
    update({ components: next });
  };

  const removeComponent = (index: number) => {
    update({
      components: components.filter(
        (_c, i) => i !== index,
      ) as FileFormatComponent[],
    });
  };

  const addComponent = (c: FileFormatComponent) => {
    update({ components: [...components, c] });
  };

  const handleDragStart = (_e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (_e: React.DragEvent, index: number) => {
    if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
      moveComponent(dragIndexRef.current, index);
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const unselected = AVAILABLE_COMPONENTS.filter(
    (c) => !components.includes(c),
  );

  const preview = useMemo(() => buildPreview(pref), [pref]);

  return (
    <div className="flex flex-col border-b pb-4 py-2 gap-6 w-full">
      {/* Preview */}
      <div className="flex justify-between items-center">
        <Label>Preview</Label>
        <p className="text-sm">{preview}.pdf</p>
      </div>

      {/* Include fields */}
      <div className="flex justify-between gap-1.5">
        <div className="flex flex-wrap sm:flex-row md:gap-1.5  w-full justify-between gap-3">
          <Label className="text-muted-foreground">Include fields</Label>

          <div className="flex gap-1.5 items-center">
            {/* Selected: ordered, draggable chips with arrows */}
            {components.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {components.map((c, i) => (
                  <OrderedChip
                    key={c}
                    component={c}
                    index={i}
                    onRemove={() => removeComponent(i)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDraggingOver={dragOverIndex === i}
                  />
                ))}
              </div>
            )}

            {/* Unselected palette: dashed chips to add */}
            {unselected.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {unselected.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => addComponent(c)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium border border-dashed border-input text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
                  >
                    + {COMPONENT_LABELS[c]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Separator + Date format */}
      <div className="flex justify-between items-center">
        <Label>Date format</Label>
        <Select
          value={pref.dateFormat}
          onValueChange={(v) => update({ dateFormat: v as DateFormatId })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_FORMAT_IDS.map((id) => (
              <SelectItem key={id} value={id}>
                {formatDateExample(id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
