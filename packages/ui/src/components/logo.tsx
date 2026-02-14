import React from 'react'
import { cn } from '../lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export const Logo = ({ className, darkLogo = false, onClickRedirectLink }: { className?: string, darkLogo?: boolean, onClickRedirectLink?: string }) => {
    return (
        <div className="">
            <Link href={onClickRedirectLink || '/'} className={cn("relative inline-block shrink-0 w-28 h-8", className)}>
                <Image 
                    src={darkLogo ? '/images/snappin_dark_light.png' : '/images/snappin_logo_light.png'}
                    fill
                    className="object-contain"
                    alt='Snappin' 
                />
            </Link>
        </div>
    )
}

export const LogoSymbol = ({ className, onClickRedirectLink }: { className?: string, onClickRedirectLink?: string }) => (
    <Link href={onClickRedirectLink || '/'} className={cn("relative inline-block shrink-0 w-7 h-7", className)}>
        <Image 
            src={'/images/favicon.png'} 
            fill
            className="object-contain"
            alt='Snappin' 
        />
    </Link>
)
