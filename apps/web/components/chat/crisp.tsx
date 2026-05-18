"use client";

import { useEffect, useRef } from "react";
import { Crisp } from "crisp-sdk-web";
import { env } from "@snappin/env";
import { useUser } from "@clerk/nextjs";

function afterIdle(cb: () => void, timeout = 4000) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb, { timeout });
  } else {
    setTimeout(cb, timeout);
  }
}

const CrispChat = () => {
  const { user, isLoaded } = useUser();
  const userRef = useRef({ user, isLoaded });

  // Keep ref in sync without triggering extra effects
  useRef(() => {
    userRef.current = { user, isLoaded };
  });

  useEffect(() => {
    const initCrisp = () => {
      Crisp.configure(env.crisp.websiteId, { autoload: true });

      // Set user data right after init using latest values from ref
      const { user, isLoaded } = userRef.current;
      if (isLoaded && user) {
        const email = user.emailAddresses[0]?.emailAddress;
        const name = email?.split("@")[0] ?? email ?? "";
        if (email) {
          Crisp.user.setEmail(email);
          Crisp.user.setNickname(name);
          Crisp.session.setData({ clerkId: user.id });
        }
      }
    };

    if (document.readyState === "complete") {
      afterIdle(initCrisp);
    } else {
      window.addEventListener("load", () => afterIdle(initCrisp), {
        once: true,
      });
    }
  }, []);

  // Runs only after Crisp is available on window
  useEffect(() => {
    if (!isLoaded || !window.$crisp) return;

    if (user) {
      const email = user.emailAddresses[0]?.emailAddress;
      const name = email?.split("@")[0] ?? email ?? "";
      if (email) {
        Crisp.user.setEmail(email);
        Crisp.user.setNickname(name);
        Crisp.session.setData({ clerkId: user.id });
      }
    } else {
      Crisp.session.reset();
    }
  }, [isLoaded, user]);

  return null;
};

export default CrispChat;
