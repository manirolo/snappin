import React from 'react'
import DialogContent, { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogDescription} from "@snappin/ui/components/dialog"
import { Icon } from '@iconify/react'
import { Button } from '@snappin/ui/components/button'
import { useOAuthRedirect } from '../../auth/redirectToOAuthScreen'
import { AppCategory, AppSlug, AppType } from '@snappin/shared/apps/app.schema'
import { Spinner } from "@snappin/ui/assets/svg/spinner"

export const IntegrationDetailsWrapper = ({ children, name, description, icon, appSlug, appCategory, appType } : {
    children: React.ReactNode,
    name: string,
    icon: string,
    description: string,
    appSlug: AppSlug,
    appCategory: AppCategory,
    appType: AppType
}) => {
    
    const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className='max-w-3xl' showCloseButton={false}>
                <DialogHeader>
                    <div className='flex justify-between'>
                        <div className='inline-flex items-start gap-6'>
                            <div className="size-8">
                                <Icon icon={icon} className='w-full h-full'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <DialogTitle className='font-medium tracking-[-0.2px]'>{description}</DialogTitle>
                                <DialogDescription>{name}</DialogDescription>
                            </div>
                        </div>

                        <div>
                            <Button size={"lg"} variant="warning" disabled={loading == appSlug} onClick={() => redirectToOAuthConsentScreen({ appSlug, appCategory, appType })}>
                                {loading == appSlug && <Spinner />} Connect
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
