import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">Lifeline Connect</p>
          <p>Making a difference, one donation at a time.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          <Link href="/search" className="hover:text-foreground">Find donors</Link>
          <Link href="/centers" className="hover:text-foreground">Donation centers</Link>
          <Link href="/register" className="hover:text-foreground">Become a donor</Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} Lifeline Connect</p>
      </div>
    </footer>
  );
}
