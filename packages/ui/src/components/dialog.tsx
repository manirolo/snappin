"use client";

import * as React from "react";
import { cn } from "@snappin/ui/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const dialogContentVariants = cva(
  "bg-card fixed z-50 top-[50%] left-[50%] grid w-full -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-md corner-superellipse/1.125 transition-all duration-200 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95 outline-none overflow-hidden max-w-lg",
  {
    variants: {
      variant: {
        default: "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        fullscreen: "inset-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-fg-4/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  overlay = true,
  variant,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean;
    overlay?: boolean;
  }) {
  return (
    <DialogPortal>
      {overlay && <DialogOverlay />}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ variant }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="absolute top-4 right-4 size-8 flex items-center justify-center corner-superellipse/1.25 text-gray-2 hover:text-gray-3 hover:bg-bg-2 rounded-lg transition-colors cursor-pointer">
            <Tooltip>
              <TooltipTrigger asChild>
                <X className="size-5" strokeWidth={4} />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={14}>Close</TooltipContent>
            </Tooltip>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export default DialogContent;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-header"
    className={cn(
      "flex flex-col items-center gap-2.5 text-center sm:text-left px-6 pt-6 pb-0",
      className,
    )}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse p-6 sm:flex-row sm:justify-end pt-5 sm:space-x-2.5",
      className,
    )}
    {...props}
  />
);

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl text-center text-fg-4 leading-tighter font-medium text-balance",
        className,
      )}
      {...props}
    />
  );
}

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="dialog-body" className={cn("grow", className)} {...props} />
);

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-fg-2 font-normal text-center text-balance",
        className,
      )}
      {...props}
    />
  );
}

function DialogLabel({ ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className="text-sm text-fg-2 font-medium text-center text-balance h-6 px-2 rounded-full bg-bg-a1 flex items-center justify-center w-fit"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogLabel,
  DialogTrigger,
};
