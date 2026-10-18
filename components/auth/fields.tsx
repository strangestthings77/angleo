'use client';

import { useFormStatus } from 'react-dom';
import { ArrowRightIcon } from '@/components/ui/Icon';

export const inputClass =
  'h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground transition-colors duration-200 placeholder:text-foreground-muted/60 focus:border-foreground focus:outline-none';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between text-sm font-medium text-foreground">
        {label}
        {hint && <span className="text-xs font-normal text-foreground-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function SubmitButton({ children, pending }: { children: string; pending: string }) {
  const { pending: isPending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={isPending}
      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-[background-color,opacity,scale] duration-200 ease-out hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent active:scale-97 disabled:opacity-60"
    >
      {isPending ? pending : children}
      {!isPending && (
        <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
      )}
    </button>
  );
}

export function FormMessage({ error, notice }: { error?: string; notice?: string }) {
  if (error)
    return (
      <p
        role="alert"
        className="animate-fade rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground"
      >
        {error}
      </p>
    );
  if (notice)
    return (
      <p
        role="status"
        className="animate-fade rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground"
      >
        {notice}
      </p>
    );
  return null;
}
