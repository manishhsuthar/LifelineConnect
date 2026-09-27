"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { registerUser, StoreError, useSession } from "@/lib/store";
import { safeRedirect } from "@/lib/utils";
import { bloodTypeField, locationField, nameField, phoneField } from "@/lib/validation";
import { bloodTypes } from "@/types";

const formSchema = z
  .object({
    name: nameField,
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    bloodType: bloodTypeField,
    location: locationField,
    contactNumber: phoneField,
    available: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export function DonorRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeRedirect(searchParams.get("next"), "/profile");
  const { ready, user } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      bloodType: "",
      location: "",
      contactNumber: "",
      available: true,
    },
  });

  function onSubmit(values: FormOutput) {
    setError(null);
    try {
      const created = registerUser(values);
      setRedirecting(true);
      toast.success(`Welcome, ${created.name}! Your donor profile is ready.`);
      router.push(next);
    } catch (err) {
      setError(err instanceof StoreError ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (ready && user && !redirecting) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">You already have an account</CardTitle>
          <CardDescription>Signed in as {user.email}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/profile">Go to your profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Register as a donor</CardTitle>
        <CardDescription>
          Create your profile so people who need blood can find you, and keep track of your donations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormDescription>At least 8 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood type</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="" disabled>
                          Select your blood type
                        </option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City or zip code</FormLabel>
                    <FormControl>
                      <Input autoComplete="address-level2" placeholder="e.g. Austin, TX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number (optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" autoComplete="tel" placeholder="(512) 555-0123" {...field} />
                  </FormControl>
                  <FormDescription>Only shown to signed-in members looking for donors.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem>
                  <label className="flex items-start gap-3 rounded-md border p-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-0.5 size-4"
                      name={field.name}
                      ref={field.ref}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                    <span>
                      <span className="font-medium">List me as an available donor</span>
                      <span className="block text-muted-foreground">
                        You will appear in donor search results. You can change this later.
                      </span>
                    </span>
                  </label>
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full" disabled={redirecting}>
              Create account
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
