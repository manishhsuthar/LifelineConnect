import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NewDonation } from '@/components/forms/donation-form';

export const metadata: Metadata = { title: 'Log a donation' };

export default function NewDonationPage() {
  return (
    <Suspense>
      <NewDonation />
    </Suspense>
  );
}
