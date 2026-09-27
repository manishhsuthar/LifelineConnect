"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DonationStatusCard } from "@/components/features/donation-status-card";
import { MilestonesCard } from "@/components/features/milestones-card";
import { RequireAuth } from "@/components/features/require-auth";
import { UserProfileCard } from "@/components/features/user-profile-card";
import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getEligibility } from "@/lib/blood";
import { getUserDonations, useStore } from "@/lib/store";
import type { User } from "@/types";

export function ProfileView() {
  return <RequireAuth title="My profile">{(user) => <Profile user={user} />}</RequireAuth>;
}

function Profile({ user }: { user: User }) {
  const store = useStore();
  const [editing, setEditing] = useState(false);
  const donations = useMemo(() => (store ? getUserDonations(store, user.id) : []), [store, user.id]);

  return (
    <>
      <PageHeader
        title="My profile"
        description="Manage your donor details and see when you can donate next."
        actions={
          <Button variant="outline" asChild>
            <Link href="/donations">View donation history</Link>
          </Button>
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {editing ? (
            <ProfileForm user={user} onDone={() => setEditing(false)} />
          ) : (
            <UserProfileCard user={user} onEdit={() => setEditing(true)} />
          )}
        </div>
        <div className="space-y-6 lg:col-span-2">
          <DonationStatusCard bloodType={user.bloodType} eligibility={getEligibility(donations)} />
          <MilestonesCard donationCount={donations.length} />
        </div>
      </div>
    </>
  );
}
