"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "./client"
import { httpBatchLink } from "@trpc/client"
import { useState } from "react"

export function TRPCProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/v1/trpc",
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
