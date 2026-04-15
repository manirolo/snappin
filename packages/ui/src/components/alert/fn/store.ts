import React from "react";
import { create } from "zustand";

type ConfirmState = {
    open: boolean;
    title?: string;
    description?: string;
    content?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm?: () => void;
    icon?: React.ReactNode;
    size?: "default" | "sm";
    openConfirm: (payload: Omit<ConfirmState, "open" | "openConfirm" | "close">) => void;
    close: () => void;
};

export const useConfirmStore = create<ConfirmState>((set) => ({
    open: false,
    openConfirm: (payload) =>
        set({
            open: true,
            ...payload,
        }),
    close: () => set({ open: false }),
}));