import { MONTHS_SHORT, MONTHS_LONG, DateFormatId } from "@snappin/shared/date"

const pad = (n: number) => String(n).padStart(2, "0");

function getDateTokens(date: Date) {
    const YYYY = date.getUTCFullYear();
    const MM = pad(date.getUTCMonth() + 1);
    const DD = pad(date.getUTCDate());

    const MMM = MONTHS_SHORT[date.getUTCMonth()];
    const MMMM = MONTHS_LONG[date.getUTCMonth()];

    return { YYYY, MM, DD, MMM, MMMM };
}


const DATE_FORMATTERS: Record<
    DateFormatId,
    (t: ReturnType<typeof getDateTokens>) => string
> = {
    DD_MMM_YYYY: ({ DD, MMM, YYYY }) => `${DD} ${MMM}, ${YYYY}`,
    DD_MMMM_YYYY: ({ DD, MMMM, YYYY }) => `${DD} ${MMMM}, ${YYYY}`,
    MMM_DD_YYYY: ({ MMM, DD, YYYY }) => `${MMM} ${DD}, ${YYYY}`,
    MMMM_DD_YYYY: ({ MMMM, DD, YYYY }) => `${MMMM} ${DD}, ${YYYY}`,

    YYYY_MMM_DD: ({ YYYY, MMM, DD }) => `${YYYY} ${MMM} ${DD}`,
    YYYY_MMMM_DD: ({ YYYY, MMMM, DD }) => `${YYYY} ${MMMM} ${DD}`,

    DD_MM_YYYY: ({ DD, MM, YYYY }) => `${DD}/${MM}/${YYYY}`,
    MM_DD_YYYY: ({ MM, DD, YYYY }) => `${MM}/${DD}/${YYYY}`,

    YYYY_MM_DD: ({ YYYY, MM, DD }) => `${YYYY}-${MM}-${DD}`,
    YYYY_MM_DD_SLASH: ({ YYYY, MM, DD }) => `${YYYY}/${MM}/${DD}`,

    YYYYMMDD: ({ YYYY, MM, DD }) => `${YYYY}${MM}${DD}`,
    DDMMYYYY: ({ DD, MM, YYYY }) => `${DD}${MM}${YYYY}`,
};

type DateInput = string | number | Date | null | undefined

function normalizeDate(input: DateInput): Date | null {
  if (!input) return null

  if (input instanceof Date) return input

  if (typeof input === "number") {
    // Detect seconds vs milliseconds
    const timestamp =
      input < 1e12 ? input * 1000 : input
    return new Date(timestamp)
  }

  if (typeof input === "string") {
    const parsed = new Date(input)
    if (!Number.isNaN(parsed.getTime())) return parsed

    // If string numeric timestamp
    const numeric = Number(input)
    if (!Number.isNaN(numeric)) {
      const timestamp =
        numeric < 1e12 ? numeric * 1000 : numeric
      return new Date(timestamp)
    }
  }

  return null
}

export function formatDate(
  format: DateFormatId,
  input?: DateInput,
): string {

  const date = normalizeDate(input)

  if (!date) return "—"

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date input")
  }

  const formatter = DATE_FORMATTERS[format]

  if (!formatter) {
    throw new Error(`Unsupported date format: ${format}`)
  }

  return formatter(getDateTokens(date))
}