import z from "zod";
import { AppCategory, AppSlug, AppType } from "../apps/app.enum";
import { IntegrationStatus } from "./status.enum";

export type BaseIntegration = {
  _id?: string | null

  userId?: string | null
  orgId?: string | null

  accessToken?: string | null
  accessTokenExpiresAt?: Date | null

  refreshToken?: string | null
  refreshTokenExpiresAt?: Date | null

  reAuthenticationRequired?: boolean | null

  scope: string[] | null

  appSlug?: AppSlug | null
  appCategory?: AppCategory | null
  appType?: AppType | null

  identifierEmail?: string | null

  locked: boolean | null
  lockedAt: Date | null

  status: IntegrationStatus | null

  createdAt?: number | null
  updatedAt?: number | null
}

export type GmailConfig = {
  mailMonitored: boolean
  historyId: number | null
  watchExpiresAt?: string | null
}

export type GmailIntegration = BaseIntegration & {
  appSlug?: AppSlug.GMAIL | null
  config: GmailConfig
}

export type OutlookConfig = {
  mailMonitored?: boolean | null
  subscriptionId?: string | null
  subscriptionExpiresAt?: string | null
}

export type OutlookIntegration = BaseIntegration & {
  appSlug?: AppSlug.OUTLOOK | null
  config: OutlookConfig
}

export type IntegrationResource =
  | GmailIntegration
  | OutlookIntegration

export type GmailWebhookPayload = {
  message?: {
    data?: string
  };
};

export type OutlookWebhookNotification = {
  subscriptionId: string;
  resourceData?: {
    id?: string;
  };
};

export type OutlookWebhookPayload = {
  value?: OutlookWebhookNotification[];
};

export type EmailProviderMap = {
  [AppSlug.GMAIL]: {
    config: GmailConfig;
    webhookPayload: GmailWebhookPayload;
    integration: GmailIntegration;
    resolveMessageInput: {
      historyId?: number | null;
    };
  };

  [AppSlug.OUTLOOK]: {
    config: OutlookConfig;
    webhookPayload: OutlookWebhookPayload;
    integration: OutlookIntegration;
    resolveMessageInput: {
      messageId?: string | null;
    };
  };
};


export const ZIntegration = z.custom<IntegrationResource>()