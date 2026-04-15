import { RevokeTokenProps } from "../../appRegistry.interface"
import { google } from "../googleDrive.client"

export async function revokeToken({ token }: RevokeTokenProps) {
    await google.revokeToken(token)
}