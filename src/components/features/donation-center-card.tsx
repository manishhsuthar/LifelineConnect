import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { DonationCenter } from "@/types";

interface DonationCenterCardProps {
  center: DonationCenter;
  onViewDetails: (center: DonationCenter) => void;
}

export function DonationCenterCard({ center, onViewDetails }: DonationCenterCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{center.name}</CardTitle>
        <CardDescription>
          {center.address}, {center.city} {center.postalCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <dl className="space-y-1">
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-muted-foreground">Hours</dt>
            <dd>{center.operatingHours}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-muted-foreground">Phone</dt>
            <dd>{center.contactInfo}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-1.5">
          {center.services.map((service) => (
            <Badge key={service} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onViewDetails(center)}>
          View details
        </Button>
      </CardFooter>
    </Card>
  );
}
