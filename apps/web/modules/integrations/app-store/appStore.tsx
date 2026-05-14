import {
  GroupIntegrationCard,
  GroupIntegrationContent,
} from "@snappin/features/integration/components/groupIntegrationCard";
import { GoogleDrive } from "./googleDrive";
import { Xero } from "./xero";
import { Whatsapp } from "./whatsapp"

export const AppStore = () => {
  return (
    <div className="w-full">
      <GroupIntegrationCard>
        <GroupIntegrationContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 min-w-full gap-4">
            <GoogleDrive />
            <Xero />
            <Whatsapp />
          </div>
        </GroupIntegrationContent>
      </GroupIntegrationCard>
    </div>
  );
};
