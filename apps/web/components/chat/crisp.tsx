"use client";

import { useEffect, useRef } from "react";
import { Crisp } from "crisp-sdk-web";
import { env } from "@snappin/env";
import { useUser } from "@clerk/nextjs";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";

const CrispChat = () => {
  const { user, isLoaded } = useUser();
  const { usage } = useUsage();
  const crispReady = useRef(false);

  useEffect(() => {
    Crisp.configure(env.crisp.websiteId, {
      autoload: true,
    });
    crispReady.current = true;
  }, []);

  useEffect(() => {
    if (!isLoaded || !crispReady.current) return;

    if (user) {
      const email = user.emailAddresses[0]?.emailAddress;
      const name = email?.split("@")[0] ?? email ?? "";

      if (email) {
        Crisp.user.setEmail(email);
        Crisp.user.setNickname(name);
        Crisp.session.setData({
          clerkId: user.id,
          plan: usage?.planId ?? "basic",
        });
      }
    } else {
      Crisp.session.reset();
    }
  }, [isLoaded, user, usage?.planId]);

  return null;
};

export default CrispChat;
