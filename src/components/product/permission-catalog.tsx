'use client';

// 'use client': a filter box and a module selector.

import { useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import catalog from '../../content/permission-catalog.json';

/**
 * All 272 permission keys, filterable.
 *
 * Nobody else in this category will show you their permission model. Showing ours *is* the
 * argument — a buyer can read every act the software can perform and decide whether the
 * granularity matches their institute, without a call.
 *
 * The data is a checked-in JSON copy of `packages/authz/src/catalog.ts`, produced by
 * `scripts/sync-catalog.ts` so that a change to the catalogue arrives as a reviewable diff.
 */
export function PermissionCatalog() {
  const [query, setQuery] = useState('');
  const [module, setModule] = useState<string>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.permissions.filter((permission) => {
      if (module !== 'all' && permission.module !== module) return false;
      if (!q) return true;
      return (
        permission.key.toLowerCase().includes(q) || permission.description.toLowerCase().includes(q)
      );
    });
  }, [query, module]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[16rem] flex-1">
          <label htmlFor="perm-search" className="block text-mk-body-sm font-medium text-on-ink">
            Search the catalogue
          </label>
          <input
            id="perm-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="invoice, publish, audit…"
            className="mt-1.5 h-11 w-full rounded-[--radius] border border-ink-border bg-ink-800 px-3 text-mk-body text-on-ink outline-none placeholder:text-on-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2"
          />
        </div>
        <div>
          <label htmlFor="perm-module" className="block text-mk-body-sm font-medium text-on-ink">
            Module
          </label>
          <select
            id="perm-module"
            value={module}
            onChange={(event) => setModule(event.target.value)}
            className="mt-1.5 h-11 rounded-[--radius] border border-ink-border bg-ink-800 px-3 text-mk-body text-on-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <option value="all">All {catalog.modules.length}</option>
            {catalog.modules.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-mk-body-sm text-on-ink-muted">
        {results.length} of {catalog.count} keys
        {module !== 'all' && ` in ${module}`}
        {query && ` matching “${query}”`}
      </p>

      {/*
        A scrollable region has to be focusable, or a keyboard user cannot reach the 250 rows
        below the fold of it — WCAG 2.1.1, and the failure almost every long list ships with.
      */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Permission catalogue results"
        className="mt-4 max-h-[28rem] overflow-y-auto rounded-lg border border-ink-border focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <ul>
        {results.map((permission) => (
          <li
            key={permission.key}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-ink-border px-4 py-2.5 last:border-0"
          >
            <code className="font-mono text-mk-mono text-on-ink">{permission.key}</code>
            <span className="text-mk-body-sm text-on-ink-muted">{permission.description}</span>
          </li>
        ))}
        {results.length === 0 && (
          <li className={cn('px-4 py-6 text-mk-body-sm text-on-ink-muted')}>
            Nothing matches. Try a module name, or an action like “publish”.
          </li>
        )}
        </ul>
      </div>

      <p className="mt-3 text-caption text-on-ink-muted">
        Copied from <code className="font-mono">{catalog.source}</code> on {catalog.syncedAt}.
      </p>
    </div>
  );
}
