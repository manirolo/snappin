import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
  DashboardDescription,
} from "../../components/layout/dashboardLayout";

export const MembersSettingsView = () => {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Workspace Members</DashboardTitle>
          <DashboardDescription>
            Manage members, invitations, and membership requests for your workspace.
          </DashboardDescription>
        </DashboardHeaderMain>
      </DashboardHeader>
      <DashboardContent>
        <></>
      </DashboardContent>
    </Dashboard>
  );
};
