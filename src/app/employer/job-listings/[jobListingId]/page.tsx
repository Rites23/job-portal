import React, { Suspense, ReactNode } from "react";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { notFound } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { Button } from "@/components/ui/button";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { AsyncIf } from "@/components/AsyncIf";
import {
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  StarOffIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils";
import {
  hasReachedMaxPublishedJobListings,
  hasReachedMaxFeaturedJobListings,
} from "@/features/jobListings/lib/planfeatureHelpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JobListingStatus } from "@/drizzle/schema";
import { ActionButton } from "@/components/ActionButton";
import {
  toggleJobListingStatus,
  toggleJobListingFeatured,
  deleteJobListing,
} from "@/features/jobListings/actions/actions";
type Props = {
  params: { jobListingId: string };
};

const JobListingPage = (props: Props) => {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  );
};

export default JobListingPage;

async function SuspendedPage({ params }: Props) {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return null;
  const { jobListingId } = await params;
  const jobListing = await getJobListing(jobListingId, orgId);
  if (jobListing == null) return notFound();

  return (
    <div className="space-y-6 max-w-6xl max-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 empty:-mt-4">
          <AsyncIf
            condition={() =>
              hasOrgUserPermission("job_listings:job_listings_update")
            }
          >
            <Button asChild variant="outline">
              <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                <EditIcon className="size-4" />
                Edit
              </Link>
            </Button>
          </AsyncIf>

          <StatusUpdateButton status={jobListing.status} id={jobListing.id} />
          {jobListing.status === "published" && (
            <FeaturedToggleButton
              isFeatured={jobListing.isFeatured}
              id={jobListing.id}
            />
          )}

          <AsyncIf
            condition={() =>
              hasOrgUserPermission("job_listings:job_listings_delete")
            }
          >
            <ActionButton
              variant="destructive"
              action={deleteJobListing.bind(null, jobListing.id)}
              requireAreYouSure
            >
              <Trash2Icon className="size-4" />
              Delete
            </ActionButton>
          </AsyncIf>
        </div>
      </div>

      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />
    </div>
  );
}

// all the complex button here

function StatusUpdateButton({
  status,
  id,
}: {
  status: JobListingStatus;
  id: string;
}) {
  const button = (
    <ActionButton
      action={toggleJobListingStatus.bind(null, id)}
      variant="outline"
      requireAreYouSure={getNextJobListingStatus(status) === "published"}
      areYouSureDescription="This will immediately show this job listing to all users."
    >
      {statusToggleButtonText(status)}
    </ActionButton>
  );

  return (
    <AsyncIf
      condition={() =>
        hasOrgUserPermission("job_listings:job_listings_change_status")
      }
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxPublishedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={statusToggleButtonText(status)}
              popoverText="You must upgrade your plan to publish more job listings."
            />
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
}

// feature button

function FeaturedToggleButton({
  isFeatured,
  id,
}: {
  isFeatured: boolean;
  id: string;
}) {
  const button = (
    <ActionButton
      action={toggleJobListingFeatured.bind(null, id)}
      variant="outline"
    >
      {featuredToggleButtonText(isFeatured)}
    </ActionButton>
  );

  return (
    <AsyncIf
      condition={() => hasOrgUserPermission("job_listings:job_listings_change_status")}
    >
      {isFeatured ? (
        button
      ) : (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxFeaturedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={featuredToggleButtonText(isFeatured)}
              popoverText="You must upgrade your plan to feature more job listings."
            />
          }
        >
          {button}
        </AsyncIf>
      )}
    </AsyncIf>
  );
}

// add delete button

// status toggle button

function statusToggleButtonText(status: JobListingStatus) {
  switch (status) {
    case "delisted":
    case "draft":
      return (
        <>
          <EyeIcon className="size-4" />
          Publish
        </>
      );
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          Delist
        </>
      );
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
}

function featuredToggleButtonText(isFeatured: boolean) {
  if (isFeatured) {
    return (
      <>
        <StarOffIcon className="size-4" />
        UnFeature
      </>
    );
  }

  return (
    <>
      <StarIcon className="size-4" />
      Feature
    </>
  );
}

// update UpgradePopover component

function UpgradePopover({
  buttonText,
  popoverText,
}: {
  buttonText: ReactNode;
  popoverText: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {popoverText}
        <Button asChild>
          <Link href="/employer/pricing">Upgrade Plan</Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
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
