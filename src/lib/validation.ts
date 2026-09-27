import * as z from 'zod';
import { bloodTypes, donationTypes, type BloodType, type DonationType } from '@/types';

export const bloodTypeField = z
  .string()
  .refine((value): value is BloodType => (bloodTypes as readonly string[]).includes(value), {
    message: 'Select a blood type.',
  });

export const donationTypeField = z
  .string()
  .refine((value): value is DonationType => (donationTypes as readonly string[]).includes(value), {
    message: 'Select a donation type.',
  });

export const phoneField = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === '') return true;
      const digits = value.replace(/\D/g, '').length;
      return /^\+?[\d\s().-]+$/.test(value) && digits >= 7 && digits <= 15;
    },
    { message: 'Enter a valid phone number.' }
  );

export const locationField = z
  .string()
  .trim()
  .min(2, 'Enter your city or zip code.')
  .max(80, 'Location is too long.');

export const nameField = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters.')
  .max(50, 'Name must be at most 50 characters.');
