import { db } from "@snappin/db/index"   

type CtxOverrides = {
    userId?: string | null
    orgId?: string | null
    orgRole?: string | null
}

export const ctxPresets = {
    member: {
        userId: "user_123",
        orgId: "org_abc",
        orgRole: "org:member",
    },
    admin: {
        userId: "user_123",
        orgId: "org_abc",
        orgRole: "org:admin",
    },
    noOrg: {
        userId: "user_123",
        orgId: null,
        orgRole: null,
    },
    unauthenticated: {
        userId: null,
        orgId: null,
        orgRole: null,
    },
}

export function makeCtx(
    preset: keyof typeof ctxPresets = "member",
    overrides: CtxOverrides = {}
) {
    return {
        ...ctxPresets[preset],
        ...overrides,
        db,             
    }
}