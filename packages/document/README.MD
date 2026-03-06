## Snappin Document AI

Snappin Document AI extracts data from PDF and converts into structured data.

# Example

```
const result = SnappinDoc.extract({
    file: "https://cdn.example.com/invoice.pdf",
    model: "gemini-2-0-flash-lite",
    template: "invoice"
})
```

# Output

```
[
    {
        totalPages: 2,
        totalInvoices: 2,
        data: [
            {
                invoiceId: "invoice_123",
                invoiceDate: "14/05/2023",
                dueDate: "23/05/2023",
                ....
            }
        ],
    }
]
```
