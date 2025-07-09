import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function EmployerHomePage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return null;

  const jobListing = await getMostRecentJobListing(orgId);
  if (jobListing == null) {
    redirect("/employer/job-listings/new");
  } else {
    redirect(`/employer/job-listings/${jobListing.id}`);
  }
}

async function getMostRecentJobListing(orgId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}

//db.query.JobListingTable.findFirst({...})

// A call to your database using something like Drizzle ORM (assumption based on syntax).

// findFirst will return the first record that matches the condition.

//colums: {id: true} - "Only fetch the id column from the job listing."
