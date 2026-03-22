import { getAllISOCodes } from "iso-country-currency";
import type { ComboBoxOption } from "../components/comboboxInput";
import Image from "next/image";

interface ISOEntry {
  iso: string;
  countryName: string;
  currency: string;
  symbol: string;
}

// Currencies where the ISO country code starts with the same letters as the currency
// e.g. USD → US, GBP → GB, INR → IN, AUD → AU, CAD → CA, JPY → JP, CHF → CH
// This handles 90% of cases automatically.
function getPreferredISO(currency: string, entries: ISOEntry[]): string {
  const OVERRIDES: Record<string, string> = {
    EUR: "EU",
    XOF: "SN",
    XAF: "CM",
    XCD: "AG",
    XPF: "PF",
  };

  if (OVERRIDES[currency]) return OVERRIDES[currency];

  const prefix = currency.slice(0, 2);
  const match = entries.find((e) => e.iso === prefix);
  // fallback to first entry - entries is always non-empty here
  return match?.iso ?? entries[0]?.iso ?? currency.slice(0, 2);
}

const FlagImage = (iso: string): React.ReactElement => (
  <Image
    src={`/images/country-flags/${iso.toLowerCase()}.png`}
    alt={iso}
    className="rounded-full size-4 object-cover shadow-sm"
    width={16}
    height={16}
  />
);

const getCurrencyName = (currencyCode: string): string => {
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "currency" }).of(currencyCode) ??
      currencyCode
    );
  } catch {
    return currencyCode;
  }
};

// function filterAndRank(
//   options: ComboBoxOption[],
//   search: string,
// ): ComboBoxOption[] {
//   if (!search) return options;

//   const q = search.toLowerCase();

//   return options
//     .map((option) => {
//       const value = option.value.toLowerCase();
//       const label = option.label.toLowerCase();
//       const keywords = option.keywords?.map((k) => k.toLowerCase()) ?? [];

//       let score = 0;

//       if (value === q)
//         score = 100; // exact value match  (USD → USD)
//       else if (value.startsWith(q))
//         score = 90; // prefix value match (US  → USD)
//       else if (label === q)
//         score = 80; // exact label match
//       else if (label.startsWith(q))
//         score = 70; // prefix label match
//       else if (keywords.some((k) => k === q))
//         score = 60; // exact keyword match
//       else if (keywords.some((k) => k.startsWith(q)))
//         score = 50; // prefix keyword
//       else if (value.includes(q) || label.includes(q)) score = 30;
//       else if (keywords.some((k) => k.includes(q))) score = 20;
//       else return null; // no match

//       return { option, score };
//     })
//     .filter(Boolean)
//     .sort((a, b) => b!.score - a!.score)
//     .map((r) => r!.option);
// }

function buildCurrencyOptions(): ComboBoxOption[] {
  const entries = getAllISOCodes() as ISOEntry[];

  // Deduplicate by currency
  const currencyMap = new Map<string, ISOEntry[]>();
  for (const entry of entries) {
    if (!entry.currency) continue;
    if (!currencyMap.has(entry.currency)) currencyMap.set(entry.currency, []);
    currencyMap.get(entry.currency)!.push(entry);
  }

  return Array.from(currencyMap.entries())
    .map<ComboBoxOption>(([currency, currencyEntries]) => {
      const iso = getPreferredISO(currency, currencyEntries);
      return {
        value: currency,
        label: getCurrencyName(currency),
        icon: FlagImage(iso),
        keywords: [
          currency,
          getCurrencyName(currency).toLowerCase(), 
          ...currencyEntries.map((e) => e.iso ?? ""), 
          ...currencyEntries.map((e) => e.countryName ?? ""),
        ],
      };
    })
    .sort((a, b) => a.value.localeCompare(b.value));
}

export const CURRENCY_OPTIONS: ComboBoxOption[] = buildCurrencyOptions();

export const POPULAR_CURRENCY_VALUES = [
  "EUR",
  "GBP",
  "USD",
  "INR",
  "AUD",
  "CAD",
  "JPY",
  "CHF",
];
