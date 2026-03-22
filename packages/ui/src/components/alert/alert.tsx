"use client";

import { cn } from "@snappin/ui/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from "../alert-dialog";
import { useConfirmStore } from "./fn/store";

export const GlobalConfirmDialog = () => {
  const {
    open,
    title,
    description,
    icon,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive,
    size = "default",
    onConfirm,
    close,
  } = useConfirmStore();

  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          {icon && (
            <AlertDialogMedia
              className={cn(
                "w-fit h-fit p-2",
                destructive &&
                  "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive ",
              )}
            >
              {icon}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
         
          <AlertDialogCancel
            size={"lg"}
            className="group-data-[size=sm]:min-w-full border-2"
            onClick={close}
          >
            {cancelLabel}
          </AlertDialogCancel>
           <AlertDialogAction
            // className={cn("group-data-[size=sm]:min-w-full")}
            variant={destructive ? "destructive" : "primary"}
            size={"lg"}
            onClick={() => {
              onConfirm?.();
              close();
            }}
          >
            {confirmLabel}
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
