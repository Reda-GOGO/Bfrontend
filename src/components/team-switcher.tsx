import * as React from "react";
// import { ChevronsUpDown, Plus } from "lucide-react"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
// SidebarMenu,
// SidebarMenuButton,
// SidebarMenuItem,
// useSidebar,
// } from "@/components/ui/sidebar"
import logo from "@/assets/B13LOGO2.png";
export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  // const { isMobile } = useSidebar()
  const [activeTeam, _] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
          <div className="rounded-full w-full h-full bg-white">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{/**/ activeTeam.name}</span>
          <span className="truncate text-xs">{activeTeam.plan}</span>
        </div>
      </div>
    </>
  );
}
