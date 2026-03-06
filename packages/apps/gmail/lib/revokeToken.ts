import { RevokeTokenProps } from "../../appRegistry.interface"
import { google } from "../gmail.client"

export async function revokeToken({ token }: RevokeTokenProps) {
    await google.revokeToken(token)
}