import {
  GroupIntegrationCard,
  GroupIntegrationContent,
} from "@snappin/features/integration/components/groupIntegrationCard";
import { GoogleDrive } from "./googleDrive";
import { Xero } from "./xero";

export const AppStore = () => {
  return (
    <div className="w-full">
      <GroupIntegrationCard>
        <GroupIntegrationContent>
          <div className="grid grid-cols-1 md:grid-cols-4 min-w-full gap-4">
            <GoogleDrive />
            <Xero />
          </div>
        </GroupIntegrationContent>
      </GroupIntegrationCard>
    </div>
  );
};
