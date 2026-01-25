"use client"

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { Button } from '@snappin/ui/components/button'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export const Client = () => {
    const [loading, setLoading] = useState(false);
    return (
        <SignIn.Root>
            <SignIn.Step name='start' className='sm:w-fit'>
                <div>
                    <Clerk.GlobalError className="block text-sm text-red-400" />
                </div>
                <div className='w-full'>
                    <Clerk.Connection name='google' asChild>
                        <Button
                            variant={"outline"}
                            size={"lg"}
                            disabled={loading}
                            className='min-w-xs flex-1 sm:min-w-sm mx-auto md:min-w-md min-h-16 font-semibold rounded-xl text-lg tracking-tight'
                            onClick={() => setLoading(true)}>
                            <Icon icon="flat-color-icons:google" className='size-8 mr-2' />
                            Continue with Google
                        </Button>
                    </Clerk.Connection>
                </div>
            </SignIn.Step>
            <SignIn.Step name='sso-callback'>
                <div>
                    <SignIn.Captcha />
                </div>
            </SignIn.Step>
        </SignIn.Root>
    )
}
