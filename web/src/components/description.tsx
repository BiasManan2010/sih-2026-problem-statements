"use client";

import { useMemo, type ReactNode } from "react";

const BOLD = /\*\*(.+?)\*\*/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  BOLD.lastIndex = 0;
  while ((match = BOLD.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    nodes.push(
      <strong key={`${keyBase}-b${i++}`} className="font-semibold">
        {match[1]}
      </strong>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Description({ text }: { text: string }) {
  const blocks = useMemo(() => {
    const lines = text.split("\n");
    const out: { type: "ul" | "p"; items: string[] }[] = [];
    let currentBullets: string[] | null = null;

    const flush = () => {
      if (currentBullets) {
        out.push({ type: "ul", items: currentBullets });
        currentBullets = null;
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flush();
        continue;
      }
      const bullet = trimmed.match(/^•\s*(.*)$/);
      if (bullet) {
        if (!currentBullets) currentBullets = [];
        currentBullets.push(bullet[1]);
      } else {
        flush();
        out.push({ type: "p", items: [trimmed] });
      }
    }
    flush();
    return out;
  }, [text]);

  let blockIndex = 0;
  return (
    <div className="space-y-4 text-sm leading-7 text-foreground/90">
      {blocks.map((block) => {
        const key = `b${blockIndex++}`;
        if (block.type === "ul") {
          return (
            <ul key={key} className="ml-5 space-y-2 list-disc marker:text-primary/60">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{renderInline(block.items[0], key)}</p>;
      })}
    </div>
  );
}
