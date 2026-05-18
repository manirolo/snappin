import { ClerkShell } from "./clerk-shell";
import { AppProviders } from "./app-providers";

export function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  return (
    <ClerkShell>
      <AppProviders>{children}</AppProviders>
    </ClerkShell>
  );
}
