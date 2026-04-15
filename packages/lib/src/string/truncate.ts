type TruncateStrategy = "middle" | "end" | "start" | "first-word";

interface TruncateOptions {
  maxLength?: number;
  ellipsis?: string;
  strategy?: TruncateStrategy;
}

/**
 * Flexible string truncation utility.
 *
 * @param str      - The string to truncate
 * @param options  - Configuration options:
 *   - maxLength  : Maximum characters before truncating (default: 20)
 *   - ellipsis   : The ellipsis string to insert       (default: "...")
 *   - strategy   : How to truncate:
 *       "end"        → "Hello Wor..."
 *       "start"      → "...lo World!"
 *       "middle"     → "Hello...rld!"
 *       "first-word" → "Invoice..." (keeps first word intact, then truncates)
 */
export const truncate = (str: string, options: TruncateOptions = {}): string => {
  const { maxLength = 20, ellipsis = "...", strategy = "middle" } = options;

  if (str.length <= maxLength) return str;

  const ellipsisLen = ellipsis.length;
  const usable = maxLength - ellipsisLen;

  switch (strategy) {
    case "end":
      return `${str.slice(0, usable)}${ellipsis}`;

    case "start":
      return `${ellipsis}${str.slice(-usable)}`;

    case "middle": {
      const keep = Math.floor(usable / 2);
      return `${str.slice(0, keep)}${ellipsis}${str.slice(-keep)}`;
    }

    /**
     * "first-word" strategy:
     * - If the first word fits within maxLength, show it in full + ellipsis
     *   e.g. "Website Hosting Fee Q1 2025" → "Website..."
     * - If the first word itself is longer than maxLength, fall back to "end"
     *   e.g. "Supercalifragilistic..." → "Supercalifragili..."
     */
    case "first-word": {
      const spaceIdx = str.indexOf(" ");

      // Single word — fall back to end truncation
      if (spaceIdx === -1) return `${str.slice(0, usable)}${ellipsis}`;

      const firstWord = str.slice(0, spaceIdx);

      // First word alone already exceeds budget — truncate it
      if (firstWord.length >= maxLength - ellipsisLen) {
        return `${firstWord.slice(0, usable)}${ellipsis}`;
      }

      // Show as much of the remainder as fits after the first word
      const remaining = maxLength - firstWord.length - ellipsisLen;
      const rest = str.slice(spaceIdx, spaceIdx + remaining);

      return `${firstWord}${rest}${ellipsis}`;
    }

    default:
      return str;
  }
};


// ─── Convenience shorthands ────────────────────────────────────────────────────

/** "Hello Wor..." */
export const truncateEnd = (str: string, maxLength = 20, ellipsis = "...") =>
  truncate(str, { maxLength, ellipsis, strategy: "end" });

/** "...lo World" */
export const truncateStart = (str: string, maxLength = 20, ellipsis = "...") =>
  truncate(str, { maxLength, ellipsis, strategy: "start" });

/** "Hello...rld!" */
export const truncateMiddle = (str: string, maxLength = 20, ellipsis = "...") =>
  truncate(str, { maxLength, ellipsis, strategy: "middle" });

/** "Invoice..." — first word always visible */
export const truncateFirstWord = (str: string, maxLength = 20, ellipsis = "...") =>
  truncate(str, { maxLength, ellipsis, strategy: "first-word" });