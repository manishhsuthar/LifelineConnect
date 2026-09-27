import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import type { BloodType, DonationRecord, DonationType } from '@/types';

// Red blood cell compatibility: which donor types each recipient can receive from.
export const canReceiveFrom: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

export function canDonateTo(donor: BloodType): BloodType[] {
  return (Object.keys(canReceiveFrom) as BloodType[]).filter((recipient) =>
    canReceiveFrom[recipient].includes(donor)
  );
}

// Minimum wait after each donation type before donating again
// (American Red Cross guidance; rules differ between countries and centers).
export const donationIntervalDays: Record<DonationType, number> = {
  'Whole Blood': 56,
  'Power Red': 112,
  Platelets: 7,
  Plasma: 28,
};

export function formatDate(date: string) {
  return format(parseISO(date), 'MMM d, yyyy');
}

export function sortByDateDesc(donations: DonationRecord[]) {
  return [...donations].sort((a, b) => b.date.localeCompare(a.date));
}

export interface Eligibility {
  lastDonation: DonationRecord | null;
  nextEligibleDate: Date | null;
  daysRemaining: number;
}

export function getEligibility(donations: DonationRecord[], today = new Date()): Eligibility {
  const [lastDonation] = sortByDateDesc(donations);
  if (!lastDonation) {
    return { lastDonation: null, nextEligibleDate: null, daysRemaining: 0 };
  }
  const nextEligibleDate = addDays(
    parseISO(lastDonation.date),
    donationIntervalDays[lastDonation.donationType]
  );
  const daysRemaining = Math.max(0, differenceInCalendarDays(nextEligibleDate, today));
  return { lastDonation, nextEligibleDate, daysRemaining };
}

export interface Milestone {
  label: string;
  description: string;
  required: number;
}

export const milestones: Milestone[] = [
  { label: 'First drop', description: 'Log your first donation', required: 1 },
  { label: 'Regular', description: 'Donate 3 times', required: 3 },
  { label: 'Lifesaver', description: 'Donate 5 times', required: 5 },
  { label: 'Champion', description: 'Donate 10 times', required: 10 },
];
