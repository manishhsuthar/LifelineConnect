"use client";

import { useState } from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/blood";
import type { DonationRecord, DonationType } from "@/types";

const typeVariant: Record<DonationType, BadgeProps["variant"]> = {
  "Whole Blood": "primary",
  "Power Red": "primary",
  Platelets: "warning",
  Plasma: "success",
};

interface DonationHistoryTableProps {
  donations: DonationRecord[];
  onDelete: (donation: DonationRecord) => void;
}

export function DonationHistoryTable({ donations, onDelete }: DonationHistoryTableProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-36">Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-44 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell className="whitespace-nowrap font-medium">{formatDate(donation.date)}</TableCell>
              <TableCell className="min-w-48">{donation.location}</TableCell>
              <TableCell>
                <Badge variant={typeVariant[donation.donationType]} className="whitespace-nowrap">
                  {donation.donationType}
                </Badge>
              </TableCell>
              <TableCell className="min-w-40 text-muted-foreground">{donation.notes || "—"}</TableCell>
              <TableCell className="text-right">
                {confirmingId === donation.id ? (
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setConfirmingId(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setConfirmingId(null);
                        onDelete(donation);
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => setConfirmingId(donation.id)}
                    aria-label={`Delete donation from ${formatDate(donation.date)}`}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
