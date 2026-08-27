import { LEVEL_COPY } from "./adaptive.ts";
import { toSpeechText } from "./speech.ts";
import type { StudioSession } from "./types.ts";

const RECAP_MAX = 900;

export function buildSessionRecap(session: StudioSession | null | undefined): string {
  if (!session) return "";
  const level = LEVEL_COPY[session.level]?.label ?? "Iniciante";
  const step = session.steps[session.activeStep]?.label ?? "";
  const lastGuide =
    [...session.messages].reverse().find((msg) => msg.role === "assistant")?.content ?? "";
  const mastery = session.mastery
    .filter((item) => item.score > 0)
    .map((item) => `${item.concept} ${item.score} por cento`)
    .join(", ");

  const parts = [
    `Síntese da sessão. ${session.title}.`,
    session.subject ? `Tema: ${session.subject}.` : "",
    `Nível do aluno: ${level}.`,
    step ? `Etapa atual: ${step}.` : "",
    session.adaptationNote || "",
    mastery ? `Domínio parcial: ${mastery}.` : "",
    lastGuide ? `Última pergunta do guia: ${lastGuide}` : "",
  ];

  return toSpeechText(parts.filter(Boolean).join(" "), RECAP_MAX);
}
