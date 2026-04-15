"use client";

import React from "react";
import { AccountsCompactListTable } from "@snappin/features/accounts/components/account.table.compact";
import { Small } from "@snappin/ui/components/typography";
import {
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineBookOpen,
} from "react-icons/hi";

const TRUST_ITEMS = [
  {
    icon: HiOutlineShieldCheck,
    title: "Read-only access",
    description:
      "We only read your emails to extract invoices. We never send, delete, or modify anything.",
  },
  {
    icon: HiOutlineLockClosed,
    title: "Secure & encrypted",
    description:
      "Your credentials are never stored. We use OAuth — the same standard used by banks.",
  },
  {
    icon: HiOutlineBookOpen,
    title: "Need help?",
    description: (
      <>
        Email us at{" "}
        <a href="mailto:support@snappinapp.com" className="underline text-fg-4">
          support@snappinapp.com
        </a>
      </>
    ),
  },
];

export const GuestAccountView = () => {
  return (
    <div className="space-y-10">
      <AccountsCompactListTable disableInvite />

      {/* Trust bar */}
      <div className="border-t border-bg-3 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="flex gap-3">
            <item.icon className="size-4 mt-0.5 shrink-0 text-fg-2" />
            <div className="space-y-0.5">
              <Small className="text-fg-4 font-medium">{item.title}</Small>
              <Small className="text-fg-2">{item.description}</Small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
