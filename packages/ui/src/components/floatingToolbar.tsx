"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@snappin/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import { Button } from "./button";
import { Spinner } from "../assets/svg/spinner";

export type FloatingToolbarAction = {
  key: string;
  label?: string;
  icon?: string;
  onClick?: () => void;
  overflow?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  trigger?: React.ReactNode;
  submenu?: {
    key: string;
    label: string;
    icon: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
};

type FloatingTableToolbarProps = {
  /** Number of selected rows */
  selectedCount: number;
  /** All action definitions */
  actions: FloatingToolbarAction[];
  /** Called when the user clicks "Clear selection" × */
  onClear: () => void;
  /** Label for the noun e.g. "document", "expense" — pluralised automatically */
  noun?: string;
};

export function FloatingTableToolbar({
  selectedCount,
  actions,
  onClear,
  noun = "item",
}: FloatingTableToolbarProps) {
  // ✅ Fix: Radix DropdownMenu initialises internal state synchronously on
  // first render, which triggers the "state update on unmounted component"
  // warning in Next.js. Defer the entire toolbar until after client mount.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const visible = selectedCount > 0;
  const barRef = useRef<HTMLDivElement>(null);

  const inlineActions = actions.filter((a) => !a.overflow);
  const overflowActions = actions.filter((a) => a.overflow);

  const pluralNoun = selectedCount === 1 ? noun : `${noun}s`;
  const anyLoading = actions.some((a) => a.loading);

  useEffect(() => {
    if (visible) barRef.current?.focus();
  }, [visible]);

  // Don't render anything server-side or before hydration
  if (!hasMounted) return null;

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed bottom-10 left-1/2 -translate-x-1/2 z-50",
        "transition-all duration-300 ease-out",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none",
      )}
    >
      <div
        ref={barRef}
        tabIndex={-1}
        className={cn(
          "flex items-center gap-1 px-3 py-4 rounded-2xl",
          "bg-background text-foreground",
          "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.28),0_2px_8px_-2px_rgba(0,0,0,0.16)]",
          "border border-border",
          "whitespace-nowrap",
        )}
      >
        {/* ── Count badge ── */}
        <div className="flex items-center gap-2 pl-2 pr-7 border-r border-border mr-6">
          <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold leading-none tabular-nums">
            {selectedCount}
          </span>
          <span className="font-medium text-foreground/80">
            {pluralNoun} selected
          </span>
        </div>

        {/* ── Inline action buttons ── */}
        {inlineActions.map((action) => {
          const isDisabled = action.disabled || action.loading;

          if (action.trigger && !action.submenu) {
            return <div key={action.key}>{action.trigger}</div>;
          }

          // ── Submenu variant ──
          if (action.submenu) {
            return (
              <DropdownMenu key={action.key}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="md"
                    disabled={isDisabled}
                    className={cn(
                      "mx-1 gap-2 min-w-0",
                      action.loading && "opacity-75 cursor-not-allowed",
                    )}
                  >
                    {action.loading ? (
                      <Spinner className="size-4 shrink-0" />
                    ) : (
                      <div>
                        {action.icon && (
                          <Icon
                            icon={action.icon}
                            className="size-4 shrink-0"
                          />
                        )}
                      </div>
                    )}
                    <span>{action.label}</span>
                    <Icon
                      icon="lucide:chevron-up"
                      className="size-3.5 shrink-0 opacity-60"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  side="top"
                  sideOffset={8}
                  className="min-w-44 rounded-xl"
                >
                  {action.submenu.map((sub) => (
                    <DropdownMenuItem
                      key={sub.key}
                      onClick={sub.onClick}
                      disabled={sub.disabled}
                      className="flex items-center gap-2 rounded-lg cursor-pointer"
                    >
                      <Icon
                        icon={sub.icon}
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      <span className="flex-1">{sub.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          // ── Default button variant (existing code unchanged) ──
          return (
            <Button
              key={action.key}
              onClick={action.onClick}
              disabled={isDisabled}
              variant="ghost"
              size="md"
              className={cn(
                "mx-1 gap-2 min-w-0",
                action.destructive &&
                  "text-destructive hover:text-destructive disabled:text-destructive! hover:bg-destructive/10",
                action.loading && "opacity-75 cursor-not-allowed",
              )}
            >
              {action.loading ? (
                <Spinner className="size-4 shrink-0 text-destructive opacity-75" />
              ) : (
                <div>
                  {action.icon && (
                    <Icon icon={action.icon} className="size-4 shrink-0" />
                  )}
                </div>
              )}
              <span>
                {action.label}
                {action.loading && <span className="opacity-50">…</span>}
              </span>
            </Button>
          );
        })}

        {/* ── Overflow menu ── */}
        {overflowActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "inline-flex items-center justify-center size-8 rounded-xl",
                  "text-foreground/70 hover:bg-accent hover:text-foreground",
                  "transition-colors duration-100",
                )}
              >
                <Icon icon="lucide:ellipsis" className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="min-w-44 rounded-xl"
            >
              {overflowActions.map((action) => {
                const isDisabled = action.disabled || action.loading;
                return (
                  <DropdownMenuItem
                    key={action.key}
                    onClick={action.onClick}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center gap-2 rounded-lg cursor-pointer",
                      action.destructive &&
                        "text-destructive focus:text-destructive focus:bg-destructive/10",
                      isDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {action.loading ? (
                      <Spinner className="size-4 shrink-0" />
                    ) : (
                      <div>
                        {action.icon && (
                          <Icon
                            icon={action.icon}
                            className="size-4 shrink-0"
                          />
                        )}
                      </div>
                    )}
                    <span className="flex-1">{action.label}</span>
                    {action.loading && (
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md ml-2">
                        Loading
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ── Divider ── */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* ── Clear ── */}
        <button
          onClick={onClear}
          disabled={anyLoading}
          className={cn(
            "inline-flex items-center justify-center size-8 rounded-xl",
            "text-foreground/50 hover:bg-accent hover:text-foreground",
            "transition-colors duration-100",
            anyLoading && "opacity-30 cursor-not-allowed",
          )}
          aria-label="Clear selection"
        >
          <Icon icon="lucide:x" className="size-4" />
        </button>
      </div>
    </div>
  );
}
