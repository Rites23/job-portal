import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar";
import AppSidebarClient from "./_AppSidebarClient";
const HomePage = () => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">AI JOBS</span>
          </SidebarHeader>
          <SidebarContent></SidebarContent>
          <SidebarFooter>
            <SidebarMenuButton>Login</SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1">This is the main box</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};

export default HomePage;
