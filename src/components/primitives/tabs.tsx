'use client';

// 'use client': a tab set holds a selected index and a roving tabindex.

import { useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  panel: React.ReactNode;
}

/**
 * A real tab set: `role="tablist"`, roving tabindex, arrow keys, Home/End.
 *
 * **Manual activation** everywhere on this site — arrowing moves focus, Enter or Space
 * selects. Automatic activation would make a keyboard user trigger four product renderings
 * while simply navigating past the switcher, which is both a jank problem and a data problem.
 */
export function Tabs({
  items,
  label,
  orientation = 'horizontal',
  className,
  tablistClassName,
  tabClassName,
  activeTabClassName,
  panelClassName,
  onSelect,
}: {
  items: TabItem[];
  /** Accessible name for the tablist. Required — an unnamed tablist is an unnavigable one. */
  label: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tablistClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  panelClassName?: string;
  onSelect?: (id: string, index: number) => void;
}) {
  const uid = useId();
  const [selected, setSelected] = useState(0);
  const [focused, setFocused] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (next: number) => {
    const index = (next + items.length) % items.length;
    setFocused(index);
    refs.current[index]?.focus();
  };

  const select = (index: number) => {
    setSelected(index);
    const item = items[index];
    if (item && onSelect) onSelect(item.id, index);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (event.key === next) {
      event.preventDefault();
      move(focused + 1);
    } else if (event.key === prev) {
      event.preventDefault();
      move(focused - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      move(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      move(items.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(focused);
    }
  };

  const active = items[selected];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        onKeyDown={onKeyDown}
        className={tablistClassName}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${item.id}`}
            aria-selected={index === selected}
            aria-controls={`${uid}-panel-${item.id}`}
            tabIndex={index === focused ? 0 : -1}
            onFocus={() => setFocused(index)}
            onClick={() => {
              setFocused(index);
              select(index);
            }}
            className={cn(tabClassName, index === selected && activeTabClassName)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {active && (
        <div
          role="tabpanel"
          id={`${uid}-panel-${active.id}`}
          aria-labelledby={`${uid}-tab-${active.id}`}
          tabIndex={0}
          className={panelClassName}
        >
          {active.panel}
        </div>
      )}
    </div>
  );
}
