import { Client } from "@microsoft/microsoft-graph-client"
import * as arctic from "arctic"
import { outlookConfig } from "./outlook.config"

export const outlook = new arctic.MicrosoftEntraId("common", outlookConfig.clientId, outlookConfig.clientSecret, outlookConfig.callbackUrl)

export function getOutlookClient(accessToken: string) {
    return Client.init({
        authProvider: (done) => {
            done(null, accessToken)
        },
    })
}