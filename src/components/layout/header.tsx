"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { logout, useSession } from '@/lib/store';
import { cn } from '@/lib/utils';

const publicNav = [
  { href: '/search', label: 'Find donors' },
  { href: '/centers', label: 'Donation centers' },
];

const memberNav = [
  { href: '/donations', label: 'My donations' },
  { href: '/profile', label: 'Profile' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItems = user ? [...publicNav, ...memberNav] : publicNav;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  const authActions = !ready ? null : user ? (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Log out
    </Button>
  ) : (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Log in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">Register</Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="logo-mark" aria-hidden />
          <span className="text-lg">Lifeline Connect</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                isActive(item.href) && 'text-primary'
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user && <span className="max-w-40 truncate text-sm text-muted-foreground">{user.name}</span>}
          {authActions}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </Button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'border-b py-3 text-sm font-medium last:border-0',
                  isActive(item.href) ? 'text-primary' : 'text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 border-t px-4 py-3">
            {user && <span className="mr-auto text-sm text-muted-foreground">{user.name}</span>}
            {authActions}
          </div>
        </div>
      )}
    </header>
  );
}
