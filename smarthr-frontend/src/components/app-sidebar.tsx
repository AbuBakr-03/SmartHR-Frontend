import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { Link } from "react-router-dom";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
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
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/dashboard",
        },
        {
          title: "Companies",
          url: "/dashboard/companies",
        },
        {
          title: "Departments",
          url: "/dashboard/departments",
        },
        {
          title: "Job Openings",
          url: "/dashboard/jobs",
        },
        {
          title: "Applications",
          url: "/dashboard/applications",
        },
        {
          title: "Interview Sessions",
          url: "/dashboard/interviews",
        },
        {
          title: "Predicted Candidates",
          url: "/dashboard/predicted-candidates",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authContext = useAuth();
  const { auth } = authContext;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={"/dashboard"}>
                <span className="text-base font-semibold">SmartHR Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={auth.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
