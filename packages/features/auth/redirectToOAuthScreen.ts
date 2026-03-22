"use client"

import { useState } from "react"
import { trpc } from "@snappin/features/trpc/react/client"
import { AppSlug, AppCategory, AppType, AppRole } from "@snappin/shared/apps/app.schema"
import { appMetadata } from "@snappin/apps/app.metadata"
import toast from "react-hot-toast"
import { env } from "@snappin/env"

type RedirectParams = {
    appSlug: AppSlug
    appCategory?: AppCategory
    appType?: AppType
    appRole?: AppRole[]
    redirectAfterPath?: string
    reAuthenticate?: {
        integrationId: string
    }
}

export function useOAuthRedirect() {
    const [loading, setLoading] = useState<AppSlug | null>(null)

    const getAppInfo = (appSlug: AppSlug) => {
        const app = appMetadata[appSlug]
        if (!app) throw new Error(`No metadata found for app: ${appSlug}`)
        return {
            appSlug: app.slug,
            appCategory: app.category,
            appType: app.type,
            appRole: app.role,
            isComing: app.isComingSoon ?? false
        }
    }

    const mutation = trpc.integration.createOAuthSession.useMutation({
        onSuccess(data) {
            window.location.href = data.redirectUrl
        },
        onError() {
            setLoading(null)
            toast.error("Failed to create secure auth session")
        },
    })

    const redirectToOAuthConsentScreen = async ({
        appSlug,
        redirectAfterPath,
        reAuthenticate,
    }: RedirectParams): Promise<boolean> => {
        try {
            setLoading(appSlug)

            const { isComing, ...appInfo } = getAppInfo(appSlug)

            if (isComing) {
                toast.error("This integration coming soon")
                setLoading(null)
                return false
            }

            await mutation.mutateAsync({
                ...appInfo,
                redirectAfter: redirectAfterPath
                    ? `${env.app_url}${redirectAfterPath}`
                    : `${env.app_url}`,
                ...(reAuthenticate && { reAuthenticate }),
            })

            return true
        } catch {
            return false
        }
    }

    return {
        redirectToOAuthConsentScreen,
        loading,
        isLoading: mutation.isPending,
    }
}