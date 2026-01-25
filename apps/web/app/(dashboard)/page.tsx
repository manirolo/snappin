import React from 'react'
import { Dashboard, DashboardContent } from './_components/dashboardLayout'
import { H1 } from '@snappin/ui/components/typography'

export default function Page() {

  return (
    <Dashboard>
      <DashboardContent>
        <div className='flex flex-col justify-center items-center min-h-[40vh]'>
          <H1>Find all your invoices</H1>
        </div>
      </DashboardContent>
    </Dashboard>
  )
}
