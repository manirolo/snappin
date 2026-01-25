import { RevokeTokenProps } from "../../appRegistry.interface"
import { google } from "../config"

export async function revokeToken({ token }: RevokeTokenProps) {
    await google.revokeToken(token)
}