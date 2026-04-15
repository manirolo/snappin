import React from "react";
import { GuestNavbar } from "../../components/navbar/guest.navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GuestNavbar>{children}</GuestNavbar>;
}
