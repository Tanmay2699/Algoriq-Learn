'use client';

// 'use client': a vertical tab set holding a selected cluster.

import Link from 'next/link';
import type { Route } from 'next';
import { clusters } from '../../config/navigation';
import { modulesByCluster } from '../../content/modules';
import { Tabs } from '../primitives/tabs';
import {
  AdmissionsBoard,
  CourseDiff,
  ItemAnalysis,
  PeopleList,
  RiskList,
  RoleDashboard,
  RolesMatrix,
} from '../product/renderings';

const PANEL: Record<string, React.ReactNode> = {
  'admissions-and-growth': <AdmissionsBoard />,
  'academics-and-content': <CourseDiff />,
  'delivery-and-engagement': <RoleDashboard role="student" />,
  'assessment-and-outcomes': <ItemAnalysis />,
  'money-and-people': <PeopleList />,
  intelligence: <RiskList />,
  'platform-and-trust': <RolesMatrix />,
};

/**
 * Act IV. Seven clusters down the left, the cluster's flagship surface on the right.
 *
 * Vertical orientation, manual activation: arrowing down the list moves focus without
 * swapping the panel, so a keyboard user is not made to render seven surfaces on the way
 * to the one they wanted.
 */
export function ModuleExplorer() {
  return (
    <Tabs
      label="Product clusters"
      orientation="vertical"
      className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-12"
      tablistClassName="flex flex-col gap-0.5"
      tabClassName="min-h-[44px] rounded-[--radius] px-3 py-2.5 text-start transition-colors duration-fast hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2"
      activeTabClassName="bg-surface-muted"
      panelClassName="min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4"
      items={clusters.map((cluster) => ({
        id: cluster.key,
        label: (
          <span className="block">
            <span className="block text-mk-subtitle font-semibold text-fg">{cluster.label}</span>
            <span className="mt-0.5 block text-mk-body-sm text-fg-muted">{cluster.blurb}</span>
          </span>
        ),
        panel: (
          <div>
            {PANEL[cluster.key]}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {modulesByCluster(cluster.key).map((module) => (
                <Link
                  key={module.slug}
                  href={`/product/modules/${module.slug}` as Route}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-mk-body-sm text-fg transition-colors duration-fast hover:bg-surface-muted"
                >
                  {module.title}
                  {module.completeness < 65 && (
                    <>
                      <span aria-hidden="true" className="text-fg-muted">
                        ◔
                      </span>
                      <span className="sr-only"> — in progress, see build status</span>
                    </>
                  )}
                </Link>
              ))}
              <Link
                href={cluster.href as Route}
                className="inline-flex min-h-[36px] items-center text-mk-body-sm text-link underline underline-offset-4"
              >
                All of {cluster.label}
              </Link>
            </div>
            <p className="mt-3 text-mk-body-sm text-fg-muted">
              {cluster.modules} modules · {cluster.routes} API routes
            </p>
          </div>
        ),
      }))}
    />
  );
}
