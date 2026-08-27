import { defaultAdaptation, parseMastery, asLevel, asScaffolding, clampInt } from "./adaptive.ts";
import { DEFAULT_STEPS, type ChatMessage, type JourneyStep, type StudioSession } from "./types.ts";

export const SESSION_KEY = "socraticpdf.session.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const messages: ChatMessage[] = [];
  for (const item of value.slice(-24)) {
    if (!isRecord(item)) continue;
    const role = item.role === "assistant" ? "assistant" : item.role === "user" ? "user" : null;
    const content = typeof item.content === "string" ? item.content.trim() : "";
    const id = typeof item.id === "string" && item.id ? item.id : `msg_${messages.length}`;
    if (!role || !content) continue;
    messages.push({ id, role, content });
  }
  return messages.length > 0 ? messages : null;
}

function asSteps(value: unknown): JourneyStep[] {
  if (!Array.isArray(value) || value.length < 3) return DEFAULT_STEPS;
  const steps: JourneyStep[] = [];
  for (const item of value.slice(0, 4)) {
    if (!isRecord(item)) continue;
    const label = typeof item.label === "string" ? item.label.trim() : "";
    if (!label) continue;
    const hint = typeof item.hint === "string" && item.hint.trim() ? item.hint.trim() : "Siga as perguntas do guia.";
    steps.push({ label, hint });
  }
  return steps.length >= 3 ? steps : DEFAULT_STEPS;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 8);
}

export function parseStoredSession(raw: unknown): StudioSession | null {
  const root = typeof raw === "string" ? safeJson(raw) : raw;
  if (!isRecord(root)) return null;
  const session = isRecord(root.session) ? root.session : root;
  const messages = asMessages(session.messages);
  const documentText = typeof session.documentText === "string" ? session.documentText.trim() : "";
  const fileName = typeof session.fileName === "string" ? session.fileName.trim() : "";
  if (!messages || documentText.length < 80 || !fileName) return null;

  const pageCount = session.pageCount == null ? null : Number(session.pageCount);
  const activeStep = Number(session.activeStep);
  const progress = Number(session.progress);
  const concepts = asStringList(session.concepts);
  const adaptive = defaultAdaptation(concepts);

  return {
    fileName,
    pageCount: Number.isFinite(pageCount) && pageCount !== null ? Math.max(1, Math.round(pageCount)) : null,
    documentText,
    title: typeof session.title === "string" && session.title.trim() ? session.title.trim() : fileName.replace(/\.pdf$/i, ""),
    subject: typeof session.subject === "string" && session.subject.trim() ? session.subject.trim() : "Sessão de estudo",
    concepts,
    steps: asSteps(session.steps),
    activeStep: Number.isFinite(activeStep) ? Math.min(3, Math.max(0, Math.round(activeStep))) : 0,
    progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 8,
    messages,
    suggestions: asStringList(session.suggestions).slice(0, 3),
    level: asLevel(session.level, adaptive.level),
    complexity: clampInt(session.complexity, 1, 4, adaptive.complexity),
    scaffolding: asScaffolding(session.scaffolding, adaptive.scaffolding),
    adaptationNote:
      typeof session.adaptationNote === "string" && session.adaptationNote.trim()
        ? session.adaptationNote.trim().slice(0, 180)
        : adaptive.adaptationNote,
    mastery: parseMastery(session.mastery, concepts),
  };
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function serializeSession(session: StudioSession): string {
  return JSON.stringify({
    v: 1,
    savedAt: Date.now(),
    session: {
      ...session,
      documentText: session.documentText.slice(0, 20_000),
      messages: session.messages.slice(-24),
    },
  });
}

export function loadSession(): StudioSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return parseStoredSession(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function saveSession(session: StudioSession) {
  if (typeof localStorage === "undefined") return;
  if (session.messages.length === 0) return;
  try {
    localStorage.setItem(SESSION_KEY, serializeSession(session));
  } catch {
    /* quota */
  }
}

export function clearSession() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
