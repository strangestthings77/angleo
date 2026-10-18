'use client';

import { useId, useRef, useState, useSyncExternalStore } from 'react';

export type Tab = { id: string; label: string; badge?: number; content: React.ReactNode };

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/**
 * Accessible tabs (WAI-ARIA): ←/→/Home/End move between tabs, the active one is kept in the
 * URL hash (#slowka) so a refresh or shared link opens the same tab.
 */
export function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => '',
  );
  const [picked, setPicked] = useState<string | null>(null);
  const active = picked ?? (tabs.some((t) => t.id === hash) ? hash : tabs[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const base = useId();

  function select(id: string, focus = false) {
    setPicked(id);
    window.history.replaceState(null, '', `#${id}`);
    if (focus) refs.current[id]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    select(tabs[next].id, true);
  }

  return (
    <div className="flex flex-col gap-10">
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-1 self-start overflow-x-auto rounded-full border border-border bg-surface p-1"
      >
        {tabs.map((tab, i) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-[background-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selected
                  ? 'bg-foreground text-background'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`rounded-full px-1.5 text-xs tabular-nums ${selected ? 'bg-background/15' : 'bg-surface-muted'}`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="animate-fade focus-visible:outline-none"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
