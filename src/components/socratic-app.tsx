import { useCallback, useEffect, useRef, useState } from "react";
import { Studio } from "@/components/studio";
import { UploadStage } from "@/components/upload-stage";
import { applyTurnAdaptation, defaultAdaptation, seedAdaptation } from "@/lib/adaptive";
import { truncateDocument } from "@/lib/document";
import { buildSessionRecap } from "@/lib/journal";
import type { SampleDoc } from "@/lib/samples";
import { clearSession, loadSession, saveSession } from "@/lib/session-store";
import { continueTutoring, openTutoring, speakTutor } from "@/lib/tutor";
import { DEFAULT_STEPS, type ChatMessage, type StudioSession } from "@/lib/types";
import { uid } from "@/lib/utils";

export function SocraticApp() {
  const [session, setSession] = useState<StudioSession | null>(null);
  const [resume, setResume] = useState<StudioSession | null>(null);
  const [indexing, setIndexing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const generation = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceCache = useRef(new Map<string, string>());

  useEffect(() => {
    setResume(loadSession());
  }, []);

  useEffect(() => {
    if (session && session.messages.length > 0) saveSession(session);
    voiceCache.current.delete("recap");
  }, [session]);

  const bump = () => {
    generation.current += 1;
    audioRef.current?.pause();
    setSpeakingId(null);
    return generation.current;
  };

  const startFromText = useCallback(async (
    fileName: string,
    documentText: string,
    pageCount: number | null,
    gen: number,
  ) => {
    if (generation.current !== gen) return;
    const text = truncateDocument(documentText);
    setError(null);
    setIndexing(true);
    setSending(false);
    setSession({
      fileName,
      pageCount,
      documentText: text,
      title: fileName.replace(/\.pdf$/i, ""),
      subject: "Abrindo a sessão",
      concepts: [],
      steps: DEFAULT_STEPS,
      activeStep: 0,
      progress: 4,
      messages: [],
      suggestions: [],
      ...defaultAdaptation(),
    });

    const result = await openTutoring({ data: { fileName, documentText: text } });
    if (generation.current !== gen) return;
    setIndexing(false);

    if (!result.ok) {
      setSession(null);
      setError(result.error);
      return;
    }

    const first: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: result.session.reply,
    };
    const adaptive = seedAdaptation(result.session.concepts, result.session);

    setSession({
      fileName,
      pageCount,
      documentText: text,
      title: result.session.title,
      subject: result.session.subject,
      concepts: result.session.concepts,
      steps: result.session.steps,
      activeStep: result.session.stepIndex,
      progress: result.session.progress,
      messages: [first],
      suggestions: result.session.suggestions,
      ...adaptive,
    });
    setResume(null);
  }, []);

  const onPdf = async (file: File) => {
    const gen = bump();
    setError(null);
    setIndexing(true);
    try {
      const { extractPdfText } = await import("@/lib/pdf-extract");
      const extracted = await extractPdfText(file);
      if (generation.current !== gen) return;
      await startFromText(file.name, extracted.text, extracted.pages, gen);
    } catch (err) {
      if (generation.current !== gen) return;
      setIndexing(false);
      setSession(null);
      setError(err instanceof Error ? err.message : "Não consegui ler este PDF.");
    }
  };

  const onSample = (sample: SampleDoc) => {
    const gen = bump();
    void startFromText(`${sample.title}.pdf`, sample.text, sample.pages, gen);
  };

  const onSend = async (text: string) => {
    if (!session || sending || indexing) return;
    const gen = generation.current;
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    const nextMessages = [...session.messages, userMsg];
    setSession({ ...session, messages: nextMessages, suggestions: [] });
    setSending(true);
    setError(null);

    const previousSuggestions = session.suggestions;
    const result = await continueTutoring({
      data: {
        fileName: session.fileName,
        documentText: session.documentText,
        title: session.title,
        messages: nextMessages.map((msg) => ({ role: msg.role, content: msg.content })),
        activeStep: session.activeStep,
        progress: session.progress,
        level: session.level,
        complexity: session.complexity,
        scaffolding: session.scaffolding,
        mastery: session.mastery,
      },
    });

    if (generation.current !== gen) return;
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      setSession((current) =>
        current && generation.current === gen
          ? { ...current, suggestions: previousSuggestions }
          : current,
      );
      return;
    }

    const reply: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: result.turn.reply,
    };

    setSession((current) => {
      if (!current || generation.current !== gen) return current;
      const adaptive = applyTurnAdaptation({
        previous: current,
        turn: result.turn,
        userAnswer: text,
        concepts: current.concepts,
      });
      return {
        ...current,
        messages: [...current.messages, reply],
        activeStep: result.turn.stepIndex,
        progress: Math.max(current.progress, result.turn.progress),
        suggestions: result.turn.suggestions,
        ...adaptive,
      };
    });
  };

  const onStep = (index: number) => {
    if (!session || sending || indexing) return;
    const step = session.steps[index];
    if (!step) return;
    void onSend(`Quero focar na etapa “${step.label}”. Comece a me ensinar por essa parte.`);
  };

  const onReset = () => {
    bump();
    clearSession();
    setResume(null);
    setSession(null);
    setIndexing(false);
    setSending(false);
    setError(null);
  };

  const onResume = () => {
    if (!resume) return;
    bump();
    setError(null);
    setSession(resume);
  };

  const playAudio = async (id: string, text: string) => {
    if (speakingId === id) {
      audioRef.current?.pause();
      setSpeakingId(null);
      return;
    }
    audioRef.current?.pause();
    setSpeakingId(id);
    setError(null);
    try {
      let url = voiceCache.current.get(id);
      if (!url) {
        const result = await speakTutor({ data: { text } });
        if (!result.ok) {
          setSpeakingId(null);
          setError(result.error);
          return;
        }
        url = `data:${result.mime};base64,${result.base64}`;
        voiceCache.current.set(id, url);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setSpeakingId(null);
      audio.onerror = () => {
        setSpeakingId(null);
        setError("Não consegui reproduzir o áudio.");
      };
      await audio.play();
    } catch {
      setSpeakingId(null);
      setError("Não consegui reproduzir o áudio.");
    }
  };

  const onSpeak = async (message: ChatMessage) => {
    await playAudio(message.id, message.content);
  };

  const onRecap = async () => {
    if (!session) return;
    await playAudio("recap", buildSessionRecap(session));
  };

  if (!session) {
    return (
      <UploadStage
        busy={indexing}
        error={error}
        resume={resume}
        onPdf={onPdf}
        onSample={onSample}
        onResume={onResume}
      />
    );
  }

  return (
    <Studio
      session={session}
      indexing={indexing}
      sending={sending}
      speakingId={speakingId}
      error={error}
      onSend={onSend}
      onStep={onStep}
      onSpeak={onSpeak}
      onRecap={onRecap}
      onReset={onReset}
    />
  );
}
