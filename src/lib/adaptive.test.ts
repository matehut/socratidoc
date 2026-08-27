import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LEVEL_COPY,
  applyTurnAdaptation,
  asLevel,
  asScaffolding,
  buildAdaptivePrompt,
  clampInt,
  clampLevelJump,
  complexityFor,
  defaultAdaptation,
  inferLevelFromAnswer,
  localMasteryHint,
  mergeMastery,
  parseMastery,
  scaffoldingFor,
  seedAdaptation,
} from "./adaptive.ts";

describe("asLevel / asScaffolding / clamp", () => {
  it("maps Portuguese and English aliases (happy path)", () => {
    assert.equal(asLevel("Iniciante"), "novice");
    assert.equal(asLevel("desenvolvimento"), "developing");
    assert.equal(asLevel("intermediário"), "developing");
    assert.equal(asLevel("avançado"), "proficient");
    assert.equal(asLevel("domínio"), "mastery");
    assert.equal(asScaffolding("denso"), "heavy");
    assert.equal(asScaffolding("leve"), "light");
    assert.equal(asScaffolding("nenhum"), "none");
  });

  it("falls back on empty, unknown and non-string values", () => {
    assert.equal(asLevel(null), "novice");
    assert.equal(asLevel(""), "novice");
    assert.equal(asLevel("wizard"), "novice");
    assert.equal(asLevel(3, "developing"), "developing");
    assert.equal(asScaffolding(undefined, "moderate"), "moderate");
    assert.equal(asScaffolding("gigante"), "heavy");
  });

  it("clamps integers and ignores NaN", () => {
    assert.equal(clampInt(2.6, 1, 4, 1), 3);
    assert.equal(clampInt("9", 1, 4, 1), 4);
    assert.equal(clampInt(-2, 0, 100, 8), 0);
    assert.equal(clampInt(Number.NaN, 0, 10, 7), 7);
    assert.equal(clampInt("nope", 0, 10, 7), 7);
  });

  it("never jumps more than one level per turn", () => {
    assert.equal(clampLevelJump("novice", "mastery"), "developing");
    assert.equal(clampLevelJump("mastery", "novice"), "proficient");
    assert.equal(clampLevelJump("developing", "proficient"), "proficient");
  });

  it("derives complexity and scaffolding from level", () => {
    assert.equal(complexityFor("novice"), 1);
    assert.equal(complexityFor("mastery"), 4);
    assert.equal(scaffoldingFor("novice"), "heavy");
    assert.equal(scaffoldingFor("mastery"), "none");
  });
});

describe("inferLevelFromAnswer", () => {
  const concepts = ["sombra", "sol", "caverna"];

  it("reads a substantial, concept-rich answer as proficient or mastery", () => {
    const answer =
      "A sombra não é o objeto: é a projeção. Por isso o sol importa — sem ele não há caverna visível. Ou seja, percepção frequente não é conhecimento.";
    const level = inferLevelFromAnswer(answer, concepts);
    assert.ok(level === "proficient" || level === "mastery", level);
  });

  it("treats short or lost answers as novice", () => {
    assert.equal(inferLevelFromAnswer(""), "novice");
    assert.equal(inferLevelFromAnswer("   "), "novice");
    assert.equal(inferLevelFromAnswer("ok"), "novice");
    assert.equal(inferLevelFromAnswer("não sei, explica isso"), "novice");
    assert.equal(inferLevelFromAnswer("o que é isso?"), "novice");
  });

  it("does not crash on missing concepts or odd unicode", () => {
    assert.equal(inferLevelFromAnswer("talvez 🤔", []), "novice");
    const level = inferLevelFromAnswer("porque o tempo multiplica o capital em 1% ao mês", ["juros"]);
    assert.notEqual(level, "novice");
  });
});

describe("mastery parse / merge", () => {
  it("keeps up to six unique concepts and clamps scores", () => {
    const parsed = parseMastery(
      [
        { concept: "sombra", score: 140 },
        { concept: "", score: 10 },
        { concept: "sol", score: -4 },
        { concept: "sombra", score: 50 },
        "nope",
      ],
      ["sombra", "sol", "giro"],
    );
    assert.equal(parsed.length, 3);
    assert.equal(parsed[0]?.score, 140 > 100 ? 100 : parsed[0]?.score);
    assert.equal(parsed.find((m) => m.concept === "sombra")?.score, 100);
    assert.equal(parsed.find((m) => m.concept === "sol")?.score, 0);
    assert.equal(parsed.find((m) => m.concept === "giro")?.score, 0);
  });

  it("returns empty list when nothing is provided", () => {
    assert.deepEqual(parseMastery(null), []);
    assert.deepEqual(parseMastery("x"), []);
  });

  it("merges previous, local hint and incoming without dropping names", () => {
    const merged = mergeMastery(
      [{ concept: "sombra", score: 20 }],
      [{ concept: "sombra", score: 80 }, { concept: "sol", score: 10 }],
      ["sombra", "sol"],
    );
    assert.equal(merged.length, 2);
    const sombra = merged.find((m) => m.concept === "sombra")?.score ?? 0;
    assert.ok(sombra > 20 && sombra < 80, String(sombra));
  });

  it("hints mastery only when the answer actually mentions the concept", () => {
    const hint = localMasteryHint("A sombra na parede não é a coisa", ["sombra", "sol"]);
    assert.ok((hint.find((m) => m.concept === "sombra")?.score ?? 0) >= 22);
    assert.equal(hint.find((m) => m.concept === "sol")?.score, 0);
  });
});

describe("seed / apply adaptation", () => {
  it("opens a session at novice and refuses to start at mastery", () => {
    const seeded = seedAdaptation(["sombra"], {
      level: "mastery",
      complexity: 4,
      scaffolding: "none",
      adaptationNote: "Você já sabe tudo",
      mastery: [{ concept: "sombra", score: 90 }],
    });
    assert.equal(seeded.level, "developing");
    assert.ok(seeded.complexity <= 4);
    assert.equal(seeded.mastery[0]?.concept, "sombra");
  });

  it("uses default copy when the note is missing", () => {
    const seeded = seedAdaptation([]);
    assert.equal(seeded.level, "novice");
    assert.equal(seeded.adaptationNote, LEVEL_COPY.novice.note);
    assert.equal(seeded.complexity, 1);
  });

  it("advances at most one level even if the model overshoots", () => {
    const next = applyTurnAdaptation({
      previous: defaultAdaptation(["sombra"]),
      turn: { level: "mastery", complexity: 4, scaffolding: "none", adaptationNote: "Domínio.", mastery: [] },
      userAnswer: "ok",
      concepts: ["sombra"],
    });
    assert.equal(next.level, "developing");
  });

  it("replaces notes that leak internal jargon", () => {
    const next = applyTurnAdaptation({
      previous: defaultAdaptation(["sombra"]),
      turn: {
        level: "novice",
        complexity: 1,
        scaffolding: "heavy",
        adaptationNote: "Mantive o nível novice e o scaffolding heavy.",
        mastery: [],
      },
      userAnswer: "ok",
      concepts: ["sombra"],
    });
    assert.doesNotMatch(next.adaptationNote, /novice|scaffolding/i);
    assert.equal(next.adaptationNote, LEVEL_COPY.novice.note);
  });

  it("caps opening complexity and scaffolding even if the model starts hot", () => {
    const seeded = seedAdaptation(["sombra"], {
      level: "mastery",
      complexity: 4,
      scaffolding: "none",
      adaptationNote: "Você já sabe tudo",
      mastery: [{ concept: "sombra", score: 90 }],
    });
    assert.equal(seeded.level, "developing");
    assert.ok(seeded.complexity <= 2);
    assert.equal(seeded.scaffolding, "moderate");
  });

  it("promotes a strong answer from developing toward proficient", () => {
    const previous = {
      ...defaultAdaptation(["juros", "capital"]),
      level: "developing" as const,
      complexity: 2,
      scaffolding: "moderate" as const,
    };
    const next = applyTurnAdaptation({
      previous,
      turn: {
        level: "proficient",
        complexity: 3,
        scaffolding: "light",
        adaptationNote: "Agora um caso concreto.",
        mastery: [{ concept: "juros", score: 55 }],
      },
      userAnswer:
        "Juros compostos incidem sobre o capital e sobre os juros já incorporados. Por exemplo, 1% ao mês em 12 meses não é 12%.",
      concepts: ["juros", "capital"],
    });
    assert.equal(next.level, "proficient");
    assert.equal(next.scaffolding, "light");
    assert.match(next.adaptationNote, /concreto/);
    assert.ok((next.mastery.find((m) => m.concept === "juros")?.score ?? 0) > 0);
  });

  it("builds a compact prompt for the tutor", () => {
    const prompt = buildAdaptivePrompt(defaultAdaptation(["sombra"]));
    assert.match(prompt, /novice/);
    assert.match(prompt, /sombra/);
    assert.match(prompt, /1 nível/);
  });
});
