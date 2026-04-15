// packages/features/vendor/registry/index.ts

export type ExtractionStrategy =
  | "dom-links"
  | "xhr-intercept"
  | "print-to-pdf";

export type VendorConfig = {
  id: string;
  name: string;
  logo?: string;
  matchUrls: string[];
  invoicePageUrl: string;
  strategy: ExtractionStrategy;
  selectors?: {
    invoiceList?: string;
    downloadLink?: string;
    invoiceIdLink?: string;
  };
  metadata?: {
    dateSelector?: string;
    amountSelector?: string;
    invoiceIdSelector?: string;
    vendorNameOverride?: string;
  };
  interceptPatterns?: string[];
};

const amazon: VendorConfig = {
  id: "amazon",
  name: "Amazon",
  matchUrls: [
    "*://*.amazon.com/gp/css/order-history*",
    "*://*.amazon.com/gp/your-account/order-history*",
  ],
  invoicePageUrl: "https://www.amazon.com/gp/css/order-history",
  strategy: "dom-links",
  selectors: {
    invoiceList: ".order-card",
    downloadLink: "a[href*='invoice']",
    invoiceIdLink: "a[href*='/gp/your-account/order-details']",
  },
  metadata: {
    dateSelector: ".order-date-invoice-item",
    amountSelector: ".a-color-price",
    invoiceIdSelector: ".yohtmlc-order-id span:last-child",
  },
};

const github: VendorConfig = {
  id: "github",
  name: "GitHub",
  matchUrls: [
    "*://github.com/organizations/*/billing/history*",
    "*://github.com/settings/billing/history*",
  ],
  invoicePageUrl: "https://github.com/settings/billing/history",
  strategy: "dom-links",
  selectors: {
    invoiceList: "table tbody tr",
    downloadLink: "a[href*='/invoices/']",
  },
  metadata: {
    dateSelector: "td:first-child",
    amountSelector: "td:nth-child(3)",
    invoiceIdSelector: "a[href*='/invoices/']",
  },
};

const vercel: VendorConfig = {
  id: "vercel",
  name: "Vercel",
  matchUrls: [
    "*://vercel.com/teams/*/settings/billing*",
    "*://vercel.com/account/billing*",
  ],
  invoicePageUrl: "https://vercel.com/account/billing",
  strategy: "xhr-intercept",
  interceptPatterns: [
    "*://api.vercel.com/v1/invoices*",
    "*://vercel.com/api/v1/invoices*",
  ],
  selectors: {
    invoiceList: "[data-testid='invoice-row']",
    downloadLink: "a[href*='invoice']",
  },
  metadata: {
    dateSelector: "[data-testid='invoice-date']",
    amountSelector: "[data-testid='invoice-amount']",
    invoiceIdSelector: "[data-testid='invoice-id']",
  },
};

const aws: VendorConfig = {
  id: "aws",
  name: "AWS",
  matchUrls: [
    "*://console.aws.amazon.com/billing/home*",
    "*://us-east-1.console.aws.amazon.com/billing*",
  ],
  invoicePageUrl: "https://console.aws.amazon.com/billing/home#/bills",
  strategy: "print-to-pdf",
  selectors: {
    invoiceList: "[data-testid='invoice-list'] tr",
    invoiceIdLink: "a[href*='invoiceId']",
  },
  metadata: {
    dateSelector: "td:nth-child(1)",
    amountSelector: "td:nth-child(4)",
    invoiceIdSelector: "a[href*='invoiceId']",
    vendorNameOverride: "Amazon Web Services",
  },
};

const openai: VendorConfig = {
  id: "openai",
  name: "OpenAI",
  matchUrls: [
    "*://platform.openai.com/account/billing*",
    "*://platform.openai.com/settings/organization/billing*",
  ],
  invoicePageUrl: "https://platform.openai.com/account/billing/history",
  strategy: "xhr-intercept",
  interceptPatterns: [
    "*://api.openai.com/dashboard/billing/invoice*",
    "*://*.stripe.com/invoice*",
  ],
  selectors: {
    invoiceList: "table tbody tr",
    downloadLink: "a[href*='invoice']",
  },
  metadata: {
    dateSelector: "td:nth-child(1)",
    amountSelector: "td:nth-child(2)",
    invoiceIdSelector: "td:nth-child(3)",
  },
};

const railway: VendorConfig = {
  id: "railway",
  name: "Railway",
  matchUrls: [
    "*://railway.app/workspace/billing*",
    "*://railway.com/workspace/billing*",
  ],
  invoicePageUrl: "https://railway.com/workspace/billing",
  strategy: "dom-links",
  selectors: {
    // View links go to https://invoice.stripe.com/i/acct_.../live_...
    invoiceList: "a[href*='invoice.stripe.com'], a[href*='stripe'], a[href*='invoice'], [class*='billing'], table",
    downloadLink: "a[href*='invoice.stripe.com'], a[href*='stripe'], a[href*='invoice']",
  },
  metadata: {
    dateSelector: "[class*='date']",
    amountSelector: "[class*='amount']",
    invoiceIdSelector: "[class*='id']",
  },
};

export const vendors: VendorConfig[] = [
  amazon, github, vercel, aws, openai, railway,
];

export function getVendorById(id: string) {
  return vendors.find((v) => v.id === id) ?? null;
}

export function getVendorByUrl(url: string) {
  return vendors.find((v) =>
    v.matchUrls.some((pattern) => matchesPattern(pattern, url))
  ) ?? null;
}

function matchesPattern(pattern: string, url: string): boolean {
  const regex = pattern
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*");
  return new RegExp(`^${regex}$`).test(url);
}