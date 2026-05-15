"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import { Button } from "@snappin/ui/components/button";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { LogoSymbol } from "@snappin/ui/components/logo";
import Link from "next/link";
import { useState } from "react";

type OAuthStrategy = "google" | "microsoft";

export const Client = () => {
  const [oauthLoading, setOauthLoading] = useState<OAuthStrategy | null>();
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <CDNImage
          src="/static/images/landing/loading_with_animation.gif"
          alt="Loading"
          className="size-16"
        />
      </div>
    );
  }
  return (
    <SignIn.Root>
      {/* ── Step 1: identifier ───────────────────────────────────────────── */}
      <SignIn.Step name="start">
        <div className="space-y-8 text-center">
          <div className="space-y-8">
            <div className="w-fit mx-auto">
              <LogoSymbol divClassName="size-9" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl tracking-tight font-bold">
                Log in to Snappin
              </h1>
              <p className="text-sm/6 text-fg-2">
                Receipt management made easy
              </p>
            </div>
          </div>

          <Clerk.GlobalError className="text-xs text-red-500" />

          <div className="flex flex-wrap md:flex-row gap-2">
            <Clerk.Connection name="google" asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setOauthLoading("google")}
                disabled={oauthLoading != null}
              >
                <Icon icon="flat-color-icons:google" className="size-6" />
                Sign in with Google
              </Button>
            </Clerk.Connection>

            <Clerk.Connection name="microsoft" asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setOauthLoading("microsoft")}
                disabled={oauthLoading != null}
              >
                <Icon icon="logos:microsoft-icon" className="size-4" />
                Sign in with Microsoft
              </Button>
            </Clerk.Connection>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-bg-3" />
            or continue with email
            <div className="h-px flex-1 bg-bg-3" />
          </div>

          <div className="space-y-3">
            <Clerk.Field name="identifier">
              <Clerk.Input asChild>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full h-11 rounded-lg text-sm focus-within:outline-0 border-0 pl-3 bg-bg-a2"
                  autoFocus
                />
              </Clerk.Input>
              <Clerk.FieldError className="block text-sm text-red-500 text-left mt-1" />
            </Clerk.Field>

            <Clerk.Loading scope="step:start">
              {(isLoading) => (
                <SignIn.Action submit asChild>
                  <Button
                    size="lg"
                    className="w-full shadow-none"
                    disabled={isLoading}
                  >
                    Continue
                  </Button>
                </SignIn.Action>
              )}
            </Clerk.Loading>
          </div>

          <div className="flex items-center gap-1 justify-center">
            <p className="text-sm/6 text-fg-2">Don&#39;t have an account?</p>
            <Link href="/signup" className="text-sm/6 text-link">
              Register
            </Link>
          </div>
        </div>
      </SignIn.Step>

      {/* ── Step 2: magic link clicked → verifying ───────────────────────── */}
      <SignIn.Step name="verifications">
        <SignIn.Strategy name="email_link">
          <div className="space-y-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Icon icon="lucide:mail-check" className="size-6" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">Check your inbox</h1>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link{" "}
                <span className="font-bold">
                  <SignIn.SafeIdentifier />
                </span>
              </p>
            </div>
            <Clerk.GlobalError className="text-xs text-red-500" />
          </div>
        </SignIn.Strategy>
      </SignIn.Step>

      {/* ── SSO callback — Captcha must live here ────────────────────────── */}
      <SignIn.Step name="sso-callback">
        <SignIn.Captcha />
      </SignIn.Step>
    </SignIn.Root>
  );
};
