"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@snappin/ui/components/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@snappin/ui/components/avatar'
import { ExtraSmall, Small } from '@snappin/ui/components/typography'
import { Invoice01Icon, ShoppingCart01Icon, User03Icon, Logout03Icon, Book04Icon, AddCircleHalfDotIcon } from "@hugeicons-pro/core-bulk-rounded"
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAuth, useUser } from '@clerk/nextjs'

export const User = () => {
    const { user } = useUser()
    const { signOut } = useAuth()
    const nav = [
        { label: "Profile", icon: User03Icon, href: "/account/settings" },
        { label: "Buy Credit", icon: ShoppingCart01Icon, href: "/account/credit" },
        { label: "Billing", icon: Invoice01Icon, href: "/account/billing" },
        { label: "Documentation", icon: Book04Icon, href: "/account/billing" },
        { label: "Join Affiliate (30%)", icon: AddCircleHalfDotIcon, href: "/account/billing" },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='hover:bg-sidebar-accent transition-all duration-300 cursor-pointer m-0.5 p-2 rounded-md'>
                <div className='flex items-center gap-2 text-start'>
                    <Avatar className='size-8'>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col justify-center gap-0 max-w-40'>
                        <Small className='text-sidebar-foreground/90 font-medium leading-4 truncate'>{user?.fullName}</Small>
                        {user?.primaryEmailAddress && <ExtraSmall className='text-sidebar-foreground/40 truncate'>{user?.primaryEmailAddress.emailAddress}</ExtraSmall>}
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right' sideOffset={34} align='end' className='min-w-50'>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <div className='flex items-center gap-2 text-start'>
                            <div className='flex flex-col justify-center gap-0 max-w-48'>
                                <Small className='text-gray-12 font-medium leading-4 truncate'>{user?.fullName}</Small>
                                {user?.primaryEmailAddress && <ExtraSmall className='truncate '>{user?.primaryEmailAddress.emailAddress}</ExtraSmall>}
                            </div>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {nav.map((_, i) => (
                        <DropdownMenuItem asChild key={i}>
                            <Link href={_.href} className='flex items-center gap-1 cursor-pointer'>
                                <HugeiconsIcon icon={_.icon} />
                                <span className="font-semibold">{_.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut()} asChild>
                    <div className='flex items-center gap-1 cursor-pointer text-red-500 hover:bg-red-100'>
                        <HugeiconsIcon icon={Logout03Icon} />
                        Sign Out
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}