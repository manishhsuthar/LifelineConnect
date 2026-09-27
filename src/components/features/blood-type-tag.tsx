import { cn } from '@/lib/utils';
import type { BloodType } from '@/types';

export function BloodTypeTag({ type, className }: { type: BloodType; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-10 min-w-12 items-center justify-center rounded-md bg-primary-soft px-2 text-base font-bold text-primary tabular-nums',
        className
      )}
      aria-label={`Blood type ${type}`}
    >
      {type}
    </span>
  );
}
