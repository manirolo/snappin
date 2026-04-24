"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { env } from "@snappin/env";
import { useUser } from "@clerk/nextjs";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";

const CrispChat = () => {
  const { user, isLoaded } = useUser();
  const { usage } = useUsage();

  useEffect(() => {
    Crisp.configure(env.crisp.websiteId);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const name = user.fullName ?? user.firstName ?? email ?? "";

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
  }, [isLoaded, usage?.planId, user]);

  return null;
};

export default CrispChat;
