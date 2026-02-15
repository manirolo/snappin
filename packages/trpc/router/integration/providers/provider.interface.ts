export type GetRawMailBody = {
    emailAddress: string
    historyId: number
    accessToken?: string
}

export interface GmailOAuthProvider {
    getMessageIdsByHistory(payload: GetRawMailBody): void
}
