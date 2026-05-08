import React from "react";
import { AlreadyConnected } from "../../../modules/error/accountAlreadyConnected";

export default function Page() {
  return <AlreadyConnected />;
}

export const metadata = {
  title: "Account Already Connected | Snappin",
  description:
    "Connection failed due to various factors",
};
