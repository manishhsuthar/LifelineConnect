"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { bloodTypeField } from "@/lib/validation";
import { bloodTypes } from "@/types";

const formSchema = z.object({
  bloodType: bloodTypeField,
  location: z.string().trim().max(80, "Location is too long."),
});

export type DonorSearchValues = z.output<typeof formSchema>;

interface DonorSearchFormProps {
  onSearch: (values: DonorSearchValues) => void;
}

export function DonorSearchForm({ onSearch }: DonorSearchFormProps) {
  const form = useForm<z.input<typeof formSchema>, unknown, DonorSearchValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodType: "",
      location: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSearch)}
        className="grid gap-4 rounded-lg border bg-surface p-5 md:grid-cols-[1fr_2fr_auto] md:items-start"
        noValidate
      >
        <FormField
          control={form.control}
          name="bloodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood type needed</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="" disabled>
                    Select
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
              <FormLabel>City or zip code (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="md:mt-[1.375rem]">
          Search donors
        </Button>
      </form>
    </Form>
  );
}
