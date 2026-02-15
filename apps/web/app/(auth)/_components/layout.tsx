import { LogoSymbol } from '@snappin/ui/components/logo'
import { ExtraSmall, H3, Paragraph } from '@snappin/ui/components/typography'
import Link from 'next/link'
import React from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='max-h-screen'>
            <div className="min-h-[40vh] flex max-w-md mx-auto flex-col items-center justify-center p-2">
                <div className='my-5 w-full justify-center flex items-center gap-2'>
                    <LogoSymbol />
                </div>
                {/* Sign up or sign in page header */}
                <div className='text-center mb-12'>
                    <H3>Welcome</H3>
                    <Paragraph className='text-muted-foreground'>Sign in to your account to continue</Paragraph>
                </div>

                {children}
            </div>

            <footer className='absolute left-1/2 -translate-x-1/2 text-center bottom-10'>
                <ExtraSmall className='text-sm'>
                    By signing up you agree to our 
                    <Link href={"/terms"} className='font-semibold text-gray-11 transition-all duration-300 hover:bg-gray-3 p-0.5 rounded-md'>Terms and conditions</Link> and {" "}
                    <Link href={"/privacy"} className='font-semibold text-gray-11 transition-all duration-300 hover:bg-gray-3 p-0.5 rounded-md'>Privacy policy</Link>
                </ExtraSmall>

                <ExtraSmall className='text-xs text-muted-foreground mt-1'>
                    © {new Date().getFullYear()} Snappin. All rights reserved.
                </ExtraSmall>
            </footer>

        </div>
    )
}
