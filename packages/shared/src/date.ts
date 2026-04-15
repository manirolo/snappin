export const DATE_FORMAT_IDS = [
    "DD_MMM_YYYY",
    "DD_MMMM_YYYY",
    "MMM_DD_YYYY",
    "MMMM_DD_YYYY",
    "YYYY_MMM_DD",
    "YYYY_MMMM_DD",
    "DD_MM_YYYY",
    "MM_DD_YYYY",
    "YYYY_MM_DD",
    "YYYY_MM_DD_SLASH",
    "YYYYMMDD",
    "DDMMYYYY",
] as const

export type DateFormatId = typeof DATE_FORMAT_IDS[number]

export const MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];