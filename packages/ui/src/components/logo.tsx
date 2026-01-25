import React from 'react'
import Image from 'next/image'
import { cn } from '../lib/utils'
import Link from 'next/link'

export const Logo = ({ className, size, darkLogo = false, onClickRedirectLink }: { className?: string, logoText?: React.ReactNode, darkLogo?: boolean, showLogoText?: boolean, size?: number, onClickRedirectLink?: string }) => {
    return (
        <Link href={onClickRedirectLink || '/'} className='relative flex items-center gap-2'>
            <Image src={darkLogo ? '/images/snappin_dark_light.png' : '/images/snappin_logo_light.png'} className={cn("w-full", className)} alt='Snappin' width={size || 96} height={size && size - 15 || 30} />
        </Link>
    )
}
