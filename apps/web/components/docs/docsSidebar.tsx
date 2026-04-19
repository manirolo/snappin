"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  docsConfig,
  type SidebarGroup as SidebarGrp,
} from "../../app/(docs)/docs/docs.config";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@snappin/ui/components/sidebar";
import { LogoSymbol } from "@snappin/ui/components/logo";

export function DocsSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    return pathname === "/docs" || pathname == `/docs/${slug}` || pathname === `/docs/${slug}/`;
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0">
        <SidebarHeader>
          <div className="flex items-center gap-3 py-1.5 pt-4 px-4">
            <LogoSymbol />
            <span className="text-fg-1/50">/</span>
            <Link href={"/docs"} className="font-normal cursor-default bg-bg-1 border border-bg-4 p-0.75 px-1.5 text-xs rounded-md">
              Docs
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {docsConfig.sidebar.map((group: SidebarGrp) => (
            <SidebarGroup key={group.title} className="px-2 list-none">
              <SidebarGroupLabel className="font-medium lg:text-sm">
                {group.title}
              </SidebarGroupLabel>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.slug}>
                  <Link href={"/docs/" + item.slug}>
                    <SidebarMenuButton isActive={isActive(item.slug)} className="font-normal">
                      {item.title}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <main className="w-full">{children}</main>
    </SidebarProvider>
    // <nav className="sticky top-14 h-[calc(100vh-56px)] w-[260px] shrink-0 overflow-y-auto border-r border-gray-200 px-4 py-6">
    //   <div className="flex flex-col gap-6">
    //     {docsConfig.sidebar.map((group: SidebarGroup) => (
    //       <div key={group.title}>
    //         <h4 className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
    //           {group.title}
    //         </h4>
    //         <ul className="flex flex-col gap-0.5">
    //           {group.items.map((item) => {
    //             const active = isActive(item.slug);
    //             return (
    //               <li key={item.slug}>
    //                 <Link
    //                   href={`/docs/${item.slug}`}
    //                   className={`block text-[13px] font-medium py-1.5 px-3 rounded-md transition-colors ${
    //                     active
    //                       ? "text-blue-500 bg-blue-50 border-l-2 border-blue-500"
    //                       : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    //                   }`}
    //                 >
    //                   {item.title}
    //                 </Link>
    //               </li>
    //             );
    //           })}
    //         </ul>
    //       </div>
    //     ))}
    //   </div>
    // </nav>
  );
}
