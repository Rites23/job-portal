import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  const { userId } = await auth();

  return (
    <SidebarUserButtonClient
      user={{ email: "ritesh.balu@gmail.com", name: "Ritesh Balu", imageUrl: "" }}
    />
  );
}
