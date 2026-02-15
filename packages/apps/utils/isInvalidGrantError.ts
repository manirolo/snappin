export function isInvalidGrantError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const err = error as {
    response?: {
      data?: {
        error?: string;
      };
    };
    error?: string;
    message?: string;
  };

  return (
    err.response?.data?.error === "invalid_grant" ||
    err.error === "invalid_grant" ||
    err.message?.toLowerCase().includes("invalid_grant") === true
  );
}