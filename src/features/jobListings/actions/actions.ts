"use server";

import { z } from "zod";
import { jobListingSchema } from "./schemas";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { redirect } from "next/navigation";
import {
  insertJobListing,
  updateJobListing as updateJobListingDb,
  deleteJobListing as deleteJobListingDb,
} from "../db/jobListings";
import { db } from "@/drizzle/db";
import { eq, and } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import {
  getJobListingIdTag,
  getJobListingGlobalTag,
} from "../db/cache/jobListings";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { revalidateTag } from "next/cache";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxPublishedJobListings,
  hasReachedMaxFeaturedJobListings,
} from "../lib/planfeatureHelpers";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (
    orgId == null ||
    !(await hasOrgUserPermission("job_listings:job_listings_create"))
  ) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  // Revalidate cache after creation
  revalidateTag(getJobListingIdTag(jobListing.id));
  revalidateTag(getJobListingGlobalTag());

  redirect(`/employer/job-listings/${jobListing.id}`);
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (
    orgId == null ||
    !(await hasOrgUserPermission("job_listings:job_listings_update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update this job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const updatedJobListing = await updateJobListingDb(id, data);

  // Revalidate cache after update
  revalidateTag(getJobListingIdTag(id));
  revalidateTag(getJobListingGlobalTag());

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
}

async function getJobListing(id: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to update this job listing's status",
  };
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) return error;

  const newStatus = getNextJobListingStatus(jobListing.status);
  if (
    !(await hasOrgUserPermission("job_listings:job_listings_change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  // Revalidate cache after status change
  revalidateTag(getJobListingIdTag(id));
  revalidateTag(getJobListingGlobalTag());

  return { error: false };
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message:
      "You don't have permission to update this job listing's featured status",
  };
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) return error;

  const newFeaturedStatus = !jobListing.isFeatured;
  if (
    !(await hasOrgUserPermission("job_listings:job_listings_change_status")) ||
    (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(id, {
    isFeatured: newFeaturedStatus,
  });

  // Revalidate cache after featured toggle
  revalidateTag(getJobListingIdTag(id));
  revalidateTag(getJobListingGlobalTag());

  return { error: false };
}

export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  };
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) return error;

  if (!(await hasOrgUserPermission("job_listings:job_listings_delete"))) {
    return error;
  }

  await deleteJobListingDb(id);

  // Revalidate cache after deletion
  revalidateTag(getJobListingIdTag(id));
  revalidateTag(getJobListingGlobalTag());

  redirect("/employer");
}
