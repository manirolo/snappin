import z from "zod";
import { AppCategory, AppRole, AppSlug, AppType, Provider, ZAppSlug } from "../apps/app.schema";
import { IntegrationStatus } from "./status.enum";
import { UserResource } from "../user/user.schema"
import { StorageOrganizationStrategy } from "./storage.schema";

export enum StatusReason {
  PLAN_DOWNGRADE = "plan_downgrade"
}

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
  appRoles?: AppRole[] | null
  appType?: AppType | null

  identifierEmail?: string | null

  locked?: boolean | null
  lockedAt?: string | null

  status: IntegrationStatus | null
  statusReason?: StatusReason | null

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

export type GmailMetadata = {
  historyId: number | null
  watchExpiresAt?: string | null
}

export type GmailIntegration = BaseIntegration & {
  appSlug?: AppSlug.GMAIL | null
  metadata: GmailMetadata
}

export type OutlookMetadata = {
  subscriptionId?: string | null
  subscriptionExpiresAt?: string | null
}

export type OutlookIntegration = BaseIntegration & {
  appSlug?: AppSlug.OUTLOOK | null
  metadata: OutlookMetadata
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
    metadata: GmailMetadata;
    webhookPayload: GmailWebhookPayload;
    integration: GmailIntegration;
    resolveMessageInput: {
      historyId?: number | null;
    };
  };

  [AppSlug.OUTLOOK]: {
    metadata: OutlookMetadata;
    webhookPayload: OutlookWebhookPayload;
    integration: OutlookIntegration;
    resolveMessageInput: {
      messageId?: string | null;
    };
  };
};

export interface BaseStorageMetadata {
  organization: {
    strategy: StorageOrganizationStrategy
  }
}

export type GoogleDriveMetadata = BaseStorageMetadata & {
  storageFolderId: string | null
}

export type GoogleDriveIntegration = BaseIntegration & {
  appSlug?: AppSlug.GOOGLE_DRIVE | null
  metadata: GoogleDriveMetadata
}

export type XeroMetadata = {
  tenantId?: string | null;
  orgName?: string | null;
}

export type XeroIntegration = BaseIntegration & {
  metadata: XeroMetadata
}


export type StorageIntegrationResource = GoogleDriveIntegration
// | OneDriveIntegration  — add future storage providers here

export type WhatsAppMetadata = {
  phone: string | null
}

export type WhatsAppIntegration = BaseIntegration & {
  appSlug?: AppSlug.WHATSAPP | null
  metadata: WhatsAppMetadata
}

export type StorageProviderMap = {
  [AppSlug.GOOGLE_DRIVE]: {
    metadata: GoogleDriveMetadata
    integration: GoogleDriveIntegration
  }
}

export type AccountingProviderMap = {
  [AppSlug.XERO]: {
    integration: XeroIntegration;
    metadata: XeroMetadata;
  }
}

export type IntegrationResource =
  | GmailIntegration
  | OutlookIntegration
  | GoogleDriveIntegration
  | XeroIntegration
  | WhatsAppIntegration


export const ZIntegration = z.custom<IntegrationResource>()