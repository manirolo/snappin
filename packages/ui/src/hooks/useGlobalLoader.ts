"use client"

import { create } from "zustand"
import { FullScreenLoadingStore } from "@snappin/shared/loading"

export const useFullScreenLoading = create<FullScreenLoadingStore>((set) => ({
    loading: false,
    data: null,
    show: async (data) => set({ loading: true, data }),
    clear: () => set({ loading: false, data: null }),
}));