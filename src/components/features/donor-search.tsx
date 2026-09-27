"use client";

import { useMemo, useState } from "react";
import { DonorCard } from "@/components/features/donor-card";
import { DonorSearchForm, type DonorSearchValues } from "@/components/forms/donor-search-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { canReceiveFrom } from "@/lib/blood";
import { searchDonors, useSession, useStore } from "@/lib/store";

export function DonorSearch() {
  const store = useStore();
  const { user } = useSession();
  const [criteria, setCriteria] = useState<DonorSearchValues | null>(null);

  const results = useMemo(() => {
    if (!store || !criteria) return [];
    return searchDonors(store, { ...criteria, excludeUserId: user?.id });
  }, [store, criteria, user?.id]);

  return (
    <div className="space-y-8">
      <DonorSearchForm onSearch={setCriteria} />

      {!criteria && (
        <p className="text-muted-foreground">
          Choose the blood type the patient needs. We list every available donor whose blood is compatible,
          with exact matches first.
        </p>
      )}

      {criteria && (
        <section aria-live="polite">
          <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
            <h2 className="text-xl">
              {results.length} {results.length === 1 ? "donor" : "donors"} found
              {criteria.location && <> near &ldquo;{criteria.location}&rdquo;</>}
            </h2>
            <p className="text-sm text-muted-foreground">
              {criteria.bloodType} patients can receive from {canReceiveFrom[criteria.bloodType].join(", ")}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map(({ donor, exactMatch }) => (
                <DonorCard key={donor.id} donor={donor} exactMatch={exactMatch} canViewContact={!!user} />
              ))}
            </div>
          ) : (
            <Alert variant="warning">
              <AlertTitle>No donors found</AlertTitle>
              <AlertDescription>
                No available donors match these criteria. Try clearing the location, or contact a nearby
                donation center directly.
              </AlertDescription>
            </Alert>
          )}
        </section>
      )}
    </div>
  );
}
