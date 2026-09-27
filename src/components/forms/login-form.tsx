"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/seed";
import { login, logout, StoreError, useSession } from "@/lib/store";
import { safeRedirect } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeRedirect(searchParams.get("next"), "/profile");
  const { ready, user } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      const signedIn = login(values.email, values.password);
      setRedirecting(true);
      toast.success(`Welcome back, ${signedIn.name}.`);
      router.push(next);
    } catch (err) {
      setError(err instanceof StoreError ? err.message : "Something went wrong. Please try again.");
    }
  }

  function fillDemoAccount() {
    form.setValue("email", DEMO_EMAIL, { shouldValidate: true });
    form.setValue("password", DEMO_PASSWORD, { shouldValidate: true });
  }

  if (ready && user && !redirecting) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">You&apos;re logged in</CardTitle>
          <CardDescription>Signed in as {user.email}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={next}>Continue</Link>
          </Button>
          <Button variant="outline" onClick={logout}>
            Log out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>Access your donor profile and donation history.</CardDescription>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full" disabled={redirecting}>
              Log in
            </Button>
          </form>
        </Form>

        <Alert variant="info">
          <AlertTitle>Trying it out?</AlertTitle>
          <AlertDescription>
            <p>
              Use the demo account <span className="font-medium">{DEMO_EMAIL}</span> with password{" "}
              <span className="font-medium">{DEMO_PASSWORD}</span>.
            </p>
            <Button type="button" variant="link" size="sm" onClick={fillDemoAccount}>
              Fill in demo account
            </Button>
          </AlertDescription>
        </Alert>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-medium text-primary hover:underline">
            Register as a donor
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
