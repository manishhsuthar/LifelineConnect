"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RequireAuth } from "@/components/features/require-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { donationIntervalDays } from "@/lib/blood";
import { donationCenters, getCenterById } from "@/lib/centers";
import { addDonation } from "@/lib/store";
import { donationTypeField } from "@/lib/validation";
import { donationTypes, type User } from "@/types";

const today = () => format(new Date(), "yyyy-MM-dd");

const formSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick the donation date.")
    .refine((value) => value <= today(), "The date can't be in the future."),
  location: z.string().trim().min(2, "Enter where you donated.").max(100, "Location is too long."),
  donationType: donationTypeField,
  notes: z.string().trim().max(200, "Notes can be at most 200 characters."),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export function NewDonation() {
  return <RequireAuth title="Log a donation">{(user) => <DonationForm user={user} />}</RequireAuth>;
}

function DonationForm({ user }: { user: User }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const center = getCenterById(searchParams.get("center"));

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: today(),
      location: center?.name ?? "",
      donationType: "Whole Blood",
      notes: "",
    },
  });

  function onSubmit(values: FormOutput) {
    addDonation(user.id, values);
    toast.success("Donation logged. Thank you for giving!");
    router.push("/donations");
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Log a donation</CardTitle>
        <CardDescription>Record a donation you made so it shows up in your history.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" max={today()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="donationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation type</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        {donationTypes.map((type) => (
                          <option key={type} value={type}>
                            {type} ({donationIntervalDays[type]}-day wait)
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input list="donation-center-options" placeholder="Center, hospital or blood drive" {...field} />
                  </FormControl>
                  <datalist id="donation-center-options">
                    {donationCenters.map((c) => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                  <FormDescription>Pick a listed center or type any location.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="How did it go?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Save donation</Button>
              <Button variant="outline" asChild>
                <Link href="/donations">Cancel</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
