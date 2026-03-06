
export type GetQueryParamsResponse = {
    vendorOptions: { value: string; label: string, domain: string | null }[];
    senderOptions: { value: string; label: string }[];
    recipientOptions: { value: string; label: string }[];
    invoiceRecipients: { value: string; label: string }[];
    currencies: {value: string; label: string}[]
};