import type { Metadata } from 'next';
import { DonorSearch } from '@/components/features/donor-search';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Find donors' };

export default function SearchPage() {
  return (
    <>
      <PageHeader
        title="Find blood donors"
        description="Search registered donors by the blood type you need and, optionally, by location."
      />
      <DonorSearch />
    </>
  );
}
