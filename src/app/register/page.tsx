import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DonorRegistrationForm } from '@/components/forms/donor-registration-form';

export const metadata: Metadata = { title: 'Register' };

export default function RegisterPage() {
  return (
    <Suspense>
      <DonorRegistrationForm />
    </Suspense>
  );
}
