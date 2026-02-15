import { H5, Small } from '@snappin/ui/components/typography'
import React from 'react'

export const GroupIntegrationCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex flex-col gap-3'>{children}</div>
    )
}

export const GroupIntegrationHeader = ({ children } : { children: React.ReactNode}) => {
    return(
        <div>
            {children}
        </div>
    )
}

export const GroupIntegrationTitle = ({ children }: { children: React.ReactNode}) => {
    return(
        <H5>{children}</H5>
    )
}

export const GroupIntegrationDescription = ({ children } : { children: React.ReactNode}) => {
    return(
        <Small>{children}</Small>
    )
}

export const GroupIntegrationContent = ( { children } : {children: React.ReactNode }) => {
    return(
        <div className='flex gap-6 max-w-fit mt-4'>
            {children}
        </div>
    )
}

