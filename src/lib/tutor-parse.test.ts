import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_STEPS } from "./types.ts";
import {
  DEFAULT_SUGGESTIONS,
  asSteps,
  asStringArray,
  asTutor,
  clip,
  extractReplyField,
  parseJsonObject,
  parseOpenSession,
  parseTutorTurn,
  stripMarkdownFence,
} from "./tutor-parse.ts";

describe("clip", () => {
  it("trims and keeps text within the limit", () => {
    assert.equal(clip("  olá  ", 10), "olá");
  });

  it("cuts overflow without throwing", () => {
    assert.equal(clip("abcdefghij", 4), "abcd");
  });

  it("coerces null, undefined and numbers", () => {
    assert.equal(clip(null, 8), "");
    assert.equal(clip(undefined, 20), "");
    assert.equal(clip(1234, 2), "12");
  });

  it("returns empty string when max is not a positive integer", () => {
    assert.equal(clip("texto", 0), "");
    assert.equal(clip("texto", -4), "");
    assert.equal(clip("texto", Number.NaN), "");
  });
});

describe("stripMarkdownFence / parseJsonObject", () => {
  it("parses a clean JSON object", () => {
    const obj = parseJsonObject(`{ "reply": "oi", "stepIndex": 1 }`);
    assert.deepEqual(obj, { reply: "oi", stepIndex: 1 });
  });

  it("unwraps markdown fences", () => {
    const fenced = "```json\n{\"reply\":\"ok\"}\n```";
    assert.equal(stripMarkdownFence(fenced), `{"reply":"ok"}`);
    assert.equal(parseJsonObject(fenced)?.reply, "ok");
  });

  it("returns null for invalid, empty or array JSON", () => {
    assert.equal(parseJsonObject(""), null);
    assert.equal(parseJsonObject("not json"), null);
    assert.equal(parseJsonObject("[1,2]"), null);
    assert.equal(parseJsonObject("{"), null);
  });
});

describe("asStringArray / asSteps / asTutor", () => {
  it("keeps up to three unique trimmed strings", () => {
    assert.deepEqual(asStringArray([" a ", "a", "b", 3, "c", "d"]), ["a", "b", "c"]);
  });

  it("falls back on null, empty or non-array suggestions", () => {
    assert.deepEqual(asStringArray(null), DEFAULT_SUGGESTIONS);
    assert.deepEqual(asStringArray([]), DEFAULT_SUGGESTIONS);
    assert.deepEqual(asStringArray("x"), DEFAULT_SUGGESTIONS);
  });

  it("rejects short or unlabeled step lists", () => {
    assert.equal(asSteps(null), DEFAULT_STEPS);
    assert.equal(asSteps([{ label: "Só um" }]), DEFAULT_STEPS);
    assert.equal(asSteps([{ label: "" }, { label: "A" }, { label: "B" }]), DEFAULT_STEPS);
  });

  it("accepts three valid steps and clamps labels", () => {
    const steps = asSteps([
      { label: "Um", hint: "h1" },
      { label: "Dois" },
      { label: "Três", hint: "h3" },
    ]);
    assert.equal(steps.length, 3);
    assert.equal(steps[1]?.hint, "Siga as perguntas do guia.");
  });

  it("clamps stepIndex and progress, and ignores JSON dumps as reply", () => {
    const tutor = asTutor(
      { reply: "", opening: "", stepIndex: 9, progress: -4, suggestions: ["x"] },
      `{ "reply": "vazou" }`,
    );
    assert.equal(tutor.stepIndex, 3);
    assert.equal(tutor.progress, 0);
    assert.equal(tutor.suggestions[0], "x");
    assert.doesNotMatch(tutor.reply, /^\s*\{/);
  });
});

describe("parseTutorTurn", () => {
  it("happy path: structured tutor payload", () => {
    const turn = parseTutorTurn(
      JSON.stringify({
        reply: "O que a parede mostra?",
        stepIndex: 1,
        progress: 22,
        suggestions: ["As sombras", "O fogo"],
      }),
    );
    assert.equal(turn.reply, "O que a parede mostra?");
    assert.equal(turn.stepIndex, 1);
    assert.equal(turn.progress, 22);
    assert.deepEqual(turn.suggestions, ["As sombras", "O fogo"]);
    assert.equal(turn.level, "novice");
    assert.equal(turn.complexity, 1);
  });

  it("reads adaptive fields from a structured payload", () => {
    const turn = parseTutorTurn(
      JSON.stringify({
        reply: "Se a taxa cair pela metade e o prazo dobrar, o montante fica igual?",
        stepIndex: 2,
        progress: 54,
        suggestions: ["Calculo", "Acho que não"],
        level: "proficient",
        complexity: 3,
        scaffolding: "light",
        adaptationNote: "Hora de aplicar.",
        mastery: [{ concept: "juros", score: 62 }],
      }),
    );
    assert.equal(turn.level, "proficient");
    assert.equal(turn.complexity, 3);
    assert.equal(turn.scaffolding, "light");
    assert.equal(turn.mastery[0]?.score, 62);
    assert.match(turn.adaptationNote, /aplicar/);
  });

  it("recovers reply from truncated JSON", () => {
    const raw = `{ "reply": "A água quebra no fotossistema II", "stepIndex": 0, "progress": `;
    assert.equal(extractReplyField(raw), "A água quebra no fotossistema II");
    const turn = parseTutorTurn(raw);
    assert.match(turn.reply, /fotossistema/);
    assert.doesNotMatch(turn.reply, /^\s*\{/);
  });

  it("uses prose when the model forgets JSON", () => {
    const turn = parseTutorTurn("Por que o prisioneiro desce de novo?");
    assert.equal(turn.reply, "Por que o prisioneiro desce de novo?");
  });

  it("never surfaces a JSON dump as the student-facing reply", () => {
    const turn = parseTutorTurn("{ not valid json");
    assert.doesNotMatch(turn.reply, /^\s*\{/);
    assert.ok(turn.reply.length > 10);
  });
});

describe("parseOpenSession", () => {
  it("builds a session from a full opening payload", () => {
    const session = parseOpenSession(
      JSON.stringify({
        title: "A caverna",
        subject: "Platão",
        concepts: ["sombra", "sol"],
        steps: [
          { label: "Fundamentos", hint: "mapa" },
          { label: "Crítica", hint: "por quê" },
          { label: "Aplicação", hint: "hoje" },
          { label: "Domínio", hint: "ensinar" },
        ],
        opening: "Quer fundamentos ou um diagnóstico?",
        stepIndex: 2,
        progress: 7,
        suggestions: ["Fundamentos"],
      }),
      "caverna.pdf",
    );
    assert.equal(session.title, "A caverna");
    assert.equal(session.subject, "Platão");
    assert.equal(session.reply, "Quer fundamentos ou um diagnóstico?");
    assert.equal(session.stepIndex, 0);
    assert.equal(session.steps.length, 4);
    assert.deepEqual(session.concepts, ["sombra", "sol"]);
    assert.ok(session.level === "novice" || session.level === "developing");
  });

  it("falls back to the file name when title is missing", () => {
    const session = parseOpenSession("texto solto sem json", "notas.pdf");
    assert.equal(session.title, "notas");
    assert.equal(session.reply, "texto solto sem json");
    assert.equal(session.steps, DEFAULT_STEPS);
  });
});
