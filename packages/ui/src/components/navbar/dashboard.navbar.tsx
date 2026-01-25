'use client'

import { Logo } from '../logo'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu'
import { Avatar, AvatarImage } from '../avatar'
import { Small } from '../typography'
import Link from 'next/link'
import { SidebarTrigger } from '../sidebar'

type User = {
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    fullName?: string | null | undefined;
    imageUrl?: string | null | undefined;
    primaryEmailAddress?: { emailAddress: string | null | undefined } | null | undefined;
}

export const DashboardNavbar = ({ user, signOut }: { user: User, signOut: () => void }) => {
    return (
        <div className='md:hidden flex items-center justify-between py-2.5 px-4 border-b'>
            <div className='flex items-center gap-2'>
                <SidebarTrigger />
                <div className='flex items-center gap-6'>
                    <Logo darkLogo />
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className='hover:bg-gray-4 rounded-md transition-all duration-300 p-1 cursor-pointer flex items-center gap-2'>
                    <div className='flex gap-2 items-center'>
                        <Avatar className='size-5'>
                            <AvatarImage src={user?.imageUrl ?? ''} alt={user?.firstName || 'User'} />
                        </Avatar>
                        <Small className='text-foreground'>
                            {user?.fullName}
                        </Small>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuGroup>
                        <DropdownMenuItem className='flex-col items-start gap-0 text-start justify-start'>
                            <Small>{user?.fullName}</Small>
                            <Small>{user?.primaryEmailAddress?.emailAddress}</Small>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/account/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/buy">Buy credits</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/affiliate">Affiliate (30%)</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut()}>
                        Sign Out
                    </DropdownMenuItem>
                    <DropdownMenuGroup>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
