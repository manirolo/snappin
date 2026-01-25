"use client"

import React, { useState } from 'react'
import { Table as T, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@snappin/ui/components/table"
import { Switch } from "@snappin/ui/components/switch"
import { Badge, BadgeDot } from "@snappin/ui/components/badge"
import { Button } from "@snappin/ui/components/button"
import { useEmailAccount } from '../_hooks/useEmailAccount'
import { Paragraph, Small } from '@snappin/ui/components/typography'
import { Icon } from '@iconify/react'
import { trpc } from '@snappin/api/react/client'
import { AppSlug } from '@snappin/shared/apps/app.enum'
import { appMetadata } from '@snappin/apps/app.metadata'

export const Table = () => {
    const { data } = useEmailAccount();
    const utils = trpc.useUtils()
    const [processingId, setProcessingId] = useState<string | null>(null)

    const deleteIntegration = trpc.integration.removeIntegration.useMutation({
        onMutate({ integrationId }) {
            setProcessingId(integrationId)
        },
        onSuccess() {
            utils.integration.getIntegration.invalidate()
        },
        onSettled() {
            setProcessingId(null)
        },
    })

    const toggleWatchClient = trpc.integration.updateIntegration.useMutation({
        onSuccess() {
            utils.integration.getIntegration.invalidate()
        },
    })

    const removeIntegration = (integrationId: string, appSlug: AppSlug) => {
        deleteIntegration.mutate({ integrationId, appSlug })
    }

    const toggleWatch = (integrationId: string, currentStatus: boolean) => {
        console.log("Hit toggle watch")
        toggleWatchClient.mutate({ integrationId, mailMonitored: !currentStatus })
    }

    return (
        <div className="rounded-xl bg-white">
            <T>
                <TableHeader className='[&_tr]:border-b-0'>
                    <TableRow className='hover:bg-transparent'>
                        <TableHead>Account</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Monitoring</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data && data.map((_, i) => (
                        <TableRow key={i} className="bg-white hover:bg-gray-1 border-b-12 border-transparent">
                            <TableCell className='rounded-l-lg'>
                                <div className='flex items-center gap-4 ml-4 py-2'>
                                    <div>
                                        <Icon icon={appMetadata[_.appSlug].icon} className='size-6' />
                                    </div>
                                    <div>
                                        <div className='capitalize'>
                                            <Paragraph className='text-[1rem] font-semibold'>{_.appSlug}</Paragraph>
                                        </div>
                                        <div>
                                            <Small>{_.identifierEmail}</Small>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={"primary"} appearance="light" className="capitalize">
                                    <BadgeDot />
                                    {_.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Switch checked={_.mailMonitored} onCheckedChange={() => toggleWatch(_._id, _.mailMonitored)} className='cursor-pointer scale-110' />
                            </TableCell>
                            <TableCell className='rounded-r-lg'>
                                <Button onClick={() => removeIntegration(_._id, _.appSlug)} variant={"destructive"} size={"sm"}>
                                    {processingId === _._id ? (
                                        <Icon icon="lucide:loader-2" className="animate-spin size-4" />
                                    ) : (
                                        "Remove"
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </T>
        </div>
    )
}
