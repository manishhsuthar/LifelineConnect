import type { Metadata } from 'next';
import { DonationsDashboard } from '@/components/features/donations-dashboard';

export const metadata: Metadata = { title: 'My donations' };

export default function DonationsPage() {
  return <DonationsDashboard />;
}
