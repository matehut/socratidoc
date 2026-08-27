import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SPEECH_MAX, toSpeechText } from "./speech.ts";

describe("toSpeechText", () => {
  it("strips markdown and flattens paragraphs (happy path)", () => {
    const out = toSpeechText("**Olá.**\n\nO que a *parede* mostra?");
    assert.equal(out, "Olá. O que a parede mostra?");
  });

  it("drops list markers", () => {
    const out = toSpeechText("- sombra\n1. fogo");
    assert.match(out, /sombra/);
    assert.doesNotMatch(out, /^[-*]/);
    assert.doesNotMatch(out, /1\./);
  });

  it("returns empty on blank input", () => {
    assert.equal(toSpeechText("   "), "");
    assert.equal(toSpeechText(""), "");
  });

  it("clips overflow to SPEECH_MAX", () => {
    const out = toSpeechText("a".repeat(SPEECH_MAX + 80));
    assert.equal(out.length, SPEECH_MAX);
  });
});
