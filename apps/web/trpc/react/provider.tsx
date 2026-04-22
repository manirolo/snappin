"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@snappin/features/trpc/react/client"
import { useState } from "react"
import { httpBatchLink } from "@trpc/client"

export function TRPCProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `/api/v1/trpc`,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
