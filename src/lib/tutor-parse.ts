import { asAdaptive, defaultAdaptation, seedAdaptation } from "./adaptive.ts";
import { DEFAULT_STEPS, type JourneyStep, type OpenSession, type TutorPayload } from "./types.ts";

export const DEFAULT_SUGGESTIONS = [
  "Começar pelos fundamentos",
  "Testar o que eu já sei",
  "Pegar um trecho difícil",
];

const GENERIC_REPLY =
  "Não consegui interpretar a última fala do guia. Responda de novo em uma frase, com as suas palavras.";

export function clip(text: unknown, max: number): string {
  if (text == null) return "";
  const value = typeof text === "string" ? text : String(text);
  const trimmed = value.trim();
  const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : 0;
  if (trimmed.length <= limit) return trimmed;
  return trimmed.slice(0, limit);
}

export function stripMarkdownFence(raw: string): string {
  const trimmed = raw.trim();
  const closed = trimmed.match(/^```(?:json|javascript|js)?\s*([\s\S]*?)```/i);
  if (closed?.[1]) return closed[1].trim();
  return trimmed.replace(/^```(?:json|javascript|js)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

export function parseJsonObject(raw: string): Record<string, unknown> | null {
  const cleaned = stripMarkdownFence(raw);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const value: unknown = JSON.parse(cleaned.slice(start, end + 1));
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

export function extractReplyField(raw: string): string {
  const match = raw.match(/"(?:reply|opening)"\s*:\s*"((?:\\.|[^"\\])*)"?/);
  if (!match?.[1]) return "";
  try {
    return JSON.parse(`"${match[1]}"`) as string;
  } catch {
    return match[1].replaceAll(String.raw`\n`, "\n").replaceAll(String.raw`\"`, '"');
  }
}

function looksLikeJsonDump(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.startsWith("```");
}

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function asStringArray(value: unknown, fallback: string[] = DEFAULT_SUGGESTIONS): string[] {
  if (!Array.isArray(value)) return fallback;
  const unique: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const next = item.trim();
    if (!next || unique.includes(next)) continue;
    unique.push(next);
    if (unique.length === 3) break;
  }
  return unique.length > 0 ? unique : fallback;
}

export function asSteps(value: unknown): JourneyStep[] {
  if (!Array.isArray(value) || value.length < 3) return DEFAULT_STEPS;
  const steps: JourneyStep[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const label = pickString(rec.label);
    if (!label) continue;
    steps.push({
      label: clip(label, 48),
      hint: clip(pickString(rec.hint) || "Siga as perguntas do guia.", 140),
    });
    if (steps.length === 4) break;
  }
  return steps.length >= 3 ? steps : DEFAULT_STEPS;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function asTutor(data: Record<string, unknown>, fallbackReply = ""): TutorPayload {
  const fromFields = pickString(data.reply) || pickString(data.opening);
  const fallback = looksLikeJsonDump(fallbackReply) ? "" : fallbackReply.trim();
  const reply = fromFields || fallback || GENERIC_REPLY;
  const adaptive = asAdaptive(data, defaultAdaptation());
  return {
    reply: looksLikeJsonDump(reply) ? GENERIC_REPLY : reply,
    stepIndex: clampInt(data.stepIndex, 0, 3, 0),
    progress: clampInt(data.progress, 0, 100, 8),
    suggestions: asStringArray(data.suggestions),
    ...adaptive,
  };
}

export function parseTutorTurn(raw: string): TutorPayload {
  const cleaned = stripMarkdownFence(raw);
  const parsed = parseJsonObject(cleaned);
  if (parsed) return asTutor(parsed, extractReplyField(cleaned));
  const extracted = extractReplyField(cleaned);
  if (extracted && !looksLikeJsonDump(extracted)) {
    return {
      reply: extracted,
      stepIndex: 0,
      progress: 8,
      suggestions: DEFAULT_SUGGESTIONS,
      ...defaultAdaptation(),
    };
  }
  if (cleaned && !looksLikeJsonDump(cleaned)) {
    return {
      reply: cleaned,
      stepIndex: 0,
      progress: 8,
      suggestions: DEFAULT_SUGGESTIONS,
      ...defaultAdaptation(),
    };
  }
  return {
    reply: GENERIC_REPLY,
    stepIndex: 0,
    progress: 8,
    suggestions: DEFAULT_SUGGESTIONS,
    ...defaultAdaptation(),
  };
}

export function parseOpenSession(raw: string, fileName: string): OpenSession {
  const cleaned = stripMarkdownFence(raw);
  const parsed = parseJsonObject(cleaned) ?? {};
  const tutor = parseTutorTurn(raw);
  const title = clip(pickString(parsed.title) || fileName.replace(/\.pdf$/i, ""), 80);
  const subject = clip(pickString(parsed.subject) || "Sessão de estudo", 80);
  const concepts = asStringArray(parsed.concepts, [
    "Ideia central",
    "Tensão do texto",
    "Aplicação",
  ]);
  const adaptive = seedAdaptation(concepts, tutor);
  return {
    title,
    subject,
    concepts,
    steps: asSteps(parsed.steps),
    ...tutor,
    ...adaptive,
    stepIndex: 0,
  };
}
