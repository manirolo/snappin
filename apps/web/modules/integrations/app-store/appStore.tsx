import {
  GroupIntegrationCard,
  GroupIntegrationContent,
} from "@snappin/features/integration/components/groupIntegrationCard";
import { GoogleDrive } from "./googleDrive";
import { Xero } from "./xero";

export const AppStore = () => {
  return (
    <div>
      <GroupIntegrationCard>
        <GroupIntegrationContent>
          <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 w-full">
            <GoogleDrive />
            <Xero />
          </div>
        </GroupIntegrationContent>
      </GroupIntegrationCard>
    </div>
  );
};
