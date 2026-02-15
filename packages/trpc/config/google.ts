import { google } from "googleapis"
import type { OAuth2Client } from "google-auth-library"
import { env } from "@snappin/env"

export const googleApi: OAuth2Client = new google.auth.OAuth2(
  env.google.clientId,
  env.google.clientSecret,
)
