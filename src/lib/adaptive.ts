import type {
  AdaptiveState,
  LearnerLevel,
  MasteryItem,
  Scaffolding,
} from "./types.ts";

export const LEVELS: LearnerLevel[] = ["novice", "developing", "proficient", "mastery"];
export const SCAFFOLDS: Scaffolding[] = ["heavy", "moderate", "light", "none"];

export const LEVEL_COPY: Record<LearnerLevel, { label: string; note: string; hint: string }> = {
  novice: {
    label: "Iniciante",
    note: "Ainda estou mapeando o que você já sabe.",
    hint: "Vocabulário e analogias",
  },
  developing: {
    label: "Em desenvolvimento",
    note: "Você já tem o chão. Vou pedir conexões, não definições.",
    hint: "Relações entre ideias",
  },
  proficient: {
    label: "Seguro",
    note: "Hora de aplicar o texto a um caso concreto.",
    hint: "Caso concreto e previsão",
  },
  mastery: {
    label: "Domínio",
    note: "Agora você ensina. Eu só aponto o furo.",
    hint: "Ensine de volta",
  },
};

export const LEVEL_LABELS: Record<LearnerLevel, string> = {
  novice: LEVEL_COPY.novice.label,
  developing: LEVEL_COPY.developing.label,
  proficient: LEVEL_COPY.proficient.label,
  mastery: LEVEL_COPY.mastery.label,
};

export const SCAFFOLD_LABELS: Record<Scaffolding, string> = {
  heavy: "Andaimes",
  moderate: "Pistas",
  light: "Desafio",
  none: "Ensine de volta",
};

const LEVEL_ALIASES: Record<string, LearnerLevel> = {
  novice: "novice",
  iniciante: "novice",
  beginner: "novice",
  basico: "novice",
  developing: "developing",
  desenvolvimento: "developing",
  "em desenvolvimento": "developing",
  intermediario: "developing",
  intermediate: "developing",
  proficient: "proficient",
  avancado: "proficient",
  advanced: "proficient",
  seguro: "proficient",
  fluency: "proficient",
  mastery: "mastery",
  dominio: "mastery",
  expert: "mastery",
  mestre: "mastery",
};

const SCAFFOLD_ALIASES: Record<string, Scaffolding> = {
  heavy: "heavy",
  denso: "heavy",
  andaimes: "heavy",
  pesado: "heavy",
  moderate: "moderate",
  moderado: "moderate",
  pistas: "moderate",
  medio: "moderate",
  light: "light",
  leve: "light",
  desafio: "light",
  none: "none",
  nenhum: "none",
  nada: "none",
  zero: "none",
};

const LOST_ANSWER =
  /^(ok|okay|sim|nao|n\/s|idk|uhum|talvez|sei la)|nao sei|explica isso|o que e isso/i;

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function clipText(value: unknown, max: number): string {
  if (value == null) return "";
  const text = typeof value === "string" ? value : String(value);
  const trimmed = text.trim();
  const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : 0;
  if (trimmed.length <= limit) return trimmed;
  return trimmed.slice(0, limit);
}

export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function asLevel(value: unknown, fallback: LearnerLevel = "novice"): LearnerLevel {
  if (typeof value !== "string" || !value.trim()) return fallback;
  return LEVEL_ALIASES[fold(value)] ?? fallback;
}

export function asScaffolding(value: unknown, fallback: Scaffolding = "heavy"): Scaffolding {
  if (typeof value !== "string" || !value.trim()) return fallback;
  return SCAFFOLD_ALIASES[fold(value)] ?? fallback;
}

export function complexityFor(level: LearnerLevel): number {
  return levelIndex(level) + 1;
}

export function levelIndex(level: LearnerLevel): number {
  const index = LEVELS.indexOf(level);
  return index < 0 ? 0 : index;
}

export function scaffoldingFor(level: LearnerLevel): Scaffolding {
  if (level === "developing") return "moderate";
  if (level === "proficient") return "light";
  if (level === "mastery") return "none";
  return "heavy";
}

export function clampLevelJump(from: LearnerLevel, to: LearnerLevel): LearnerLevel {
  const start = LEVELS.indexOf(from);
  const end = LEVELS.indexOf(to);
  if (start < 0) return to;
  if (end < 0) return from;
  if (end > start + 1) return LEVELS[start + 1] ?? from;
  if (end < start - 1) return LEVELS[start - 1] ?? from;
  return to;
}

export function defaultAdaptation(concepts: string[] = []): AdaptiveState {
  return {
    level: "novice",
    complexity: 1,
    scaffolding: "heavy",
    adaptationNote: LEVEL_COPY.novice.note,
    mastery: uniqueConcepts(concepts).map((concept) => ({ concept, score: 0 })),
  };
}

function uniqueConcepts(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  const unique: string[] = [];
  for (const item of list) {
    const concept = clipText(item, 48);
    if (!concept || unique.includes(concept)) continue;
    unique.push(concept);
    if (unique.length === 6) break;
  }
  return unique;
}

export function parseMastery(value: unknown, concepts: string[] = []): MasteryItem[] {
  const items: MasteryItem[] = [];
  const seen = new Set<string>();
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;
      const concept = clipText(rec.concept, 48);
      if (!concept || seen.has(concept)) continue;
      seen.add(concept);
      items.push({ concept, score: clampInt(rec.score, 0, 100, 0) });
      if (items.length === 6) break;
    }
  }
  for (const concept of uniqueConcepts(concepts)) {
    if (seen.has(concept)) continue;
    items.push({ concept, score: 0 });
    seen.add(concept);
    if (items.length === 6) break;
  }
  return items;
}

function blendScore(previous: number, incoming: number): number {
  const delta = incoming - previous;
  const capped = Math.max(-20, Math.min(24, Math.round(delta * 0.5)));
  return Math.min(100, Math.max(0, previous + capped));
}

export function mergeMastery(
  previous: MasteryItem[] = [],
  incoming: MasteryItem[] = [],
  concepts: string[] = [],
): MasteryItem[] {
  const names = uniqueConcepts([
    ...concepts,
    ...previous.map((item) => item.concept),
    ...incoming.map((item) => item.concept),
  ]);
  const prevMap = new Map(previous.map((item) => [item.concept, item.score]));
  const nextMap = new Map<string, number>();
  for (const item of incoming) {
    const current = nextMap.get(item.concept);
    nextMap.set(item.concept, current == null ? item.score : Math.max(current, item.score));
  }
  return names.slice(0, 6).map((concept) => {
    const prev = prevMap.get(concept) ?? 0;
    const next = nextMap.has(concept) ? (nextMap.get(concept) as number) : prev;
    return { concept, score: blendScore(prev, next) };
  });
}

export function localMasteryHint(answer: string, concepts: string[] = []): MasteryItem[] {
  const haystack = fold(answer);
  if (!haystack) return uniqueConcepts(concepts).map((concept) => ({ concept, score: 0 }));
  return uniqueConcepts(concepts).map((concept) => ({
    concept,
    score: haystack.includes(fold(concept)) ? 28 : 0,
  }));
}

export function inferLevelFromAnswer(answer: string, concepts: string[] = []): LearnerLevel {
  const text = answer.trim();
  if (!text) return "novice";
  const folded = fold(text);
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 4 || LOST_ANSWER.test(folded) || folded.endsWith("?")) return "novice";
  const hits = uniqueConcepts(concepts).filter((concept) => folded.includes(fold(concept))).length;
  const connective = /porque|pois|portanto|logo|ou seja|por isso|assim/.test(folded);
  if (hits >= 2 && words.length >= 22) return "mastery";
  if ((hits >= 1 && words.length >= 16) || (connective && hits >= 1 && words.length >= 12)) {
    return "proficient";
  }
  if (connective || hits >= 1 || words.length >= 12) return "developing";
  return "novice";
}

function asNote(value: unknown, fallback: string): string {
  const note = clipText(value, 180);
  if (!note || note.startsWith("{") || note.startsWith("[") || /\b(novice|developing|proficient|mastery|scaffolding|stepIndex|complexity)\b/i.test(note)) {
    return fallback;
  }
  return note;
}

export function asAdaptive(
  data: Record<string, unknown> | null | undefined,
  fallback: AdaptiveState = defaultAdaptation(),
): AdaptiveState {
  if (!data) return fallback;
  const mastery = parseMastery(
    data.mastery,
    fallback.mastery.map((item) => item.concept),
  );
  return {
    level: asLevel(data.level, fallback.level),
    complexity: clampInt(data.complexity, 1, 4, fallback.complexity),
    scaffolding: asScaffolding(data.scaffolding, fallback.scaffolding),
    adaptationNote: asNote(data.adaptationNote, fallback.adaptationNote),
    mastery: mastery.length > 0 ? mastery : fallback.mastery,
  };
}

export function parseAdaptation(
  data: Record<string, unknown> | null | undefined,
  concepts: string[] = [],
): AdaptiveState {
  return asAdaptive(data, defaultAdaptation(concepts));
}

export function seedAdaptation(
  concepts: string[],
  incoming?: Partial<AdaptiveState>,
): AdaptiveState {
  const base = defaultAdaptation(concepts);
  if (!incoming) return base;
  const level = clampLevelJump("novice", asLevel(incoming.level, "novice"));
  return {
    level,
    complexity: Math.min(2, clampInt(incoming.complexity, 1, 4, complexityFor(level))),
    scaffolding: scaffoldingFor(level),
    adaptationNote: asNote(incoming.adaptationNote, LEVEL_COPY[level].note),
    mastery: parseMastery(incoming.mastery, concepts),
  };
}

export function applyTurnAdaptation({
  previous,
  turn,
  userAnswer,
  concepts,
}: {
  previous: AdaptiveState;
  turn: Partial<AdaptiveState>;
  userAnswer: string;
  concepts: string[];
}): AdaptiveState {
  const modeled = asLevel(turn.level, previous.level);
  const inferred = inferLevelFromAnswer(userAnswer, concepts);
  const desired = LEVELS.indexOf(inferred) > LEVELS.indexOf(modeled) ? inferred : modeled;
  const level = clampLevelJump(previous.level, desired);
  const local = localMasteryHint(userAnswer, concepts);
  let complexity = clampInt(turn.complexity, 1, 4, complexityFor(level));
  if (complexity > previous.complexity + 1) complexity = previous.complexity + 1;
  if (complexity < previous.complexity - 1) complexity = Math.max(1, previous.complexity - 1);
  const note =
    level === modeled
      ? asNote(turn.adaptationNote, LEVEL_COPY[level].note)
      : LEVEL_COPY[level].note;
  return {
    level,
    complexity,
    scaffolding: asScaffolding(turn.scaffolding, scaffoldingFor(level)),
    adaptationNote: note,
    mastery: mergeMastery(previous.mastery, [...(turn.mastery ?? []), ...local], concepts),
  };
}

export function buildAdaptivePrompt(model: AdaptiveState): string {
  const mastery =
    model.mastery.map((item) => `${item.concept}:${item.score}`).join(", ") || "sem notas";
  return `Modelo do aluno (adapte a pergunta; máx. 1 nível por turno):
level=${model.level}
complexity=${model.complexity}
scaffolding=${model.scaffolding}
mastery=${mastery}
nota=${model.adaptationNote}`;
}
