import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Lifeline Connect',
    template: '%s · Lifeline Connect',
  },
  description: 'Connect with blood donors and save lives.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
