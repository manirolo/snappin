export function isInvalidGrantError(error: unknown): boolean {
  if (!error) return false;

  const err = error as any;

  return (
    err?.response?.data?.error === "invalid_grant" ||
    err?.error === "invalid_grant" ||
    err?.message?.toLowerCase?.().includes("invalid_grant")
  );
}
