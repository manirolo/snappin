import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@snappin/env";

export function ClerkShell({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={env.clerk.publishableKey}
      signInForceRedirectUrl={"/dashboard"}
      signUpForceRedirectUrl={"/dashboard"}
      signInUrl={env.clerk.signInUrl}
      signUpUrl={env.clerk.signUpUrl}
      dynamic
      afterSignOutUrl={"/login"}
    >
      {children}
    </ClerkProvider>
  );
}
