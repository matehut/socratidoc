//#region node_modules/.nitro/vite/services/ssr/assets/speech-BjpHsBQw.js
var LEVELS = [
	"novice",
	"developing",
	"proficient",
	"mastery"
];
var LEVEL_COPY = {
	novice: {
		label: "Iniciante",
		note: "Ainda estou mapeando o que você já sabe.",
		hint: "Vocabulário e analogias"
	},
	developing: {
		label: "Em desenvolvimento",
		note: "Você já tem o chão. Vou pedir conexões, não definições.",
		hint: "Relações entre ideias"
	},
	proficient: {
		label: "Seguro",
		note: "Hora de aplicar o texto a um caso concreto.",
		hint: "Caso concreto e previsão"
	},
	mastery: {
		label: "Domínio",
		note: "Agora você ensina. Eu só aponto o furo.",
		hint: "Ensine de volta"
	}
};
LEVEL_COPY.novice.label, LEVEL_COPY.developing.label, LEVEL_COPY.proficient.label, LEVEL_COPY.mastery.label;
var LEVEL_ALIASES = {
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
	mestre: "mastery"
};
var SCAFFOLD_ALIASES = {
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
	zero: "none"
};
var LOST_ANSWER = /^(ok|okay|sim|nao|n\/s|idk|uhum|talvez|sei la)|nao sei|explica isso|o que e isso/i;
function fold(value) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}
function clipText(value, max) {
	if (value == null) return "";
	const trimmed = (typeof value === "string" ? value : String(value)).trim();
	const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : 0;
	if (trimmed.length <= limit) return trimmed;
	return trimmed.slice(0, limit);
}
function clampInt$1(value, min, max, fallback) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, Math.round(n)));
}
function asLevel(value, fallback = "novice") {
	if (typeof value !== "string" || !value.trim()) return fallback;
	return LEVEL_ALIASES[fold(value)] ?? fallback;
}
function asScaffolding(value, fallback = "heavy") {
	if (typeof value !== "string" || !value.trim()) return fallback;
	return SCAFFOLD_ALIASES[fold(value)] ?? fallback;
}
function complexityFor(level) {
	return levelIndex(level) + 1;
}
function levelIndex(level) {
	const index = LEVELS.indexOf(level);
	return index < 0 ? 0 : index;
}
function scaffoldingFor(level) {
	if (level === "developing") return "moderate";
	if (level === "proficient") return "light";
	if (level === "mastery") return "none";
	return "heavy";
}
function clampLevelJump(from, to) {
	const start = LEVELS.indexOf(from);
	const end = LEVELS.indexOf(to);
	if (start < 0) return to;
	if (end < 0) return from;
	if (end > start + 1) return LEVELS[start + 1] ?? from;
	if (end < start - 1) return LEVELS[start - 1] ?? from;
	return to;
}
function defaultAdaptation(concepts = []) {
	return {
		level: "novice",
		complexity: 1,
		scaffolding: "heavy",
		adaptationNote: LEVEL_COPY.novice.note,
		mastery: uniqueConcepts(concepts).map((concept) => ({
			concept,
			score: 0
		}))
	};
}
function uniqueConcepts(list) {
	if (!Array.isArray(list)) return [];
	const unique = [];
	for (const item of list) {
		const concept = clipText(item, 48);
		if (!concept || unique.includes(concept)) continue;
		unique.push(concept);
		if (unique.length === 6) break;
	}
	return unique;
}
function parseMastery(value, concepts = []) {
	const items = [];
	const seen = /* @__PURE__ */ new Set();
	if (Array.isArray(value)) for (const item of value) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const concept = clipText(rec.concept, 48);
		if (!concept || seen.has(concept)) continue;
		seen.add(concept);
		items.push({
			concept,
			score: clampInt$1(rec.score, 0, 100, 0)
		});
		if (items.length === 6) break;
	}
	for (const concept of uniqueConcepts(concepts)) {
		if (seen.has(concept)) continue;
		items.push({
			concept,
			score: 0
		});
		seen.add(concept);
		if (items.length === 6) break;
	}
	return items;
}
function blendScore(previous, incoming) {
	const delta = incoming - previous;
	const capped = Math.max(-20, Math.min(24, Math.round(delta * .5)));
	return Math.min(100, Math.max(0, previous + capped));
}
function mergeMastery(previous = [], incoming = [], concepts = []) {
	const names = uniqueConcepts([
		...concepts,
		...previous.map((item) => item.concept),
		...incoming.map((item) => item.concept)
	]);
	const prevMap = new Map(previous.map((item) => [item.concept, item.score]));
	const nextMap = /* @__PURE__ */ new Map();
	for (const item of incoming) {
		const current = nextMap.get(item.concept);
		nextMap.set(item.concept, current == null ? item.score : Math.max(current, item.score));
	}
	return names.slice(0, 6).map((concept) => {
		const prev = prevMap.get(concept) ?? 0;
		return {
			concept,
			score: blendScore(prev, nextMap.has(concept) ? nextMap.get(concept) : prev)
		};
	});
}
function localMasteryHint(answer, concepts = []) {
	const haystack = fold(answer);
	if (!haystack) return uniqueConcepts(concepts).map((concept) => ({
		concept,
		score: 0
	}));
	return uniqueConcepts(concepts).map((concept) => ({
		concept,
		score: haystack.includes(fold(concept)) ? 28 : 0
	}));
}
function inferLevelFromAnswer(answer, concepts = []) {
	const text = answer.trim();
	if (!text) return "novice";
	const folded = fold(text);
	const words = text.split(/\s+/).filter(Boolean);
	if (words.length < 4 || LOST_ANSWER.test(folded) || folded.endsWith("?")) return "novice";
	const hits = uniqueConcepts(concepts).filter((concept) => folded.includes(fold(concept))).length;
	const connective = /porque|pois|portanto|logo|ou seja|por isso|assim/.test(folded);
	if (hits >= 2 && words.length >= 22) return "mastery";
	if (hits >= 1 && words.length >= 16 || connective && hits >= 1 && words.length >= 12) return "proficient";
	if (connective || hits >= 1 || words.length >= 12) return "developing";
	return "novice";
}
function asNote(value, fallback) {
	const note = clipText(value, 180);
	if (!note || note.startsWith("{") || note.startsWith("[") || /\b(novice|developing|proficient|mastery|scaffolding|stepIndex|complexity)\b/i.test(note)) return fallback;
	return note;
}
function asAdaptive(data, fallback = defaultAdaptation()) {
	if (!data) return fallback;
	const mastery = parseMastery(data.mastery, fallback.mastery.map((item) => item.concept));
	return {
		level: asLevel(data.level, fallback.level),
		complexity: clampInt$1(data.complexity, 1, 4, fallback.complexity),
		scaffolding: asScaffolding(data.scaffolding, fallback.scaffolding),
		adaptationNote: asNote(data.adaptationNote, fallback.adaptationNote),
		mastery: mastery.length > 0 ? mastery : fallback.mastery
	};
}
function seedAdaptation(concepts, incoming) {
	const base = defaultAdaptation(concepts);
	if (!incoming) return base;
	const level = clampLevelJump("novice", asLevel(incoming.level, "novice"));
	return {
		level,
		complexity: Math.min(2, clampInt$1(incoming.complexity, 1, 4, complexityFor(level))),
		scaffolding: scaffoldingFor(level),
		adaptationNote: asNote(incoming.adaptationNote, LEVEL_COPY[level].note),
		mastery: parseMastery(incoming.mastery, concepts)
	};
}
function applyTurnAdaptation({ previous, turn, userAnswer, concepts }) {
	const modeled = asLevel(turn.level, previous.level);
	const inferred = inferLevelFromAnswer(userAnswer, concepts);
	const desired = LEVELS.indexOf(inferred) > LEVELS.indexOf(modeled) ? inferred : modeled;
	const level = clampLevelJump(previous.level, desired);
	const local = localMasteryHint(userAnswer, concepts);
	let complexity = clampInt$1(turn.complexity, 1, 4, complexityFor(level));
	if (complexity > previous.complexity + 1) complexity = previous.complexity + 1;
	if (complexity < previous.complexity - 1) complexity = Math.max(1, previous.complexity - 1);
	const note = level === modeled ? asNote(turn.adaptationNote, LEVEL_COPY[level].note) : LEVEL_COPY[level].note;
	return {
		level,
		complexity,
		scaffolding: asScaffolding(turn.scaffolding, scaffoldingFor(level)),
		adaptationNote: note,
		mastery: mergeMastery(previous.mastery, [...turn.mastery ?? [], ...local], concepts)
	};
}
function buildAdaptivePrompt(model) {
	const mastery = model.mastery.map((item) => `${item.concept}:${item.score}`).join(", ") || "sem notas";
	return `Modelo do aluno (adapte a pergunta; máx. 1 nível por turno):
level=${model.level}
complexity=${model.complexity}
scaffolding=${model.scaffolding}
mastery=${mastery}
nota=${model.adaptationNote}`;
}
var DEFAULT_STEPS = [
	{
		label: "Fundamentos",
		hint: "Vocabulário, premissas e o mapa do texto"
	},
	{
		label: "Análise crítica",
		hint: "Por que o autor afirma isso — e o que fica de fora"
	},
	{
		label: "Aplicação prática",
		hint: "Levar a ideia para um caso concreto"
	},
	{
		label: "Domínio",
		hint: "Ensinar de volta, com as suas palavras"
	}
];
var DEFAULT_SUGGESTIONS = [
	"Começar pelos fundamentos",
	"Testar o que eu já sei",
	"Pegar um trecho difícil"
];
var GENERIC_REPLY = "Não consegui interpretar a última fala do guia. Responda de novo em uma frase, com as suas palavras.";
function clip(text, max) {
	if (text == null) return "";
	const trimmed = (typeof text === "string" ? text : String(text)).trim();
	const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : 0;
	if (trimmed.length <= limit) return trimmed;
	return trimmed.slice(0, limit);
}
function stripMarkdownFence(raw) {
	const trimmed = raw.trim();
	const closed = trimmed.match(/^```(?:json|javascript|js)?\s*([\s\S]*?)```/i);
	if (closed?.[1]) return closed[1].trim();
	return trimmed.replace(/^```(?:json|javascript|js)?\s*/i, "").replace(/\s*```$/i, "").trim();
}
function parseJsonObject(raw) {
	const cleaned = stripMarkdownFence(raw);
	const start = cleaned.indexOf("{");
	const end = cleaned.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		const value = JSON.parse(cleaned.slice(start, end + 1));
		if (value && typeof value === "object" && !Array.isArray(value)) return value;
	} catch {
		return null;
	}
	return null;
}
function extractReplyField(raw) {
	const match = raw.match(/"(?:reply|opening)"\s*:\s*"((?:\\.|[^"\\])*)"?/);
	if (!match?.[1]) return "";
	try {
		return JSON.parse(`"${match[1]}"`);
	} catch {
		return match[1].replaceAll(String.raw`\n`, "\n").replaceAll(String.raw`\"`, "\"");
	}
}
function looksLikeJsonDump(text) {
	const trimmed = text.trim();
	return trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.startsWith("```");
}
function pickString(value) {
	return typeof value === "string" ? value.trim() : "";
}
function asStringArray(value, fallback = DEFAULT_SUGGESTIONS) {
	if (!Array.isArray(value)) return fallback;
	const unique = [];
	for (const item of value) {
		if (typeof item !== "string") continue;
		const next = item.trim();
		if (!next || unique.includes(next)) continue;
		unique.push(next);
		if (unique.length === 3) break;
	}
	return unique.length > 0 ? unique : fallback;
}
function asSteps(value) {
	if (!Array.isArray(value) || value.length < 3) return DEFAULT_STEPS;
	const steps = [];
	for (const item of value) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const label = pickString(rec.label);
		if (!label) continue;
		steps.push({
			label: clip(label, 48),
			hint: clip(pickString(rec.hint) || "Siga as perguntas do guia.", 140)
		});
		if (steps.length === 4) break;
	}
	return steps.length >= 3 ? steps : DEFAULT_STEPS;
}
function clampInt(value, min, max, fallback) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, Math.round(n)));
}
function asTutor(data, fallbackReply = "") {
	const fromFields = pickString(data.reply) || pickString(data.opening);
	const fallback = looksLikeJsonDump(fallbackReply) ? "" : fallbackReply.trim();
	const reply = fromFields || fallback || GENERIC_REPLY;
	const adaptive = asAdaptive(data, defaultAdaptation());
	return {
		reply: looksLikeJsonDump(reply) ? GENERIC_REPLY : reply,
		stepIndex: clampInt(data.stepIndex, 0, 3, 0),
		progress: clampInt(data.progress, 0, 100, 8),
		suggestions: asStringArray(data.suggestions),
		...adaptive
	};
}
function parseTutorTurn(raw) {
	const cleaned = stripMarkdownFence(raw);
	const parsed = parseJsonObject(cleaned);
	if (parsed) return asTutor(parsed, extractReplyField(cleaned));
	const extracted = extractReplyField(cleaned);
	if (extracted && !looksLikeJsonDump(extracted)) return {
		reply: extracted,
		stepIndex: 0,
		progress: 8,
		suggestions: DEFAULT_SUGGESTIONS,
		...defaultAdaptation()
	};
	if (cleaned && !looksLikeJsonDump(cleaned)) return {
		reply: cleaned,
		stepIndex: 0,
		progress: 8,
		suggestions: DEFAULT_SUGGESTIONS,
		...defaultAdaptation()
	};
	return {
		reply: GENERIC_REPLY,
		stepIndex: 0,
		progress: 8,
		suggestions: DEFAULT_SUGGESTIONS,
		...defaultAdaptation()
	};
}
function parseOpenSession(raw, fileName) {
	const parsed = parseJsonObject(stripMarkdownFence(raw)) ?? {};
	const tutor = parseTutorTurn(raw);
	const title = clip(pickString(parsed.title) || fileName.replace(/\.pdf$/i, ""), 80);
	const subject = clip(pickString(parsed.subject) || "Sessão de estudo", 80);
	const concepts = asStringArray(parsed.concepts, [
		"Ideia central",
		"Tensão do texto",
		"Aplicação"
	]);
	const adaptive = seedAdaptation(concepts, tutor);
	return {
		title,
		subject,
		concepts,
		steps: asSteps(parsed.steps),
		...tutor,
		...adaptive,
		stepIndex: 0
	};
}
var SPEECH_MAX = 1200;
function toSpeechText(markdown, max = SPEECH_MAX) {
	return clip(markdown.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/^\s*[-*]\s+/gm, "").replace(/^\s*\d+\.\s+/gm, "").replace(/\n{2,}/g, (match, offset, source) => {
		const prev = source[offset - 1];
		return prev && /[.!?…]/.test(prev) ? " " : ". ";
	}).replace(/\n/g, " ").replace(/\s+/g, " ").trim(), max);
}
//#endregion
export { asLevel as a, clampInt$1 as c, levelIndex as d, parseMastery as f, toSpeechText as g, seedAdaptation as h, applyTurnAdaptation as i, clip as l, parseTutorTurn as m, LEVELS as n, asScaffolding as o, parseOpenSession as p, LEVEL_COPY as r, buildAdaptivePrompt as s, DEFAULT_STEPS as t, defaultAdaptation as u };
