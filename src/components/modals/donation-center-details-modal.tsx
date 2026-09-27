"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mapsUrl } from "@/lib/centers";
import { useSession } from "@/lib/store";
import type { DonationCenter } from "@/types";

interface DonationCenterDetailsModalProps {
  center: DonationCenter | null;
  onClose: () => void;
}

export function DonationCenterDetailsModal({ center, onClose }: DonationCenterDetailsModalProps) {
  const { user } = useSession();

  return (
    <Dialog open={center !== null} onOpenChange={(open) => !open && onClose()}>
      {center && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{center.name}</DialogTitle>
            <DialogDescription>
              {center.address}, {center.city} {center.postalCode}
            </DialogDescription>
          </DialogHeader>

          <dl className="divide-y rounded-md border text-sm">
            <div className="grid grid-cols-[7rem_1fr] gap-2 px-4 py-3">
              <dt className="text-muted-foreground">Opening hours</dt>
              <dd>{center.operatingHours}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-2 px-4 py-3">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href={`tel:${center.contactInfo.replace(/[^\d+]/g, "")}`} className="text-primary hover:underline">
                  {center.contactInfo}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-2 px-4 py-3">
              <dt className="text-muted-foreground">Donation types</dt>
              <dd className="flex flex-wrap gap-1.5">
                {center.services.map((service) => (
                  <Badge key={service} variant="outline">
                    {service}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-muted-foreground">
            Bring a photo ID, eat a healthy meal and drink plenty of water before you donate. Call ahead to
            book a slot or confirm walk-in times.
          </p>

          <DialogFooter>
            <Button variant="outline" asChild>
              <a href={mapsUrl(center)} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </Button>
            {user && (
              <Button asChild>
                <Link href={`/donations/new?center=${center.id}`}>Log a donation here</Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
