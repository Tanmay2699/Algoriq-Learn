'use client';

// 'use client': the role switcher is a tab set and holds a selected index.

import { Tabs } from '../primitives/tabs';
import { RoleDashboard } from '../product/renderings';

const ROLES = [
  { id: 'owner', label: 'Owner' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'student', label: 'Student' },
  { id: 'parent', label: 'Parent' },
] as const;

/**
 * The hero's role switcher.
 *
 * Most product heroes show a dashboard. This one shows four, and lets you change between
 * them — which is the architecture claim (one login, role-based dashboards) performed rather
 * than asserted. Structurally it is a tab set: real buttons, arrow keys, one focus stop. The
 * most cinematic thing on the page is also the most accessible thing on the page, and that is
 * not a coincidence.
 *
 * Activation is manual, so arrowing along the switcher does not render four dashboards.
 */
export function RoleSwitcher() {
  return (
    <Tabs
      label="Choose a role to preview"
      items={ROLES.map((role) => ({
        id: role.id,
        label: role.label,
        panel: <RoleDashboard role={role.id} />,
      }))}
      className="mt-8 lg:mt-0"
      tablistClassName="inline-flex flex-wrap gap-1 rounded-full border border-ink-border p-1"
      tabClassName="min-h-[44px] rounded-full px-4 text-mk-body-sm text-on-ink-muted transition-colors duration-fast hover:text-on-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      activeTabClassName="bg-on-ink/10 font-medium text-on-ink"
      panelClassName="mt-5 focus-visible:outline-2 focus-visible:outline-offset-4"
    />
  );
}
