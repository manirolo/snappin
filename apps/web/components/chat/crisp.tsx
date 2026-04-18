"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { env } from "@snappin/env";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure(env.crisp.websiteId);
  });

  return null;
};

export default CrispChat;
