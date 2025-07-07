"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
export const AppSidebarClient = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="p-2 border-b flex items-center gap-1">
          <SidebarTrigger />
          <span className="text-xl text-nowrap">AI JOBS</span>
        </div>
        <div className="flex-1 flex">{children}</div>
      </div>
    );
  }

  return children;
};
