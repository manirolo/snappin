"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
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
  const [email, setEmail] = useState("");
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
    <SignUp.Root>
      {/* ── Step 1: email ────────────────────────────────────────────────── */}
      <SignUp.Step name="start">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <div className="w-fit mx-auto">
              <LogoSymbol divClassName="size-9" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl tracking-tight font-bold">
                Create your account
              </h1>
              <p className="text-sm text-fg-2">Receipt management made easy</p>
            </div>
          </div>

          <Clerk.GlobalError className="text-xs text-red-500" />

          <div className="flex flex-col sm:flex-row gap-2">
            <Clerk.Connection name="google" asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:flex-1 items-center shadow-xs"
                onClick={() => setOauthLoading("google")}
                disabled={oauthLoading != null}
              >
                <Icon icon="flat-color-icons:google" className="size-6" />
                Google
              </Button>
            </Clerk.Connection>

            <Clerk.Connection name="microsoft" asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:flex-1 items-center shadow-xs"
                onClick={() => setOauthLoading("microsoft")}
                disabled={oauthLoading != null}
              >
                <Icon icon="logos:microsoft-icon" className="size-4" />
                Microsoft
              </Button>
            </Clerk.Connection>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-bg-3" />
            or continue with email
            <div className="h-px flex-1 bg-bg-3" />
          </div>

          <div className="space-y-3">
            <Clerk.Field name="emailAddress">
              <Clerk.Input asChild>
                <input
                  type="email"
                  placeholder="sundar@google.com"
                  className="w-full h-11 rounded-lg text-sm focus-within:outline-0 border-0 pl-3 bg-bg-a2"
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Clerk.Input>
              <Clerk.FieldError className="block text-sm text-red-500 text-left mt-1" />
            </Clerk.Field>

            <Clerk.Loading scope="step:start">
              {(isLoading) => (
                <SignUp.Action submit asChild>
                  <Button
                    size="lg"
                    className="w-full shadow-none"
                    disabled={isLoading}
                  >
                    Continue
                  </Button>
                </SignUp.Action>
              )}
            </Clerk.Loading>
          </div>

          <SignUp.Captcha />

          <div className="flex items-center gap-1 justify-center">
            <p className="text-sm/6 text-fg-2">Already have an account?</p>
            <Link href="/login" className="text-sm/6 text-link">
              Sign in
            </Link>
          </div>
        </div>
      </SignUp.Step>

      {/* ── Step 2: OTP verification ─────────────────────────────────────── */}
      <SignUp.Step name="verifications">
        <SignUp.Strategy name="email_code">
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="w-fit mx-auto">
                <LogoSymbol divClassName="size-9" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl tracking-tight font-bold">
                  Check your email
                </h1>
                <p className="text-sm text-fg-2">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
            </div>

            <Clerk.GlobalError className="text-xs text-red-500" />

            {/* OTP boxes */}
            <Clerk.Field name="code" className="space-y-3">
              <Clerk.Input
                type="otp"
                length={6}
                autoSubmit
                className="flex items-center justify-center gap-2"
                render={({ value, status }) => (
                  <div
                    data-status={status}
                    className={[
                      "relative w-10 h-12 rounded-lg border bg-bg-a2 shadow-sm",
                      "flex items-center justify-center",
                      "text-base font-semibold text-foreground",
                      "transition-colors duration-150",
                      status === "selected" || status === "cursor"
                        ? "border-primary ring-1 ring-primary/30"
                        : "border-bg-3",
                    ].join(" ")}
                  >
                    {value}
                    {status === "cursor" && !value && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-px h-5 bg-foreground animate-caret-blink" />
                      </span>
                    )}
                  </div>
                )}
              />
              <Clerk.FieldError className="block text-xs text-red-500 mt-1" />
            </Clerk.Field>

            {/* Resend + back */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 text-sm text-fg-2">
                <span>Didn&#39;t receive it?</span>
                <SignUp.Action
                  resend
                  fallback={({ resendableAfter }) => (
                    <span className="text-sm text-fg-2 tabular-nums">
                      Resend in {resendableAfter}s
                    </span>
                  )}
                  asChild
                >
                  <button className="text-sm text-link hover:underline underline-offset-2">
                    Resend code
                  </button>
                </SignUp.Action>
              </div>

              <SignUp.Action navigate="start" asChild>
                <button className="text-xs text-fg-2 hover:text-foreground transition-colors">
                  Use a different email
                </button>
              </SignUp.Action>
            </div>
          </div>
        </SignUp.Strategy>
      </SignUp.Step>
    </SignUp.Root>
  );
};
