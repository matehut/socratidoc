import { clip } from "./tutor-parse.ts";

export const SPEECH_MAX = 1_200;

export function toSpeechText(markdown: string, max = SPEECH_MAX): string {
  const plain = markdown
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, (match, offset, source: string) => {
      const prev = source[offset - 1];
      return prev && /[.!?…]/.test(prev) ? " " : ". ";
    })
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clip(plain, max);
}
