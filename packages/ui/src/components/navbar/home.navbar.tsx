import { LogoSymbol } from "../logo";
import {
  DashboardOrLogin,
  NavigationLinks,
} from "./navbar.client";

export const HomeNavbar = () => {
  return (
    <div className="min-h-20">
      <div className="fixed left-0 right-0 top-0 z-99 xl:px-0">
        <div className="flex items-center bg-sidebar text-white rounded-3xl gap-1 mt-8 p-2 px-3 justify-between max-w-106.5 mx-auto">
          <div>
            <LogoSymbol>Snappin</LogoSymbol>
          </div>
          <NavigationLinks />
          <DashboardOrLogin />
        </div>
      </div>
    </div>
  );
};
