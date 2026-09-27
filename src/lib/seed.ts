import { format, subDays } from 'date-fns';
import { sha256 } from '@/lib/hash';
import type { Database, StoredUser } from '@/lib/store';
import type { BloodType } from '@/types';

export const DEMO_EMAIL = 'demo@lifeline.test';
export const DEMO_PASSWORD = 'demo1234';
const DEMO_USER_ID = 'demo-user';

const sampleDonors: [name: string, bloodType: BloodType, location: string, phone: string][] = [
  ['Alice Smith', 'A+', 'New York, NY', '(212) 555-0101'],
  ['Bob Johnson', 'O-', 'San Francisco, CA', '(415) 555-0102'],
  ['Carol White', 'B+', 'New York, NY', '(212) 555-0103'],
  ['David Brown', 'AB+', 'Chicago, IL', '(312) 555-0104'],
  ['Eve Davis', 'O-', 'San Francisco, CA', '(415) 555-0105'],
  ['Frank Miller', 'O+', 'Austin, TX', '(512) 555-0106'],
  ['Grace Lee', 'A-', 'Chicago, IL', '(312) 555-0107'],
  ['Henry Wilson', 'B-', 'Austin, TX', '(512) 555-0108'],
  ['Isabel Garcia', 'AB-', 'New York, NY', '(212) 555-0109'],
  ['Jack Taylor', 'O+', 'New York, NY', '(212) 555-0112'],
  ['Kavya Patel', 'A+', 'Austin, TX', '(512) 555-0113'],
  ['Liam Chen', 'O+', 'San Francisco, CA', '(415) 555-0114'],
];

export function createSeedData(): Database {
  const createdAt = new Date().toISOString();
  const daysAgo = (days: number) => format(subDays(new Date(), days), 'yyyy-MM-dd');

  const donors: StoredUser[] = sampleDonors.map(([name, bloodType, location, contactNumber], i) => ({
    id: `sample-donor-${i + 1}`,
    name,
    email: `${name.split(' ')[0].toLowerCase()}@example.com`,
    bloodType,
    location,
    contactNumber,
    available: true,
    createdAt,
    passwordHash: '',
  }));

  const demoUser: StoredUser = {
    id: DEMO_USER_ID,
    name: 'Jane Donor',
    email: DEMO_EMAIL,
    bloodType: 'O+',
    location: 'Austin, TX',
    contactNumber: '(512) 555-0123',
    available: true,
    createdAt,
    passwordHash: sha256(`${DEMO_USER_ID}:${DEMO_PASSWORD}`),
  };

  return {
    users: [demoUser, ...donors],
    donations: [
      { id: 'demo-donation-1', userId: DEMO_USER_ID, date: daysAgo(400), location: 'Austin Community Blood Center', donationType: 'Whole Blood', notes: 'First donation.' },
      { id: 'demo-donation-2', userId: DEMO_USER_ID, date: daysAgo(290), location: 'South Congress Donor Clinic', donationType: 'Plasma' },
      { id: 'demo-donation-3', userId: DEMO_USER_ID, date: daysAgo(150), location: 'Austin Community Blood Center', donationType: 'Platelets', notes: 'Took about two hours.' },
      { id: 'demo-donation-4', userId: DEMO_USER_ID, date: daysAgo(30), location: 'Austin Community Blood Center', donationType: 'Whole Blood', notes: 'Felt great afterwards.' },
    ],
  };
}
