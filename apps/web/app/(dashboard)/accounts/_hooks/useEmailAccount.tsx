"use client"

import { trpc } from "@snappin/api/react/client"
import { AppCategory } from "@snappin/shared/apps/app.enum"

export const useEmailAccount = () => {
    return trpc.integration.getIntegration.useQuery({ appCategory: AppCategory.EMAIL})
}