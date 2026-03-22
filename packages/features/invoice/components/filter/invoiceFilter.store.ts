import { create } from "zustand";

export type InvoiceFilterState = {
    vendorIds: string[];
    senderEmails: string[];
    recipientEmails: string[];
    currencies: string[];
    invoiceRecipients: string[];
};

type InvoiceFilterStore = InvoiceFilterState & {
    setVendorIds: (ids: string[]) => void;
    setSenderEmails: (emails: string[]) => void;
    setRecipientEmails: (emails: string[]) => void;
    toggleVendor: (id: string) => void;
    toggleSender: (email: string) => void;
    toggleRecipient: (email: string) => void;
    toggleCurrency: (c: string) => void;
    toggleInvoiceRecipient: (email: string) => void;
    reset: () => void;
    hasActiveFilters: () => boolean;
    filterCount: () => number;
};

const initialState: InvoiceFilterState = {
    vendorIds: [],
    senderEmails: [],
    recipientEmails: [],
    currencies: [],
    invoiceRecipients: [],
};

export const useInvoiceFilterStore = create<InvoiceFilterStore>((set, get) => ({
    ...initialState,

    setVendorIds: (ids) => set({ vendorIds: ids }),
    setSenderEmails: (emails) => set({ senderEmails: emails }),
    setRecipientEmails: (emails) => set({ recipientEmails: emails }),

    toggleVendor: (id) =>
        set((s) => ({
            vendorIds: s.vendorIds.includes(id)
                ? s.vendorIds.filter((v) => v !== id)
                : [...s.vendorIds, id],
        })),

    toggleSender: (email) =>
        set((s) => ({
            senderEmails: s.senderEmails.includes(email)
                ? s.senderEmails.filter((e) => e !== email)
                : [...s.senderEmails, email],
        })),

    toggleRecipient: (email) =>
        set((s) => ({
            recipientEmails: s.recipientEmails.includes(email)
                ? s.recipientEmails.filter((e) => e !== email)
                : [...s.recipientEmails, email],
        })),

    toggleCurrency: (c) =>
        set((s) => ({
            currencies: s.currencies.includes(c)
                ? s.currencies.filter((v) => v !== c)
                : [...s.currencies, c],
        })),

    toggleInvoiceRecipient: (email) =>
        set((s) => ({
            invoiceRecipients: s.invoiceRecipients.includes(email)
                ? s.invoiceRecipients.filter((e) => e !== email)
                : [...s.invoiceRecipients, email],
        })),

    reset: () => set(initialState),
    filterCount: () => {
        const { vendorIds, senderEmails, recipientEmails, currencies, invoiceRecipients } = get();
        return vendorIds.length + senderEmails.length + recipientEmails.length
            + currencies.length + invoiceRecipients.length;
    },

    hasActiveFilters: () => {
        const { vendorIds, senderEmails, recipientEmails, currencies, invoiceRecipients } = get();
        return vendorIds.length > 0 || senderEmails.length > 0 || recipientEmails.length > 0
            || currencies.length > 0 || invoiceRecipients.length > 0;
    },
}));