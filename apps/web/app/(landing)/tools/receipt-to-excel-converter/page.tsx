import { ReceiptToExcel } from "../../../../modules/tools/receipt/receiptToExcel";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <ReceiptToExcel />

      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Receipt to Excel Converter | Snappin",
            description:
              "Convert receipts to Excel instantly. Upload a photo or PDF and get a clean spreadsheet with store, date, items, and totals — free.",
            url: "https://www.snappinapp.com/tools/receipt-to-excel",
          }),
        }}
      />

      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Receipt to Excel Converter",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Free online tool to convert receipts to Excel. Extract store name, date, items, prices, taxes, and totals from any receipt photo or PDF.",
            url: "https://www.snappinapp.com/tools/receipt-to-excel",
            image: "https://www.snappinapp.com/images/snappin_dark_light.png",
            brand: {
              "@type": "Brand",
              name: "Snappin",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "9",
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />
    </>
  );
}

export const metadata = {
  title: "Receipt to Excel Converter — Free Online Tool",
  description:
    "Convert any receipt to Excel in seconds. Upload a photo or PDF and instantly extract store name, items, prices, and totals into a clean spreadsheet. Free, no sign-up needed.",
  keywords: [
    "receipt to excel",
    "receipt scanner",
    "convert receipt to spreadsheet",
    "receipt data extractor",
    "expense tracking",
    "receipt to csv",
    "free receipt converter",
    "scan receipt to excel",
  ],
  alternates: {
    canonical: "https://www.snappinapp.com/tools/receipt-to-excel",
  },
  openGraph: {
    title: "Receipt to Excel Converter — Free Online Tool",
    description:
      "Upload a receipt photo or PDF and get a clean Excel spreadsheet instantly. Free, no sign-up needed.",
    url: "https://www.snappinapp.com/tools/receipt-to-excel",
    siteName: "Snappin",
    images: [
      {
        url: "https://www.snappinapp.com/images/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Receipt to Excel Converter — Free Online Tool",
    description:
      "Upload a receipt photo or PDF and get a clean Excel spreadsheet instantly. Free, no sign-up needed.",
    images: ["https://www.snappinapp.com/images/og.png"],
    creator: "@snappin_ai",
  },
};
