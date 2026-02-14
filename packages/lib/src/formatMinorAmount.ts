type DecimalSeparator = "." | ",";
type ThousandSeparator = "." | "," | " " | "'" | "";

export function formatMinorAmount(
  amountMinor?: number | null,
  options?: {
    decimalSeparator?: DecimalSeparator;
    thousandSeparator?: ThousandSeparator;
  }
): string {
  const {
    decimalSeparator = ".",
    thousandSeparator = ",",
  } = options ?? {};

  if(!amountMinor) return "0"
  const value = amountMinor / 100;
  const hasDecimals = !Number.isInteger(value);

  const formatted = value.toFixed(hasDecimals ? 2 : 0);

  // ✅ DEFAULT VALUE FIX (this is the key)
  const [rawIntPart = "", decPart] = formatted.split(".");

  let intPart = rawIntPart;

  if (thousandSeparator) {
    intPart = intPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandSeparator
    );
  }

  if (!hasDecimals || !decPart) {
    return intPart;
  }

  return `${intPart}${decimalSeparator}${decPart}`;
}
