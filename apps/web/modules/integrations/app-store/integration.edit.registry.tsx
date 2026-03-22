import { AppSlug } from "@snappin/shared/apps/app.schema";
import { EditGoogleDrive } from "./googleDrive";
import React from "react";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";

export type EditViewRef = {
  save: () => void | Promise<void>;
  isPending?: boolean;
};

export type EditViewProps = {
  integration: IntegrationResource
  onDirtyChange: (dirty: boolean) => void
  onSavingChange: (saving: boolean) => void
}

export const IntegrationEditRegistry: Partial<
  Record<
    AppSlug,
    React.ForwardRefExoticComponent<
      EditViewProps & React.RefAttributes<EditViewRef>
    >
  >
> = {
  [AppSlug.GOOGLE_DRIVE]: EditGoogleDrive,
};
