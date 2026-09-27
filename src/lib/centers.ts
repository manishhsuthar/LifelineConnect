import type { DonationCenter } from '@/types';

// Sample centers for the MVP (names, addresses and numbers are placeholders).
export const donationCenters: DonationCenter[] = [
  {
    id: 'midtown-nyc',
    name: 'Midtown Blood Donation Center',
    address: '350 W 42nd St',
    city: 'New York, NY',
    postalCode: '10036',
    operatingHours: 'Mon–Fri 8:00–19:00, Sat 9:00–15:00',
    contactInfo: '(212) 555-0110',
    services: ['Whole Blood', 'Power Red', 'Platelets', 'Plasma'],
  },
  {
    id: 'brooklyn-clinic',
    name: 'Brooklyn Community Donor Clinic',
    address: '88 Atlantic Ave',
    city: 'Brooklyn, NY',
    postalCode: '11201',
    operatingHours: 'Tue–Sat 9:00–17:00',
    contactInfo: '(718) 555-0111',
    services: ['Whole Blood', 'Plasma'],
  },
  {
    id: 'mission-bay-sf',
    name: 'Mission Bay Blood Center',
    address: '1200 Owens St',
    city: 'San Francisco, CA',
    postalCode: '94158',
    operatingHours: 'Mon–Sat 8:00–18:00',
    contactInfo: '(415) 555-0120',
    services: ['Whole Blood', 'Platelets', 'Plasma'],
  },
  {
    id: 'lakeshore-chi',
    name: 'Lakeshore Donor Services',
    address: '225 E Ontario St',
    city: 'Chicago, IL',
    postalCode: '60611',
    operatingHours: 'Daily 7:00–19:00',
    contactInfo: '(312) 555-0130',
    services: ['Whole Blood', 'Power Red', 'Platelets'],
  },
  {
    id: 'north-lamar-atx',
    name: 'Austin Community Blood Center',
    address: '4300 N Lamar Blvd',
    city: 'Austin, TX',
    postalCode: '78756',
    operatingHours: 'Mon–Sat 8:00–18:00',
    contactInfo: '(512) 555-0140',
    services: ['Whole Blood', 'Power Red', 'Platelets', 'Plasma'],
  },
  {
    id: 'south-congress-atx',
    name: 'South Congress Donor Clinic',
    address: '1600 S Congress Ave',
    city: 'Austin, TX',
    postalCode: '78704',
    operatingHours: 'Mon, Wed, Fri 10:00–18:00',
    contactInfo: '(512) 555-0141',
    services: ['Whole Blood', 'Plasma'],
  },
];

export function getCenterById(id: string | null) {
  return donationCenters.find((center) => center.id === id) ?? null;
}

export function mapsUrl(center: DonationCenter) {
  const query = `${center.name}, ${center.address}, ${center.city} ${center.postalCode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
