"use client";

import { LogoSymbol } from "../logo";
import { DashboardOrLogin, NavigationLinks } from "./navbar.client";

// ─── HomeNavbar ───────────────────────────────────────────────────────────────
// The hamburger and dropdown both live here so the dropdown can sit inside the
// same max-w-lg container and naturally stretch to the full navbar width.

export const HomeNavbar = () => {
  // const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="px-4 xl:px-0">
        <div className="fixed top-0 left-0 right-0 bg-background/90 z-20 border-b border-bg-2 w-full backdrop-blur-xs min-h-12 sm:min-h-15 flex items-center">
          {/* ── Navbar pill ── */}
          <div className="flex z-40! max-w-6xl mx-auto items-center w-full justify-between">
            <div className="flex gap-12 items-center">
              <LogoSymbol>Snappin App</LogoSymbol>
              <NavigationLinks />
            </div>

            <div className="flex gap-4 items-center">
              {/* Desktop auth */}
              <DashboardOrLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
