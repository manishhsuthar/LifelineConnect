import Link from "next/link";
import { BloodTypeTag } from "@/components/features/blood-type-tag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";

interface DonorCardProps {
  donor: User;
  exactMatch: boolean;
  canViewContact: boolean;
}

export function DonorCard({ donor, exactMatch, canViewContact }: DonorCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle className="truncate">{donor.name}</CardTitle>
          <CardDescription>{donor.location}</CardDescription>
          <Badge variant={exactMatch ? "success" : "default"} className="mt-2">
            {exactMatch ? "Exact match" : "Compatible"}
          </Badge>
        </div>
        <BloodTypeTag type={donor.bloodType} />
      </CardHeader>
      <CardContent className="mt-auto border-t pt-4">
        {canViewContact ? (
          <div className="space-y-3">
            <dl className="space-y-1 text-sm">
              {donor.contactNumber && (
                <div className="flex gap-2">
                  <dt className="w-12 shrink-0 text-muted-foreground">Phone</dt>
                  <dd>{donor.contactNumber}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-muted-foreground">Email</dt>
                <dd className="truncate">{donor.email}</dd>
              </div>
            </dl>
            <div className="flex gap-2">
              {donor.contactNumber && (
                <Button size="sm" asChild>
                  <a href={`tel:${donor.contactNumber.replace(/[^\d+]/g, "")}`}>Call</a>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <a href={`mailto:${donor.email}?subject=${encodeURIComponent("Blood donation request via Lifeline Connect")}`}>
                  Email
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login?next=/search" className="font-medium text-primary hover:underline">
              Log in
            </Link>{" "}
            to see contact details.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
