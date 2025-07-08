import { serve } from "inngest/next";
import { inngest } from "@/services/inngest/client";
import {
  clerkCreateUser,
  clerkDeleteUser,
  clerkUpdateUser,
  clerkCreateOrgMembership,
  clerkDeleteOrgMembership,
  clerkCreateOrganization,
  clerkUpdateOrganization,
  clerkDeleteOrganization,
} from "@/services/inngest/functions/clerk";

// Serve all Clerk-related Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkDeleteUser,
    clerkUpdateUser,
    clerkCreateOrganization,
    clerkDeleteOrganization,
    clerkUpdateOrganization,
    clerkCreateOrgMembership, 
    clerkDeleteOrgMembership, 
  ],
});
