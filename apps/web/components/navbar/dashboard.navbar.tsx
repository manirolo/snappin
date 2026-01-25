"use client"

import { useAuth, useClerk } from '@clerk/nextjs'
import { DashboardNavbar } from '@snappin/ui/components/navbar/dashboard.navbar'
import React from 'react'

export const DashboardNavbarWrapper = () => {
    const { user } = useClerk();
    const { signOut } = useAuth();
    return (
        <DashboardNavbar
            user={{
                firstName: user?.firstName,
                lastName: user?.lastName,
                fullName: user?.fullName,
                imageUrl: user?.imageUrl,
                primaryEmailAddress: user?.primaryEmailAddress
            }}
            signOut={signOut} />
    )
}
