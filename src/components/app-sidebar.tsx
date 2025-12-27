import * as React from "react";
import {
  AudioWaveform,
  Command,
  Files,
  Frame,
  GalleryVerticalEnd,
  Layers2,
  LayoutDashboard,
  Map,
  Package,
  PieChart,
  Settings2,
  ShoppingCart,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Outlet, useLocation } from "react-router";
import { Toaster } from "@/components/ui/sonner";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "AGA B13 Sarl",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "/inventory",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },

    {
      title: "Products",
      url: "/products",
      icon: Package,
      // items: [
      //   {
      //     title: "Products List",
      //     url: "/products",
      //   },
      //   {
      //     title: "Inventory",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      // items: [
      //   {
      //     title: "Create an order",
      //     url: "/orders",
      //   },
      // ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: Layers2,
      // isActive: true,
    },
    {
      title: "Invoice",
      url: "/invoice",
      icon: Files,
      // isActive: true,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/setting",
        },
        {
          title: "Team",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {
          // <NavProjects projects={data.projects} />
        }
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
function usePageInfo() {
  const location = useLocation();

  // Split the pathname and filter out empty strings
  const segments = location.pathname.split("/").filter(Boolean);

  const firstSegment = segments[0] || ""; // Will be "" on "/"
  const isRoot = segments.length === 0;

  return { firstSegment, isRoot };
}
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
export function Layout() {
  const { firstSegment, isRoot } = usePageInfo();
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Toaster position="top-center" />
            <div className="sidebar-title w-full flex items-center justify-start">
              {/* <Breadcrumb> */}
              {/*   <BreadcrumbList> */}
              {/*     <BreadcrumbItem className="hidden md:block"> */}
              {/*       My Application */}
              {/*     </BreadcrumbItem> */}
              {/*     <BreadcrumbSeparator className="hidden md:block" /> */}
              {/*     <BreadcrumbItem> */}
              {/*       <BreadcrumbPage className="capitalize"> */}
              {/*         {isRoot ? "Dashboard" : firstSegment} */}
              {/*       </BreadcrumbPage> */}
              {/*     </BreadcrumbItem> */}
              {/*   </BreadcrumbList> */}
              {/* </Breadcrumb> */}
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex w-full items-center justify-center">
                  <div
                    className="flex border rounded-lg p-2 max-sm:pr-1 w-full max-w-200 cursor-pointer justify-between items-center"
                    onClick={() => setOpen(true)}
                  >
                    <p className="text-sm  text-muted-foreground truncate">
                      {" "}
                      Search in App ...
                    </p>
                    <p className="text-muted-foreground text-sm max-sm:text-xs">
                      Press{" "}
                      <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                        <span className="text-xs">⌘</span>J
                      </kbd>
                    </p>
                  </div>
                </div>
                <ThemeToggle />
                {/* <FullscreenToggle /> */}
              </div>
              <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                  className="focus"
                  placeholder="Type a command or search..."
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <Calendar />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <Smile />
                      <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                      <Calculator />
                      <span>Calculator</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>
                      <User />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <CreditCard />
                      <span>Billing</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <Settings />
                      <span>Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            </div>
          </div>
        </header>
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/themeContext";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="transition-all duration-300 rounded-full relative"
    >
      {/* Light Icon */}
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${theme === "light"
          ? "scale-100 rotate-0 opacity-100"
          : "scale-0 -rotate-90 opacity-0"
          }`}
      />

      {/* Dark Icon */}
      <Moon
        className={`h-5 w-5 transition-all duration-300 absolute ${theme === "dark"
          ? "scale-100 rotate-0 opacity-100"
          : "scale-0 rotate-90 opacity-0"
          }`}
      />
    </Button>
  );
}

import { useEffect, useState } from "react";
import { Expand, Minimize } from "lucide-react";

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detect fullscreen changes (F11, ESC, programmatic)
  useEffect(() => {
    function handleChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen();
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullscreen}
      className="relative transition-all rounded-full"
    >
      {/* Expand icon */}
      <Expand
        className={`h-5 w-5 transition-all duration-300 ${!isFullscreen
          ? "opacity-100 scale-100 rotate-0"
          : "opacity-0 scale-0 rotate-90"
          }`}
      />

      {/* Minimize icon */}
      <Minimize
        className={`absolute h-5 w-5 transition-all duration-300 ${isFullscreen
          ? "opacity-100 scale-100 rotate-0"
          : "opacity-0 scale-0 -rotate-90"
          }`}
      />
    </Button>
  );
}
