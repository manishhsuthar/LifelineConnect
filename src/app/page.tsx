import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { canDonateTo, canReceiveFrom } from '@/lib/blood';
import { bloodTypes } from '@/types';

const steps = [
  {
    title: 'Register as a donor',
    body: 'Create a free profile with your blood type and city. You choose whether you appear in search.',
  },
  {
    title: 'Get found when it matters',
    body: 'Families and hospitals search by the blood type they need and see every compatible donor nearby.',
  },
  {
    title: 'Track every donation',
    body: 'Log your donations, see when you are eligible again and earn milestones along the way.',
  },
];

const features = [
  {
    title: 'Find compatible donors',
    body: 'Search by the blood type a patient needs. Results include exact matches and every compatible type.',
    href: '/search',
    cta: 'Search donors',
  },
  {
    title: 'Locate donation centers',
    body: 'Browse centers by city or donation type, check opening hours and get directions.',
    href: '/centers',
    cta: 'View centers',
  },
  {
    title: 'Keep your history',
    body: 'A simple record of where and when you donated, with a countdown to your next eligible date.',
    href: '/donations',
    cta: 'My donations',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[3fr_2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Blood donor network</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
            Find a blood donor when every minute counts.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Lifeline Connect brings donors and the people who need them together. Search by blood type and
            city, reach out directly and keep track of your own donations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/search">Find donors</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Register as a donor</Link>
            </Button>
          </div>
        </div>

        <ol className="divide-y rounded-lg border bg-surface">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 p-5">
              <span className="text-2xl font-bold tabular-nums text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="text-base">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl">What you can do</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="border-t-2 border-primary pt-5">
              <h3 className="text-lg">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.body}</p>
              <Link href={feature.href} className="mt-3 inline-block font-medium text-primary hover:underline">
                {feature.cta} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <div>
          <h2 className="text-2xl md:text-3xl">Blood type compatibility</h2>
          <p className="mt-3 text-muted-foreground">
            Red blood cells must be compatible between donor and patient. O- can be given to anyone, while
            AB+ patients can receive from every type. Donor search uses this table to find matches.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr className="border-b">
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Can give to</th>
                <th className="px-4 py-3 font-semibold">Can receive from</th>
              </tr>
            </thead>
            <tbody>
              {bloodTypes.map((type) => (
                <tr key={type} className="border-b last:border-0">
                  <td className="px-4 py-2.5 font-bold text-primary">{type}</td>
                  <td className="px-4 py-2.5">{canDonateTo(type).join(', ')}</td>
                  <td className="px-4 py-2.5">{canReceiveFrom[type].join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <Image
          src="/LifeLine.png"
          alt="Your donation means a lot to their life"
          className="h-auto w-full rounded-lg border"
          width={1200}
          height={400}
        />
        <p className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground">
          Blood transfusions are critical for surgeries, cancer treatment, chronic illnesses and traumatic
          injuries. By donating, you help keep a stable and safe blood supply in your community.
        </p>
      </section>

      <section className="flex flex-col gap-6 rounded-lg bg-foreground p-8 text-background md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 className="text-2xl text-background md:text-3xl">Ready to make a difference?</h2>
          <p className="mt-2 max-w-xl text-background/75">
            One donation can help save up to three lives. It takes a minute to sign up.
          </p>
        </div>
        <Button size="lg" asChild className="shrink-0">
          <Link href="/register">Join Lifeline Connect</Link>
        </Button>
      </section>
    </div>
  );
}
