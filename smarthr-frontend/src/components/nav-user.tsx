"use client";
import { LogOut } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useLogout from "@/hooks/useLogout";

export function NavUser() {
  const logout = useLogout();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-red-100"
        >
          <div className="flex items-center space-x-2" onClick={() => logout()}>
            <LogOut className="-ml-1 h-4 w-4 text-red-500" />
            <span className="font-medium text-red-500"> Log out</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
