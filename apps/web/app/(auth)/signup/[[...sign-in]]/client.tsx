"use client"

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { Logo } from '@snappin/ui/components/logo'
import { H3, Paragraph } from '@snappin/ui/components/ui/typography'
import { Button } from '@snappin/ui/components/ui/button'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export const Client = () => {
    const [loading, setLoading] = useState(false);
    return (
        <div className="min-h-screen xl:w-1/2 flex w-full flex-col items-center justify-center md:flex-row p-2">
            <SignUp.Root>
                <SignUp.Step name='start' className='bg-card p-10 rounded-3xl max-w-lg shadow-sm shadow-base-content'>
                    {/* Sign up or sign in page header */}
                    <div className='flex flex-col gap-2 mb-8'>
                        <Logo className='mb-3' />
                        <H3>Welcome to Snappin</H3>
                        <Paragraph>Create a free account to extract your invoices from mails</Paragraph>
                    </div>

                    <div>
                        <Clerk.GlobalError className="block text-sm text-red-400" />
                    </div>

                    <div>
                        <Clerk.Connection name='google' asChild>
                            <Button
                                variant={"outline"}
                                size={"lg"}
                                disabled={loading}
                                className='w-full'
                                onClick={() => setLoading(true)}>
                                <Icon icon="flat-color-icons:google" width={20} height={20} className='mr-2' />
                                Sign up with Google
                            </Button>
                        </Clerk.Connection>
                    </div>
                    <div>
                        <SignUp.Captcha />
                    </div>
                </SignUp.Step>
            </SignUp.Root>
        </div>
    )
}
