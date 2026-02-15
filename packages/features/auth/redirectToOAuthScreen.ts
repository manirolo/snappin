"use client"

import { useState } from "react"
import { trpc } from "@snappin/trpc/react/client"
import { AppCategory, AppSlug, AppType } from "@snappin/shared/apps/app.enum"
import toast from "react-hot-toast"
import { env } from "@snappin/env"

type RedirectParams = {
    appSlug: AppSlug
    appCategory: AppCategory
    appType: AppType
    redirectAfterPath?: string
}

export function useOAuthRedirect() {
    const [loading, setLoading] = useState<AppSlug | null>(null)

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
        appCategory,
        appType,
        redirectAfterPath,
    }: RedirectParams): Promise<boolean> => {
        try {
        setLoading(appSlug)

        await mutation.mutateAsync({
            appSlug,
            appCategory,
            appType,
            redirectAfter: redirectAfterPath ? `${env.app_url}${redirectAfterPath}` : `${env.app_url}`,
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
