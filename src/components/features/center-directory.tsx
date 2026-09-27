"use client";

import { useMemo, useState } from "react";
import { DonationCenterCard } from "@/components/features/donation-center-card";
import { DonationCenterDetailsModal } from "@/components/modals/donation-center-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { donationCenters } from "@/lib/centers";
import { donationTypes, type DonationCenter, type DonationType } from "@/types";

export function CenterDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [service, setService] = useState<DonationType | "">("");
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null);

  const filteredCenters = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return donationCenters.filter(
      (center) =>
        (!service || center.services.includes(service)) &&
        (!query ||
          [center.name, center.address, center.city, center.postalCode].some((value) =>
            value.toLowerCase().includes(query)
          ))
    );
  }, [searchTerm, service]);

  const hasFilters = searchTerm !== "" || service !== "";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border bg-surface p-4 md:grid-cols-[2fr_1fr]">
        <label className="grid gap-2 text-sm font-medium">
          Search
          <Input
            type="search"
            placeholder="Name, city, address or zip code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Donation type
          <Select value={service} onChange={(e) => setService(e.target.value as DonationType | "")}>
            <option value="">All types</option>
            {donationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {filteredCenters.length} of {donationCenters.length} centers
      </p>

      {filteredCenters.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCenters.map((center) => (
            <DonationCenterCard key={center.id} center={center} onViewDetails={setSelectedCenter} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">No donation centers match your search.</p>
          {hasFilters && (
            <Button
              variant="link"
              className="mt-2"
              onClick={() => {
                setSearchTerm("");
                setService("");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      <DonationCenterDetailsModal center={selectedCenter} onClose={() => setSelectedCenter(null)} />
    </div>
  );
}
