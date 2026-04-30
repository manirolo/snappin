"use client";

import { LogoSymbol } from "../logo";
import { DashboardOrLogin, NavigationLinks } from "./navbar.client";

// ─── HomeNavbar ───────────────────────────────────────────────────────────────
// The hamburger and dropdown both live here so the dropdown can sit inside the
// same max-w-lg container and naturally stretch to the full navbar width.

export const HomeNavbar = () => {
  // const [open, setOpen] = useState(false);

  return (
    <div className="min-h-20 z-10">
      <div className="fixed top-0 left-0 right-0 z-50 px-4 xl:px-0">
        <div className="relative w-full bg-background/70 backdrop-blur-xs  min-h-12 sm:min-h-15 flex items-center">
          {/* ── Navbar pill ── */}
          <div className="flex z-40! items-center w-full max-w-4xl mx-auto gap-1 justify-between">
            <LogoSymbol>Snappin App</LogoSymbol>
            <NavigationLinks />

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
