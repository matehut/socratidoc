export const MAX_CHARS = 20_000;

export function truncateDocument(text: string, max = MAX_CHARS) {
  const trimmed = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}\n\n[Documento truncado para caber no tutor.]`;
}
