import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MAX_CHARS, truncateDocument } from "./document.ts";
import { SAMPLE_DOCS } from "./samples.ts";

describe("truncateDocument", () => {
  it("trims and collapses extra blank lines (happy path)", () => {
    assert.equal(truncateDocument("  alfa\n\n\n\nbeta  "), "alfa\n\nbeta");
  });

  it("strips trailing spaces before newlines", () => {
    assert.equal(truncateDocument("linha  \nproxima"), "linha\nproxima");
  });

  it("keeps text at the exact limit without the truncation notice", () => {
    const text = "a".repeat(120);
    assert.equal(truncateDocument(text, 120), text);
  });

  it("truncates over the limit and appends a notice", () => {
    const text = "a".repeat(200);
    const out = truncateDocument(text, 50);
    assert.equal(out.startsWith("a".repeat(50)), true);
    assert.match(out, /Documento truncado/);
    assert.ok(out.length > 50);
  });

  it("handles empty, whitespace-only and non-text edge cases", () => {
    assert.equal(truncateDocument(""), "");
    assert.equal(truncateDocument("   \n\n  "), "");
    assert.equal(truncateDocument("ok", 0), "\n\n[Documento truncado para caber no tutor.]");
  });

  it("uses MAX_CHARS as default ceiling", () => {
    const text = "x".repeat(MAX_CHARS + 40);
    const out = truncateDocument(text);
    assert.ok(out.startsWith("x".repeat(MAX_CHARS)));
    assert.match(out, /truncado/);
  });
});

describe("SAMPLE_DOCS", () => {
  it("keeps every bundled lesson long enough to open a session", () => {
    for (const sample of SAMPLE_DOCS) {
      assert.ok(sample.text.trim().length >= 80, sample.id);
      assert.ok(sample.title.length > 0, sample.id);
    }
  });
});
