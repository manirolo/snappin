export function isDeepDirty(
  original: unknown,
  patched: unknown,
): boolean {
  if (!patched || typeof patched !== "object") return false;
  if (!original || typeof original !== "object") return Object.keys(patched).length > 0;

  for (const key of Object.keys(patched) as (keyof typeof patched)[]) {
    const originalVal = (original as Record<string, unknown>)[key as string];
    const patchedVal = (patched as Record<string, unknown>)[key as string];

    if (
      typeof patchedVal === "object" &&
      patchedVal !== null &&
      typeof originalVal === "object" &&
      originalVal !== null
    ) {
      if (isDeepDirty(originalVal, patchedVal)) return true;
    } else if (patchedVal !== originalVal) {
      return true;
    }
  }

  return false;
}