import type { Block } from '../../content/articles';
import { CodeBlock } from './code-block';
import { Prose } from './index';

/**
 * Renders a structured body.
 *
 * Deliberately not Markdown or MDX at this layer: a closed union of block types cannot
 * contain markup an author did not intend, and it typechecks. The product's own public site
 * makes the same trade for the same reason — its renderer takes Markdown source and emits
 * React elements, never HTML.
 */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <Prose>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'h2':
            return (
              <h2 key={block.id} id={block.id}>
                {block.text}
              </h2>
            );
          case 'p':
            return <p key={index}>{block.text}</p>;
          case 'ul':
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case 'code':
            return (
              <CodeBlock key={index} label="Code sample" className="mt-4">
                {block.text}
              </CodeBlock>
            );
          case 'note':
            return (
              <aside
                key={index}
                className="mt-6 rounded-[--radius] border border-border bg-surface-muted p-4 text-mk-body-sm text-fg-muted"
              >
                {block.text}
              </aside>
            );
        }
      })}
    </Prose>
  );
}

/** A table of contents from the h2 blocks. Sticky on wide screens. */
export function TableOfContents({ blocks }: { blocks: Block[] }) {
  const headings = blocks.filter((block): block is Extract<Block, { kind: 'h2' }> => block.kind === 'h2');
  if (headings.length < 3) return null;

  return (
    <nav aria-labelledby="toc-heading" className="lg:sticky lg:top-24">
      <h2 id="toc-heading" className="text-caption font-medium uppercase tracking-wide text-fg-muted">
        On this page
      </h2>
      <ul className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-mk-body-sm text-fg-muted transition-colors duration-fast hover:text-fg"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
