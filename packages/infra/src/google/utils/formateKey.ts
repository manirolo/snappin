export function toSingleLine(value: string): string {
  return value.replace(/\r?\n/g, "").trim();
}