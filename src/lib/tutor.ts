import { createServerFn } from "@tanstack/react-start";
import { asLevel, asScaffolding, buildAdaptivePrompt, defaultAdaptation } from "./adaptive.ts";
import { toSpeechText } from "./speech.ts";
import { clip, parseOpenSession, parseTutorTurn } from "./tutor-parse.ts";
import type { AdaptiveState, OpenSession, TutorPayload } from "./types.ts";

const MODEL = "grok-4.5";
const DOC_LIMIT = 18_000;
const HISTORY_LIMIT = 12;
const FETCH_MS = 45_000;

type ChatTurn = { role: "system" | "user" | "assistant"; content: string };

type OpenInput = {
  fileName: string;
  documentText: string;
};

type TurnInput = {
  fileName: string;
  documentText: string;
  title: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  activeStep: number;
  progress: number;
  level?: string;
  complexity?: number;
  scaffolding?: string;
  adaptationNote?: string;
  mastery?: Array<{ concept: string; score: number }>;
};

function readKey() {
  return process.env.XAI_API_KEY ?? "";
}

function retryableStatus(status: number) {
  return status === 429 || status === 500 || status === 502 || status === 503;
}

async function completeOnce(
  apiKey: string,
  messages: ChatTurn[],
  maxTokens: number,
): Promise<{ ok: true; text: string } | { ok: false; error: string; retry: boolean }> {
  let res: Response;
  try {
    res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: maxTokens,
        messages,
      }),
      signal: AbortSignal.timeout(FETCH_MS),
    });
  } catch (err) {
    const timeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return {
      ok: false,
      retry: timeout,
      error: timeout
        ? "O tutor demorou demais. Tente de novo em instantes."
        : "Falha de rede ao falar com o tutor.",
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      retry: retryableStatus(res.status),
      error: `O tutor falhou (${res.status}). Tente de novo em instantes.`,
    };
  }

  const body = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = body.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) return { ok: false, retry: true, error: "O tutor voltou vazio. Tente outra pergunta." };
  return { ok: true, text };
}

async function complete(
  messages: ChatTurn[],
  maxTokens: number,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = readKey();
  if (!apiKey) {
    return { ok: false, error: "O tutor de IA não está disponível neste ambiente." };
  }

  const first = await completeOnce(apiKey, messages, maxTokens);
  if (first.ok) return first;
  if (!first.retry) return { ok: false, error: first.error };

  const second = await completeOnce(apiKey, messages, maxTokens);
  if (second.ok) return second;
  return { ok: false, error: second.error };
}

const SYSTEM = `Você é o guia do SocraticPDF, um tutor socrático em português brasileiro.

Método:
- Nunca despeje um resumo completo do documento.
- Cada turno: um insight curto (2–6 frases) + UMA pergunta que obrigue o aluno a pensar.
- Cite trechos curtos do documento entre aspas quando isso ancorar a pergunta.
- Se o aluno errar, não entregue a resposta: faça uma pergunta que o leve a perceber o furo.
- Se o aluno pedir a resposta pronta, recuse com elegância e ofereça um andaime.
- Avance stepIndex só quando o aluno demonstrar entendimento da etapa atual.
- Adapte a pergunta ao nível: novice = analogia e vocabulário; developing = relação entre duas ideias; proficient = caso concreto e previsão; mastery = o aluno ensina, você só aponta o furo.
- Suba ou desça no máximo 1 nível por turno. Nunca elogie vazio.
- Tom calmo, preciso, adulto. Sem emojis. Sem bajulação.
- Não repita a pergunta anterior se o aluno já respondeu.

Responda SOMENTE um JSON válido, sem markdown em volta:
{
  "reply": "texto em português, quebras de linha permitidas, **negrito** ok",
  "stepIndex": 0,
  "progress": 0,
  "suggestions": ["resposta curta 1", "resposta curta 2", "resposta curta 3"],
  "level": "novice",
  "complexity": 1,
  "scaffolding": "heavy",
  "adaptationNote": "uma frase na segunda pessoa sobre o ajuste",
  "mastery": [{"concept":"ideia","score":20}]
}

steps: 0 fundamentos, 1 análise crítica, 2 aplicação, 3 domínio.
level: novice | developing | proficient | mastery.
scaffolding: heavy | moderate | light | none.
suggestions: 3 falas que o ALUNO poderia enviar em seguida, na voz dele, curtas.`;

export const openTutoring = createServerFn({ method: "POST" })
  .validator((input: OpenInput) => ({
    fileName: clip(String(input?.fileName ?? "documento.pdf"), 180),
    documentText: clip(String(input?.documentText ?? ""), DOC_LIMIT),
  }))
  .handler(async ({ data }): Promise<{ ok: true; session: OpenSession } | { ok: false; error: string }> => {
    if (data.documentText.length < 80) {
      return { ok: false, error: "O texto extraído é curto demais para uma sessão de estudo." };
    }

    const result = await complete(
      [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Abra uma sessão de estudo.
Arquivo: ${data.fileName}

Documento:
"""
${data.documentText}
"""

No JSON, inclua também:
"title": "título curto do material",
"subject": "tema em 3–6 palavras",
"concepts": ["conceito 1", "conceito 2", "conceito 3"],
"steps": [
  {"label":"Fundamentos","hint":"..."},
  {"label":"Análise crítica","hint":"..."},
  {"label":"Aplicação prática","hint":"..."},
  {"label":"Domínio","hint":"..."}
]
"opening" pode ser usado no lugar de "reply" nesta primeira mensagem.
Comece no stepIndex 0, progress entre 4 e 12, level novice.
A primeira fala deve perguntar se o aluno quer fundamentos ou um diagnóstico do que já sabe.`,
        },
      ],
      1100,
    );

    if (!result.ok) return result;
    return { ok: true, session: parseOpenSession(result.text, data.fileName) };
  });

export const continueTutoring = createServerFn({ method: "POST" })
  .validator((input: TurnInput) => ({
    fileName: clip(String(input?.fileName ?? "documento.pdf"), 180),
    documentText: clip(String(input?.documentText ?? ""), DOC_LIMIT),
    title: clip(String(input?.title ?? "Documento"), 80),
    activeStep: Math.min(3, Math.max(0, Number(input?.activeStep) || 0)),
    progress: Math.min(100, Math.max(0, Number(input?.progress) || 0)),
    level: clip(String(input?.level ?? "novice"), 24),
    complexity: Math.min(4, Math.max(1, Number(input?.complexity) || 1)),
    scaffolding: clip(String(input?.scaffolding ?? "heavy"), 24),
    mastery: (Array.isArray(input?.mastery) ? input.mastery : [])
      .slice(0, 6)
      .map((item) => ({
        concept: clip(String(item?.concept ?? ""), 48),
        score: Math.min(100, Math.max(0, Number(item?.score) || 0)),
      }))
      .filter((item) => item.concept.length > 0),
    messages: (Array.isArray(input?.messages) ? input.messages : [])
      .slice(-HISTORY_LIMIT)
      .map((msg) => ({
        role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: clip(String(msg.content ?? ""), 3500),
      }))
      .filter((msg) => msg.content.length > 0),
  }))
  .handler(async ({ data }): Promise<{ ok: true; turn: TutorPayload } | { ok: false; error: string }> => {
    const history: ChatTurn[] = data.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const adaptive: AdaptiveState = {
      ...defaultAdaptation(data.mastery.map((m) => m.concept)),
      level: asLevel(data.level),
      complexity: data.complexity,
      scaffolding: asScaffolding(data.scaffolding),
      mastery: data.mastery,
    };

    const result = await complete(
      [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Contexto persistente (não resume):
Arquivo: ${data.fileName}
Título: ${data.title}
Etapa atual: ${data.activeStep}
Progresso: ${data.progress}
${buildAdaptivePrompt(adaptive)}

Documento:
"""
${data.documentText}
"""

A conversa segue nas mensagens abaixo. Responda só ao último turno do aluno.`,
        },
        ...history,
      ],
      900,
    );

    if (!result.ok) return result;
    return { ok: true, turn: parseTutorTurn(result.text) };
  });

export const speakTutor = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => ({
    text: toSpeechText(String(input?.text ?? "")),
  }))
  .handler(async ({ data }): Promise<{ ok: true; mime: string; base64: string } | { ok: false; error: string }> => {
    const apiKey = readKey();
    if (!apiKey) return { ok: false, error: "Áudio do guia indisponível neste ambiente." };
    if (data.text.length < 8) return { ok: false, error: "Nada para ouvir nesta fala." };

    let res: Response;
    try {
      res = await fetch("https://api.x.ai/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text: data.text,
          voice_id: "eve",
          language: "pt-BR",
        }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      return { ok: false, error: "Falha de rede ao gerar o áudio." };
    }

    if (!res.ok) return { ok: false, error: `O áudio falhou (${res.status}). Tente de novo.` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 256) return { ok: false, error: "O áudio voltou vazio." };
    return {
      ok: true,
      mime: res.headers.get("content-type")?.split(";")[0] || "audio/mpeg",
      base64: buf.toString("base64"),
    };
  });
