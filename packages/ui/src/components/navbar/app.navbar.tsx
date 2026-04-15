import { Logo } from "../logo";
import { SidebarTrigger } from "../sidebar";

export const AppNavbar = () => {
  return (
    <div className="flex xl:hidden justify-between bg-background border-b items-center min-h-14 px-4">
      <div className="flex items-center xl:hidden gap-1">
        <Logo />
      </div>
      <div>
        <div className="xl:hidden"><SidebarTrigger /></div>
      </div>
    </div>
  );
};
