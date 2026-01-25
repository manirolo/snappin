import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "../_root"

export const trpc = createTRPCReact<AppRouter>()