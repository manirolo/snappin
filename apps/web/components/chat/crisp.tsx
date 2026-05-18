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
  const crispReady = useRef(false);

  useEffect(() => {
    const initCrisp = () => {
      Crisp.configure(env.crisp.websiteId, {
        autoload: true,
      });
      crispReady.current = true;
    };

    if (document.readyState === "complete") {
      afterIdle(initCrisp);
    } else {
      window.addEventListener("load", () => afterIdle(initCrisp), {
        once: true,
      });
    }
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
        });
      }
    } else {
      Crisp.session.reset();
    }
  }, [isLoaded, user]);

  return null;
};

export default CrispChat;