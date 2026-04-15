import { Attachment02Icon } from '@hugeicons-pro/core-bulk-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@snappin/ui/components/empty'
import React from 'react'

export const InvoiceAttachmentEmpty = () => {
  return (
    <Empty>
        <EmptyHeader>
            <EmptyMedia>
                <HugeiconsIcon icon={Attachment02Icon} className="size-10 text-primary"/>
            </EmptyMedia>
            <EmptyTitle>No attachment</EmptyTitle>
            <EmptyDescription>There is no attachments found for this document</EmptyDescription>
        </EmptyHeader>
    </Empty>
  )
}
