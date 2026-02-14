import { Icon } from '@iconify/react'
import { Button } from '@snappin/ui/components/button'
import { ExtraSmall, Lead, Small } from '@snappin/ui/components/typography'
import { Card, CardHeader, CardContent, CardFooter } from '@snappin/ui/components/card'
import { Spinner} from '@snappin/ui/assets/svg/spinner'
import React from 'react'
import { AppSlug } from '@snappin/shared/apps/app.enum'
import { cn } from "@snappin/ui/lib/utils"

export const IntegrationCard = ({children, className,}: {children: React.ReactNode, className?: string}) => {
    return (
            <div className={cn("bg-white rounded-2xl p-4 inline-flex flex-col justify-between border-2 border-gray-3 shadow-xs shadow-gray-3 max-w-120",className)}>
                {children}
            </div>
        )
}

export const IntegrationCardHeader = ({children,}: {children: React.ReactNode}) => {
    return (
        <div className="flex items-center gap-2">
            {children}
        </div>
    )
}

export const IntegrationCardIcon = ({icon,}: {icon: string}) => {
    return (
        <Icon icon={icon} className="size-5 flex items-center justify-center" />
    )
}

export const IntegrationCardTitle = ({children,}: {children: React.ReactNode}) => {
    return (
        <Lead className="text-sm font-medium text-foreground">
            {children}
        </Lead>
    )
}

export const IntegrationCardContent = ({children,}: {children: React.ReactNode}) => {
    return (
        <Small className='text-[0.75rem]'>
            {children}
        </Small>
    )
}

export const IntegrationCardFooter = ({children,}: {children: React.ReactNode}) => {
    return (
        <div className="flex justify-end ml-auto mt-4">
            {children}
        </div>
    )
}

type IntegrationCardProps = {
    name: string;
    description: string;
    appSlug: string;
    icon: string;
    note?: string;
    onClick?: () => void;
    loading?: AppSlug | null;
}

export const Integration = ({ name, description, icon, onClick, loading, note, appSlug }: IntegrationCardProps) => {
    return(
        <Card className='gap-0'>
            <CardHeader className='border-b-0'>
                <IntegrationCardHeader>
                    <IntegrationCardIcon icon={icon} />
                    <IntegrationCardTitle>
                        {name}
                    </IntegrationCardTitle>
                </IntegrationCardHeader>
            </CardHeader>

             <CardContent className='pt-0 p-0 pb-2 px-5'>
                <IntegrationCardContent>
                    {description}
                </IntegrationCardContent>
                
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pb-2 mt-4">
                <Button variant={"outline"} className='w-full' onClick={onClick} disabled={loading != null} asChild>
                    <div className='flex gap-2'>
                        {loading == appSlug && <Spinner className="animate-spin" /> }
                        Connect
                    </div>
                </Button>
                <ExtraSmall className='text-xs pb-2'>{note}</ExtraSmall>
            </CardFooter>
        </Card>
    )
}

