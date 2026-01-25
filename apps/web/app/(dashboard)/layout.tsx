import React from 'react'
import { SidebarProvider } from '@snappin/ui/components/sidebar'
import { AppSidebar } from '@snappin/ui/components/sidebar/appSidebar'
import { DashboardNavbarWrapper } from '../../components/navbar/dashboard.navbar'
import { User } from './_components/appSidebarFooter'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar user={<User />} />
        <div className="flex md:inline flex-col min-h-svh flex-1">
          <DashboardNavbarWrapper />
          <main>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
