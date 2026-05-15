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
      {/* ── Step 1: identifier ───────────────────────────────────────────── */}
      <SignUp.Step name="start">
        <div className="space-y-8 text-center">
          <div className="space-y-8">
            <div className="w-fit mx-auto">
              <LogoSymbol divClassName="size-9" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl tracking-tight font-bold">
                Create your account
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
                Sign up with Google
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
                Sign up with Microsoft
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
                  placeholder="Email"
                  className="w-full h-11 rounded-lg text-sm focus-within:outline-0 border-0 pl-3 bg-bg-a2"
                  autoFocus
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

      {/* ── Step 2: collect extra fields if required ─────────────────────── */}
      <SignUp.Step name="continue">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <div className="w-fit mx-auto">
              <LogoSymbol divClassName="size-9" />
            </div>
            <h1 className="text-2xl tracking-tight font-medium">
              One more step
            </h1>
            <p className="text-sm/6 text-fg-2">Tell us a bit about yourself</p>
          </div>

          <Clerk.GlobalError className="text-xs text-red-500" />

          <div className="space-y-3">
            <Clerk.Field name="firstName">
              <Clerk.Input asChild>
                <input
                  placeholder="First name"
                  className="w-full h-11 rounded-lg text-sm focus-within:outline-0 border-0 pl-3 bg-bg-a2"
                />
              </Clerk.Input>
              <Clerk.FieldError className="block text-xs text-red-500 text-left mt-1" />
            </Clerk.Field>

            <Clerk.Field name="lastName">
              <Clerk.Input asChild>
                <input
                  placeholder="Last name"
                  className="w-full h-11 rounded-lg text-sm focus-within:outline-0 border-0 pl-3 bg-bg-a2"
                />
              </Clerk.Input>
              <Clerk.FieldError className="block text-xs text-red-500 text-left mt-1" />
            </Clerk.Field>

            <Clerk.Loading scope="step:continue">
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
        </div>
      </SignUp.Step>

      {/* ── Step 3: email link verification ──────────────────────────────── */}
      <SignUp.Step name="verifications">
        <SignUp.Strategy name="email_link">
          <div className="space-y-6 text-center">
            <div className="w-fit mx-auto">
              <LogoSymbol divClassName="size-9" />
            </div>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Icon icon="lucide:mail-check" className="size-6" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">Check your inbox</h1>
              <p className="text-sm text-muted-foreground">
                We sent a verification link
              </p>
            </div>
            <Clerk.GlobalError className="text-xs text-red-500" />
          </div>
        </SignUp.Strategy>
      </SignUp.Step>
    </SignUp.Root>
  );
};
