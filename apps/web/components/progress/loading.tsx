import React from "react";
import { Spinner } from "@snappin/ui/assets/svg/spinner";

export const DashboardLoading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Spinner className="size-9" />
    </div>
  );
};
