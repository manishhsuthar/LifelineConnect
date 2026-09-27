export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodType = (typeof bloodTypes)[number];

export const donationTypes = ['Whole Blood', 'Power Red', 'Platelets', 'Plasma'] as const;
export type DonationType = (typeof donationTypes)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  bloodType: BloodType;
  location: string; // e.g., City or Zip Code
  contactNumber?: string;
  available: boolean; // Listed in donor search results
  createdAt: string; // ISO timestamp
}

export interface DonationRecord {
  id: string;
  userId: string;
  date: string; // yyyy-MM-dd
  location: string; // Name of donation center or hospital
  donationType: DonationType;
  notes?: string;
}

export interface DonationCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  operatingHours: string;
  contactInfo: string;
  services: DonationType[];
}
