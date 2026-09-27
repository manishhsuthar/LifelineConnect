import { format } from "date-fns";
import { formatDate, type Eligibility } from "@/lib/blood";

interface DonationStatsProps {
  total: number;
  eligibility: Eligibility;
}

export function DonationStats({ total, eligibility }: DonationStatsProps) {
  const { lastDonation, nextEligibleDate, daysRemaining } = eligibility;

  const stats = [
    { label: "Total donations", value: String(total), detail: total === 1 ? "donation logged" : "donations logged" },
    {
      label: "Last donation",
      value: lastDonation ? formatDate(lastDonation.date) : "—",
      detail: lastDonation ? lastDonation.donationType : "Nothing logged yet",
    },
    {
      label: "Next eligible",
      value: daysRemaining > 0 && nextEligibleDate ? format(nextEligibleDate, "MMM d, yyyy") : "Now",
      detail:
        daysRemaining > 0
          ? `in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`
          : "You can donate today",
    },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-background p-5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
          <dd className="mt-2 text-2xl font-bold tabular-nums">{stat.value}</dd>
          <dd className="text-sm text-muted-foreground">{stat.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
