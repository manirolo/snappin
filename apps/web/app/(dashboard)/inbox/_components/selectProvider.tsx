"use client"

import { Icon } from '@iconify/react'
import { trpc } from '@snappin/api/react/client'
import { env } from '@snappin/env'
import { Button } from '@snappin/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@snappin/ui/components/dropdown-menu'
import React from 'react'
import { appMetadata } from '@snappin/apps/app.metadata'
import { AppCategory, AppSlug } from '@snappin/shared/apps/app.enum'

export const SelectProvider = () => {
    const createOAuthSession = trpc.integration.createOAuthSession.useMutation({
        onSuccess(data) {
            window.location.href = data.redirectUrl;
        },
    });

    const redirectToOAuthConsentScreen = ({ appSlug, appCategory }: { appSlug: AppSlug, appCategory: AppCategory }) => {
        createOAuthSession.mutate({
            appSlug,
            appCategory,
            redirectAfter: `${env.app_url}/inbox`
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    Add an account
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onSelect={() => redirectToOAuthConsentScreen({ appSlug: AppSlug.GMAIL, appCategory: AppCategory.EMAIL })}>
                        <Icon icon={appMetadata[AppSlug.GMAIL].icon} />
                        Google
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
