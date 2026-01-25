import React from 'react'
import { Dashboard, DashboardActions, DashboardContent, DashboardDescription, DashboardHeader, DashboardHeaderMain, DashboardTitle } from '../_components/dashboardLayout'
import { Table } from './_components/table'
import { SelectProvider } from './_components/selectProvider'

export default function Page() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>
            Email Accounts
          </DashboardTitle>
          <DashboardDescription>
            Connect your email account for invoice extraction
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          <SelectProvider />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        <Table />
      </DashboardContent>
    </Dashboard>
  )
}
