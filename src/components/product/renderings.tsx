import { cn } from '../../lib/cn';
import {
  boardCards,
  courseDiff,
  itemAnalysis,
  pipelineStages,
  riskSignals,
  roleDashboards,
  seededPeople,
  seededTenant,
  verifyExample,
} from '../../content/demo-data';
import { FramePanel, FrameSidebar, ProductFrame } from './frame';

/* ------------------------------------------------------------- Dashboards */

const OWNER_NAV = ['Dashboard', 'Admissions', 'Courses', 'Batches', 'Finance', 'People', 'Reports', 'Settings'];
const TEACHER_NAV = ['Dashboard', 'My courses', 'Assessments', 'Assignments', 'Gradebook', 'Live', 'Attendance', 'Risk'];
const STUDENT_NAV = ['Home', 'My learning', 'Assessments', 'Assignments', 'Grades', 'Certificates', 'Live', 'Fees'];
const PARENT_NAV = ['Home', 'My children', 'Attendance', 'Marks', 'Fees'];

const NAV: Record<keyof typeof roleDashboards, string[]> = {
  owner: OWNER_NAV,
  teacher: TEACHER_NAV,
  student: STUDENT_NAV,
  parent: PARENT_NAV,
};

const ROUTE: Record<keyof typeof roleDashboards, string> = {
  owner: '/dashboard',
  teacher: '/dashboard',
  student: '/learn',
  parent: '/family',
};

/**
 * One product surface, four roles.
 *
 * This is the architecture claim performed rather than asserted: one login, one application,
 * and the permissions decide what is *inside* a page rather than which page you get.
 */
export function RoleDashboard({ role }: { role: keyof typeof roleDashboards }) {
  const data = roleDashboards[role];

  return (
    <ProductFrame route={ROUTE[role]} provenance="seed" caption={data.caption}>
      <div className="flex gap-4">
        <FrameSidebar items={NAV[role]} active={NAV[role][0] ?? ''} />
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-mk-body-sm font-medium text-fg">{data.person}</span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-caption text-fg-muted">
              {data.role}
            </span>
            <span className="text-caption text-fg-muted">· {seededTenant.name}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.panels.map((panel) => (
              <FramePanel key={panel.label} title={panel.label}>
                {/*
                  The meta sits under the label rather than beside it. A panel in this frame is
                  about 220 pixels wide, and two competing strings on one line wrap into each
                  other — which is also how the product's own dashboard cards are laid out.
                */}
                <ul className="space-y-2.5">
                  {panel.lines.map((line) => (
                    <li key={line.text}>
                      <span
                        className={cn(
                          'block text-caption',
                          line.tone === 'warning'
                            ? 'font-medium text-warning-text'
                            : line.tone === 'accent'
                              ? 'font-medium text-link'
                              : 'text-fg',
                        )}
                      >
                        {line.text}
                      </span>
                      {line.meta && (
                        <span className="mt-0.5 block text-caption text-fg-muted">{line.meta}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </FramePanel>
            ))}
          </div>
        </div>
      </div>
    </ProductFrame>
  );
}

/* -------------------------------------------------------- Admissions board */

export function AdmissionsBoard() {
  return (
    <ProductFrame
      route="/crm"
      provenance="illustrative"
      caption="Your stage names. Our stage meaning."
    >
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {pipelineStages.map((stage) => {
          const cards = boardCards.filter((card) => card.stage === stage);
          return (
            <div key={stage} className="rounded-[--radius] border border-border bg-surface-muted p-2">
              <p className="mb-2 flex items-baseline justify-between text-caption font-medium text-fg-muted">
                <span>{stage}</span>
                <span className="tabular-nums">{cards.length}</span>
              </p>
              <ul className="space-y-2">
                {cards.map((card) => (
                  <li key={card.name} className="rounded-sm border border-border bg-surface p-2">
                    <p className="truncate text-caption font-medium text-fg">{card.name}</p>
                    <p className="mt-0.5 truncate text-caption text-fg-muted">
                      {card.source} · {card.owner}
                    </p>
                    {card.note && (
                      <p className="mt-1 inline-flex rounded-sm bg-warning/10 px-1.5 py-0.5 text-caption text-warning-text">
                        {card.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-caption text-fg-muted">
        Move with a select and reorder with arrow buttons — there is no drag-and-drop, because
        drag works from neither a keyboard nor a phone.
      </p>
    </ProductFrame>
  );
}

/* ------------------------------------------------------ Certificate verify */

export function VerifyCertificate() {
  return (
    <ProductFrame
      route={`/verify/${verifyExample.code}`}
      provenance="seed"
      caption="The one page in the product with no session behind it."
    >
      <div className="mx-auto max-w-sm rounded-[--radius] border border-border bg-surface p-5">
        <h4 className="text-mk-body font-semibold text-fg">Certificate verification</h4>
        <p className="mt-2 text-caption font-medium text-success-text">This certificate is valid.</p>
        <dl className="mt-4 space-y-2.5 text-caption">
          {[
            ['Learner', verifyExample.learnerName],
            ['Course', verifyExample.courseTitle],
            ['Issued by', verifyExample.institute],
            ['Issued on', verifyExample.issuedOn],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-fg-muted">{label}</dt>
              <dd className="font-medium text-fg">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 border-t border-border pt-3 text-caption text-fg-muted">
          Code <span className="font-mono">{verifyExample.code}</span>. No account needed.
        </p>
      </div>
    </ProductFrame>
  );
}

/* ---------------------------------------------------------- Roles & scopes */

/**
 * Rendered from the product's real role templates. Every name and scope in this table is a
 * row in `packages/authz/src/catalog.ts`, not a marketing simplification.
 */
export function RolesMatrix() {
  const rows = [
    { role: 'Super Admin', scope: 'GLOBAL', holds: 'Everything, and every action audited' },
    { role: 'Institute Admin', scope: 'TENANT', holds: 'One institute, end to end' },
    { role: 'Academic Head', scope: 'TENANT', holds: 'Curriculum quality and course approvals' },
    { role: 'Teacher', scope: 'TENANT', holds: 'Their own courses and batches' },
    { role: 'Content Author', scope: 'TENANT', holds: 'Writes and submits, cannot publish' },
    { role: 'Admissions Counsellor', scope: 'TENANT', holds: 'Enquiries through to enrolment' },
    { role: 'Finance Officer', scope: 'TENANT', holds: 'Invoices, payments, pricing' },
    { role: 'HR Manager', scope: 'TENANT', holds: 'Staff records, leave, the register' },
    { role: 'Placement Officer', scope: 'TENANT', holds: 'Drives, openings, panels' },
    { role: 'Student', scope: 'RECORD', holds: 'Their own records only' },
    { role: 'Parent', scope: 'RECORD', holds: 'Their own children, read-only' },
  ];

  return (
    <ProductFrame
      route="/admin/roles"
      provenance="catalog"
      caption="Eleven templates you can clone and reshape. Nothing in the code reads a role’s name."
    >
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.role} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
            <span className="w-44 shrink-0 text-caption font-medium text-fg">{row.role}</span>
            <span className="rounded-sm bg-surface-muted px-1.5 py-0.5 font-mono text-caption text-fg-muted">
              {row.scope}
            </span>
            <span className="text-caption text-fg-muted">{row.holds}</span>
          </li>
        ))}
      </ul>
    </ProductFrame>
  );
}

/* ------------------------------------------------------------- Item analysis */

export function ItemAnalysis() {
  return (
    <ProductFrame
      route="/assessments/1/analysis"
      provenance="illustrative"
      caption="Which question was the problem — not just who failed."
    >
      <table className="w-full text-caption">
        <caption className="pb-2 text-start text-caption text-fg-muted">
          Item analysis: how many got each question right, and how well it separated the cohort.
        </caption>
        <thead>
          <tr className="border-b border-border text-fg-muted">
            <th scope="col" className="py-1.5 text-start font-medium">
              Question
            </th>
            <th scope="col" className="py-1.5 text-start font-medium">
              Correct
            </th>
            <th scope="col" className="py-1.5 text-start font-medium">
              Discrimination
            </th>
          </tr>
        </thead>
        <tbody>
          {itemAnalysis.map((item) => (
            <tr key={item.q} className="border-b border-border last:border-0">
              <th scope="row" className="py-2 text-start font-medium text-fg">
                {item.q}
              </th>
              <td className="py-2">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-muted">
                    <span
                      className="block h-full rounded-full bg-viz-1"
                      style={{ width: `${item.correctPct}%` }}
                    />
                  </span>
                  <span className="tabular-nums text-fg-muted">{item.correctPct}%</span>
                </span>
              </td>
              <td
                className={cn(
                  'py-2 tabular-nums',
                  item.discrimination < 0.15 ? 'font-medium text-warning-text' : 'text-fg-muted',
                )}
              >
                {item.discrimination.toFixed(2)}
                {item.discrimination < 0.15 && <span className="ms-1.5">· review this one</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ProductFrame>
  );
}

/* ----------------------------------------------------------------- Risk */

export function RiskList() {
  return (
    <ProductFrame
      route="/risk"
      provenance="illustrative"
      caption="A score is useless without the signals that produced it, so it never appears without them."
    >
      <ul className="space-y-2.5">
        {riskSignals.map((row) => (
          <li key={row.learner} className="rounded-[--radius] border border-border bg-surface p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-caption font-medium text-fg">{row.learner}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-caption font-medium',
                  row.band === 'high'
                    ? 'bg-danger/10 text-danger-text'
                    : 'bg-warning/10 text-warning-text',
                )}
              >
                {row.band === 'high' ? 'Higher risk' : 'Watch'}
              </span>
            </div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {row.signals.map((signal) => (
                <li
                  key={signal}
                  className="rounded-sm bg-surface-muted px-2 py-0.5 text-caption text-fg-muted"
                >
                  {signal}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </ProductFrame>
  );
}

/* ------------------------------------------------------------ Course diff */

export function CourseDiff() {
  return (
    <ProductFrame
      route="/admin/courses/1"
      provenance="illustrative"
      caption="Publishing snapshots a version. Restoring rebuilds from it — so the diff is what you are agreeing to."
    >
      <ul className="space-y-1.5 font-mono text-caption">
        {courseDiff.map((line) => (
          <li
            key={line.text}
            className={cn(
              'flex gap-2 rounded-sm px-2 py-1.5',
              line.kind === 'added' && 'bg-success/10 text-success-text',
              line.kind === 'removed' && 'bg-danger/10 text-danger-text',
              line.kind === 'changed' && 'bg-surface-muted text-fg',
            )}
          >
            <span aria-hidden="true" className="shrink-0">
              {line.kind === 'added' ? '+' : line.kind === 'removed' ? '−' : '~'}
            </span>
            <span>
              <span className="sr-only">
                {line.kind === 'added' ? 'Added: ' : line.kind === 'removed' ? 'Removed: ' : 'Changed: '}
              </span>
              {line.text}
            </span>
          </li>
        ))}
      </ul>
    </ProductFrame>
  );
}

/* ---------------------------------------------------------------- People */

export function PeopleList() {
  return (
    <ProductFrame
      route="/admin/users"
      provenance="seed"
      caption="People are added by invitation only. There is no route where an administrator sets somebody else’s password."
    >
      <ul className="divide-y divide-border">
        {seededPeople.map((person) => (
          <li key={person.name} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-caption font-medium text-brand-600"
            >
              {person.name
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </span>
            <span className="text-caption font-medium text-fg">{person.name}</span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-caption text-fg-muted">
              {person.role}
            </span>
            <span className="ms-auto font-mono text-caption text-fg-muted">{person.scope}</span>
          </li>
        ))}
      </ul>
    </ProductFrame>
  );
}
