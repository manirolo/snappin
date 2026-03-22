import z from "zod";
import { AppCategory, AppRole, AppSlug, AppType, Provider, ZAppSlug } from "../apps/app.schema";
import { IntegrationStatus } from "./status.enum";
import { UserResource } from "../user/user.schema"
import { StorageOrganizationStrategy } from "./storage.schema";

export type BaseIntegration = {
  _id?: string | null

  userId: string
  orgId?: string | null

  accessToken?: string | null
  accessTokenExpiresAt?: string | null

  refreshToken?: string | null
  refreshTokenExpiresAt?: string | null

  reAuthenticationRequired?: boolean | null

  scope?: string[] | null

  provider?: Provider | null,
  appSlug?: AppSlug | null
  appCategory?: AppCategory | null
  appRole?: AppRole[] | null
  appType?: AppType | null

  identifierEmail?: string | null

  locked?: boolean | null
  lockedAt?: string | null

  status: IntegrationStatus | null

  user?: UserResource,

  lastActivityAt?: number | null
  createdAt?: number | null
  updatedAt?: number | null
}

export type IntegrationSnapshot = {
  id?: string | null;
  appSlug?: AppSlug | null;
  identifier?: string | null;
}

export const ZIntegrationSnapshot = z.object({
  id: z.string().optional().nullable(),
  appSlug: ZAppSlug.optional().nullable(),
  identifier: z.string().optional().nullable(),
});

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

export interface BaseStorageConfig {
  organization: {
    strategy: StorageOrganizationStrategy
  }
}

export type GoogleDriveConfig = BaseStorageConfig & {
  storageFolderId: string | null

}

export type GoogleDriveIntegration = BaseIntegration & {
  appSlug?: AppSlug.GOOGLE_DRIVE | null
  config: GoogleDriveConfig
}

export type XeroConfig = {
    tenantId?: string | null;
    orgName?: string | null;
}

export type XeroIntegration = BaseIntegration & {
  config: XeroConfig
}


export type StorageIntegrationResource = GoogleDriveIntegration
// | OneDriveIntegration  — add future storage providers here

export type WhatsAppConfig = {
    phone: string | null  
}

export type WhatsAppIntegration = BaseIntegration & {
    appSlug?: AppSlug.WHATSAPP | null
    config: WhatsAppConfig
}

export type StorageProviderMap = {
  [AppSlug.GOOGLE_DRIVE]: {
    config: GoogleDriveConfig
    integration: GoogleDriveIntegration
  }
}

export type AccountingProviderMap = {
    [AppSlug.XERO]: {
        integration: XeroIntegration;
        config: XeroConfig;
    }
}

export type IntegrationResource =
  | GmailIntegration
  | OutlookIntegration
  | GoogleDriveIntegration
  | XeroIntegration
  | WhatsAppIntegration


export const ZIntegration = z.custom<IntegrationResource>()