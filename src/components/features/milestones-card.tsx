import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { milestones } from "@/lib/blood";
import { cn } from "@/lib/utils";

export function MilestonesCard({ donationCount }: { donationCount: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Milestones</CardTitle>
        <p className="text-sm text-muted-foreground">Earned automatically as you log donations.</p>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {milestones.map((milestone) => {
            const earned = donationCount >= milestone.required;
            return (
              <li
                key={milestone.label}
                className={cn(
                  "rounded-md border p-4",
                  earned ? "border-primary/30 bg-primary-soft" : "bg-background"
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className={cn("font-semibold", earned && "text-primary")}>{milestone.label}</p>
                  <p className="text-xs font-medium tabular-nums text-muted-foreground">
                    {earned ? "Earned" : `${donationCount}/${milestone.required}`}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                {!earned && (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(donationCount / milestone.required) * 100}%` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
