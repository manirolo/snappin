import { Logo } from '@snappin/ui/components/logo'
import { ExtraSmall, H3 } from '@snappin/ui/components/typography'
import Link from 'next/link'
import React from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='max-h-screen'>
            <div className='mx-7 my-5 hidden md:flex items-center gap-2'>
                <Logo darkLogo />
            </div>
            <div className="min-h-[40vh] flex w-full flex-col items-center justify-center gap-6 p-2">

                {/* Sign up or sign in page header */}
                <div className='text-center mb-8'>
                    <H3>Welcome to Snappin</H3>
                </div>

                {children}
            </div>

            <footer className='absolute left-1/2 -translate-x-1/2 text-center bottom-10'>
                <ExtraSmall>
                    By signing up you agree to our {" "}
                    <Link href={"/terms"} className='font-semibold text-gray-11 transition-all duration-300 hover:bg-gray-3 p-0.5 rounded-md'>Terms and conditions</Link> and {" "}
                    <Link href={"/privacy"} className='font-semibold text-gray-11 transition-all duration-300 hover:bg-gray-3 p-0.5 rounded-md'>Privacy policy</Link>
                </ExtraSmall>
            </footer>

        </div>
    )
}
