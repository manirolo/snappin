import React from "react";
import { ConnectionFailed } from "../../../modules/error/connectionFailed";

export default function Page() {
  return <ConnectionFailed />;
}

export const metadata = {
  title: "Something went wrong | Snappin",
  description:
    "Connection failed due to various factors",
};
