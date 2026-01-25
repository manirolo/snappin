"use client"

import { Button } from '../button';
import Link from 'next/link';
import { Small } from '../typography';

export type DashboardOrLoginResource = {
    isUserLoggedIn: boolean;
}

export const DashboardOrLogin = ({ isUserLoggedIn }: DashboardOrLoginResource) => {
    return (
        <div className='flex items-center gap-4'>
            <div className='block xl:hidden'>
                <Link href={"/"}><Small>Pricing</Small></Link>
            </div>
            {isUserLoggedIn ? (
                <Button size={"sm"} asChild><Link href={"/dashboard"}>Dashboard</Link></Button>
            ) : (
                <Button variant={"outline"} size={"sm"} asChild><Link href={"/login"}>Login</Link></Button>
            )}
        </div>
    )
}

export const NavigationLinks = () => {
    return (
        <div className='hidden xl:flex gap-10'>
            <Link href={"/pricing"}><Small>Pricing</Small></Link>
            <Link href={"/#faq"}><Small>FAQ</Small></Link>
            <Link href={"/features"}><Small>Features</Small></Link>
        </div>
    )
}