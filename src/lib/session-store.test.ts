import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { defaultAdaptation } from "./adaptive.ts";
import { parseStoredSession, serializeSession } from "./session-store.ts";
import type { StudioSession } from "./types.ts";

const valid: StudioSession = {
  fileName: "caverna.pdf",
  pageCount: 4,
  documentText: "x".repeat(120),
  title: "A caverna",
  subject: "Platão",
  concepts: ["sombra", "sol"],
  steps: [
    { label: "Fundamentos", hint: "mapa" },
    { label: "Crítica", hint: "por quê" },
    { label: "Aplicação", hint: "hoje" },
    { label: "Domínio", hint: "ensinar" },
  ],
  activeStep: 1,
  progress: 22,
  messages: [
    { id: "a", role: "assistant", content: "Quer fundamentos?" },
    { id: "b", role: "user", content: "Sim" },
  ],
  suggestions: ["Sim", "Depois"],
  ...defaultAdaptation(["sombra", "sol"]),
  level: "developing",
  complexity: 2,
  scaffolding: "moderate",
  adaptationNote: "Vou pedir conexões.",
  mastery: [
    { concept: "sombra", score: 40 },
    { concept: "sol", score: 10 },
  ],
};

describe("parseStoredSession", () => {
  it("round-trips a valid snapshot including adaptive fields", () => {
    const parsed = parseStoredSession(serializeSession(valid));
    assert.ok(parsed);
    assert.equal(parsed?.title, "A caverna");
    assert.equal(parsed?.messages.length, 2);
    assert.equal(parsed?.activeStep, 1);
    assert.equal(parsed?.progress, 22);
    assert.equal(parsed?.level, "developing");
    assert.equal(parsed?.complexity, 2);
    assert.equal(parsed?.scaffolding, "moderate");
    assert.equal(parsed?.mastery[0]?.score, 40);
  });

  it("accepts a bare session object without the wrapper", () => {
    const parsed = parseStoredSession(valid);
    assert.equal(parsed?.fileName, "caverna.pdf");
  });

  it("defaults adaptive fields on a v1 snapshot that lacks them", () => {
    const { level: _l, complexity: _c, scaffolding: _s, adaptationNote: _n, mastery: _m, ...legacy } = valid;
    const parsed = parseStoredSession(legacy);
    assert.equal(parsed?.level, "novice");
    assert.equal(parsed?.complexity, 1);
    assert.equal(parsed?.scaffolding, "heavy");
    assert.equal(parsed?.mastery.length, 2);
    assert.equal(parsed?.mastery[0]?.score, 0);
  });

  it("rejects empty, truncated and malformed payloads", () => {
    assert.equal(parseStoredSession(null), null);
    assert.equal(parseStoredSession(""), null);
    assert.equal(parseStoredSession("{"), null);
    assert.equal(parseStoredSession({ messages: [] }), null);
    assert.equal(parseStoredSession({ ...valid, documentText: "curto" }), null);
    assert.equal(parseStoredSession({ ...valid, fileName: "" }), null);
    assert.equal(parseStoredSession({ ...valid, messages: [{ role: "bot", content: "x" }] }), null);
  });

  it("clamps step and progress, drops junk messages", () => {
    const parsed = parseStoredSession({
      ...valid,
      activeStep: 99,
      progress: -3,
      messages: [
        { id: "ok", role: "user", content: "oi" },
        { role: "assistant", content: "" },
        { role: "nope", content: "x" },
      ],
    });
    assert.equal(parsed?.activeStep, 3);
    assert.equal(parsed?.progress, 0);
    assert.equal(parsed?.messages.length, 1);
    assert.equal(parsed?.messages[0]?.content, "oi");
  });
});
