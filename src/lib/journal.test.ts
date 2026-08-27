import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_STEPS } from "./types.ts";
import { defaultAdaptation } from "./adaptive.ts";
import { buildSessionRecap } from "./journal.ts";
import type { StudioSession } from "./types.ts";

const base: StudioSession = {
  fileName: "caverna.pdf",
  pageCount: 4,
  documentText: "x".repeat(120),
  title: "A alegoria da caverna",
  subject: "Platão",
  concepts: ["sombra", "sol"],
  steps: DEFAULT_STEPS,
  activeStep: 1,
  progress: 28,
  messages: [
    { id: "1", role: "assistant", content: "O que a parede mostra, de verdade?" },
    { id: "2", role: "user", content: "Sombras dos objetos atrás." },
  ],
  suggestions: ["O fogo"],
  ...defaultAdaptation(["sombra", "sol"]),
  level: "developing",
  complexity: 2,
  scaffolding: "moderate",
  adaptationNote: "Você já tem o chão. Vou pedir conexões, não definições.",
  mastery: [
    { concept: "sombra", score: 40 },
    { concept: "sol", score: 12 },
  ],
};

describe("buildSessionRecap", () => {
  it("narrates title, level, mastery and the last prompt (happy path)", () => {
    const recap = buildSessionRecap(base);
    assert.match(recap, /alegoria da caverna/i);
    assert.match(recap, /Em desenvolvimento/);
    assert.match(recap, /sombra/);
    assert.match(recap, /parede/);
    assert.match(recap, /Análise crítica/);
    assert.doesNotMatch(recap, /^\s*\{/);
  });

  it("returns empty on null or undefined session", () => {
    assert.equal(buildSessionRecap(null), "");
    assert.equal(buildSessionRecap(undefined), "");
  });

  it("still speaks when messages, mastery and subject are missing", () => {
    const recap = buildSessionRecap({
      ...base,
      subject: "",
      messages: [],
      mastery: [],
      adaptationNote: "",
    });
    assert.match(recap, /Síntese da sessão/);
    assert.ok(recap.length > 20);
  });

  it("strips markdown and flattens whitespace", () => {
    const recap = buildSessionRecap({
      ...base,
      messages: [{ id: "1", role: "assistant", content: "**O sol**   é a causa." }],
    });
    assert.doesNotMatch(recap, /\*\*/);
    assert.doesNotMatch(recap, / {2,}/);
  });

  it("clips an oversized recap without cutting mid-control-char", () => {
    const recap = buildSessionRecap({
      ...base,
      title: "T".repeat(400),
      subject: "S".repeat(400),
      adaptationNote: "N".repeat(400),
      messages: [
        { id: "1", role: "assistant", content: "G".repeat(600) },
        { id: "2", role: "user", content: "U".repeat(600) },
      ],
    });
    assert.ok(recap.length <= 900);
  });
});
