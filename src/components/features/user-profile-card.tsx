import { format, parseISO } from "date-fns";
import { BloodTypeTag } from "@/components/features/blood-type-tag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";

interface UserProfileCardProps {
  user: User;
  onEdit: () => void;
}

export function UserProfileCard({ user, onEdit }: UserProfileCardProps) {
  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const details = [
    { label: "Email", value: user.email },
    { label: "Phone", value: user.contactNumber || "Not added" },
    { label: "Location", value: user.location },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold"
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-xl">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Member since {format(parseISO(user.createdAt), "MMM yyyy")}
          </p>
        </div>
        <BloodTypeTag type={user.bloodType} />
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant={user.available ? "success" : "default"}>
          {user.available ? "Listed as available donor" : "Hidden from donor search"}
        </Badge>
        <dl className="divide-y border-y text-sm">
          {details.map((item) => (
            <div key={item.label} className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="truncate text-right font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onEdit}>
          Edit profile
        </Button>
      </CardFooter>
    </Card>
  );
}
