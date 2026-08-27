import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const chunks = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/g);
  return chunks.map((chunk, index) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-fg">
          {chunk.slice(2, -2)}
        </strong>
      );
    }
    if (chunk.startsWith("*") && chunk.endsWith("*")) {
      return (
        <em key={index} className="italic">
          {chunk.slice(1, -1)}
        </em>
      );
    }
    return <span key={index}>{chunk}</span>;
  });
}

export function RichText({ text, serif = false }: { text: string; serif?: boolean }) {
  const blocks = text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className={serif ? "font-display text-base leading-relaxed" : "text-sm leading-relaxed"}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const list = lines.every((line) => /^\s*([-*]|\d+\.)\s+/.test(line));
        if (list) {
          return (
            <ul key={i} className="mt-3 space-y-1.5 first:mt-0">
              {lines.map((line, j) => (
                <li
                  key={j}
                  className="relative pl-4 before:absolute before:left-0 before:text-subtle before:content-['–']"
                >
                  {inline(line.replace(/^\s*([-*]|\d+\.)\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-3 first:mt-0">
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 ? <br /> : null}
                {inline(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
