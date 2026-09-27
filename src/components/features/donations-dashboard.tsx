"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DonationHistoryTable } from "@/components/features/donation-history-table";
import { DonationStats } from "@/components/features/donation-stats";
import { RequireAuth } from "@/components/features/require-auth";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { formatDate, getEligibility } from "@/lib/blood";
import { deleteDonation, getUserDonations, useStore } from "@/lib/store";
import type { User } from "@/types";

export function DonationsDashboard() {
  return <RequireAuth title="My donations">{(user) => <DonationsView user={user} />}</RequireAuth>;
}

function DonationsView({ user }: { user: User }) {
  const store = useStore();
  const donations = useMemo(() => (store ? getUserDonations(store, user.id) : []), [store, user.id]);
  const eligibility = getEligibility(donations);

  return (
    <>
      <PageHeader
        title="My donations"
        description="Keep a record of every donation and see when you can give again."
        actions={
          <Button asChild>
            <Link href="/donations/new">Log a donation</Link>
          </Button>
        }
      />

      <div className="space-y-8">
        <DonationStats total={donations.length} eligibility={eligibility} />

        {donations.length > 0 ? (
          <DonationHistoryTable
            donations={donations}
            onDelete={(donation) => {
              deleteDonation(user.id, donation.id);
              toast.success(`Removed donation from ${formatDate(donation.date)}.`);
            }}
          />
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="font-medium">No donations logged yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your past donations to track your history and eligibility.
            </p>
            <Button asChild className="mt-4">
              <Link href="/donations/new">Log your first donation</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
