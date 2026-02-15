"use client"

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { Button } from '@snappin/ui/components/button'
import { DotSpinner } from '@snappin/ui/assets/svg/dotSpinner'
import { Icon } from '@iconify/react'
import { useState } from 'react'

enum AuthProviders {
    GOOGLE = "google"
}

export const Client = () => {
    const [loading, setLoading] = useState<AuthProviders | null>(null);
    return (
        <SignUp.Root>
            <SignUp.Step name='start' className='sm:w-fit'>
                <div>
                    <Clerk.GlobalError className="block text-sm text-red-400" />
                </div>
                <div className='w-full'>
                    <Clerk.Connection name='google' asChild>
                        <Button
                            variant={"outline"}
                            size={"_2xl"}
                            radius={"full"}
                            disabled={loading == AuthProviders.GOOGLE || loading != null}
                            className='min-w-xs flex-1 sm:min-w-sm mx-auto md:min-w-102 font-bold text-lg font-dm-sans'
                            onClick={() => setLoading(AuthProviders.GOOGLE)}>
                                <div className='flex items-center gap-2'>
                                    {loading == AuthProviders.GOOGLE ? <DotSpinner className='size-10 text-gray-6' gap={3.5}/> : (
                                        <div className='flex items-center gap-2'>
                                            <Icon icon="flat-color-icons:google" className='size-9 mr-2' /> Continue with Google
                                        </div>
                                    )}
                                    
                                </div>
                        </Button>
                    </Clerk.Connection>
                </div>
            </SignUp.Step>
            <SignUp.Captcha />
        </SignUp.Root>
        
    )
}