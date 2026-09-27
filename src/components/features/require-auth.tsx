"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/store';
import type { User } from '@/types';

interface RequireAuthProps {
  title: string;
  children: (user: User) => React.ReactNode;
}

export function RequireAuth({ title, children }: RequireAuthProps) {
  const { ready, user } = useSession();
  const pathname = usePathname();

  if (!ready) {
    return <p className="py-16 text-center text-muted-foreground">Loading…</p>;
  }

  if (!user) {
    const next = encodeURIComponent(pathname);
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h1 className="text-2xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">Log in or create a donor account to see this page.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link href={`/login?next=${next}`}>Log in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/register?next=${next}`}>Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children(user)}</>;
}
