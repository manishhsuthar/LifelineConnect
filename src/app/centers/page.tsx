import type { Metadata } from 'next';
import { CenterDirectory } from '@/components/features/center-directory';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Donation centers' };

export default function CentersPage() {
  return (
    <>
      <PageHeader
        title="Donation centers"
        description="Find a place to donate, check opening hours and get directions."
      />
      <CenterDirectory />
    </>
  );
}
