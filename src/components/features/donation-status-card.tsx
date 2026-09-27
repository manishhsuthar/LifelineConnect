import { format } from "date-fns";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canDonateTo, formatDate, type Eligibility } from "@/lib/blood";
import type { BloodType } from "@/types";

const bloodTypeNotes: Record<BloodType, string> = {
  "O-": "O- is the universal red cell type. Hospitals keep it on hand for emergencies, when there is no time to test a patient's blood.",
  "O+": "O+ is the most common blood type, and your red cells can help any patient with a positive blood type.",
  "A-": "A- red cells can help both A and AB patients, whether they are Rh positive or negative.",
  "A+": "A+ is one of the most common blood types, so your donations can help a large number of patients.",
  "B-": "B- is rare, carried by only about 2 in 100 people, which makes every donation count.",
  "B+": "B+ red cells can help B+ and AB+ patients.",
  "AB-": "AB- is the rarest blood type, and AB plasma can be given to patients of any blood type.",
  "AB+": "AB+ patients can receive red cells from every type, and AB plasma can be given to anyone.",
};

const preparationTips = [
  "Drink an extra 500 ml (about 16 oz) of water before your appointment.",
  "Eat a healthy, iron-rich meal beforehand. Avoid fatty foods.",
  "Bring a photo ID and a list of any medications you take.",
  "Rest for a few minutes afterwards and skip heavy lifting for the day.",
];

interface DonationStatusCardProps {
  bloodType: BloodType;
  eligibility: Eligibility;
}

export function DonationStatusCard({ bloodType, eligibility }: DonationStatusCardProps) {
  const { lastDonation, nextEligibleDate, daysRemaining } = eligibility;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Donation status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {!lastDonation ? (
          <Alert variant="info">
            <AlertTitle>No donations logged yet</AlertTitle>
            <AlertDescription>
              Most healthy adults can give whole blood every 56 days.{" "}
              <Link href="/donations/new" className="font-medium text-primary underline-offset-4 hover:underline">
                Log a past donation
              </Link>{" "}
              or{" "}
              <Link href="/centers" className="font-medium text-primary underline-offset-4 hover:underline">
                find a center
              </Link>
              .
            </AlertDescription>
          </Alert>
        ) : daysRemaining > 0 && nextEligibleDate ? (
          <Alert variant="warning">
            <AlertTitle>
              You can donate again in {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
            </AlertTitle>
            <AlertDescription>
              Your body is recovering from your {lastDonation.donationType.toLowerCase()} donation on{" "}
              {formatDate(lastDonation.date)}. You are eligible again from{" "}
              {format(nextEligibleDate, "EEEE, MMM d")}.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success">
            <AlertTitle>You are eligible to donate</AlertTitle>
            <AlertDescription>
              Your last donation was on {formatDate(lastDonation.date)}.{" "}
              <Link href="/centers" className="font-medium underline-offset-4 hover:underline">
                Find a donation center
              </Link>{" "}
              to book your next visit.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="text-sm font-semibold">About your blood type</h3>
          <p className="mt-1 text-sm text-muted-foreground">{bloodTypeNotes[bloodType]}</p>
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Your red cells can go to:</span>{" "}
            <span className="font-medium">{canDonateTo(bloodType).join(", ")}</span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Before your next donation</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {preparationTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          Waiting periods follow American Red Cross guidance and can differ by country and center.
        </p>
      </CardContent>
    </Card>
  );
}
