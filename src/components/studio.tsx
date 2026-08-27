import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUp,
  BookOpen,
  Compass,
  GraduationCap,
  Headphones,
  Loader2,
  Menu,
  PenLine,
  Square,
  User,
  Volume2,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { RichText } from "@/components/rich-text";
import { Button } from "@/components/ui/button";
import { LEVEL_COPY, LEVELS, levelIndex } from "@/lib/adaptive";
import type { ChatMessage, JourneyStep, StudioSession } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEP_ICONS = [BookOpen, Compass, PenLine, GraduationCap] as const;

type Props = {
  session: StudioSession;
  indexing: boolean;
  sending: boolean;
  speakingId: string | null;
  error: string | null;
  onSend: (text: string) => void;
  onStep: (index: number) => void;
  onSpeak: (message: ChatMessage) => void;
  onRecap: () => void;
  onReset: () => void;
};

export function Studio({
  session,
  indexing,
  sending,
  speakingId,
  error,
  onSend,
  onStep,
  onSpeak,
  onRecap,
  onReset,
}: Props) {
  const [draft, setDraft] = useState("");
  const [railOpen, setRailOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const busy = indexing || sending;
  const recapPlaying = speakingId === "recap";

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [session.messages, sending, indexing]);

  useEffect(() => {
    setRailOpen(false);
  }, [session.messages.length]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setDraft("");
    onSend(value);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(draft);
  };

  return (
    <div className="flex h-dvh overflow-hidden overscroll-none bg-bg text-fg">
      <aside className="hidden w-80 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <Rail
          session={session}
          recapPlaying={recapPlaying}
          onStep={onStep}
          onRecap={onRecap}
          onReset={onReset}
        />
      </aside>

      {railOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70"
            aria-label="Fechar menu"
            onClick={() => setRailOpen(false)}
          />
          <aside className="relative flex h-full w-80 max-w-[88vw] flex-col border-r border-border bg-surface">
            <div className="flex justify-end p-3">
              <Button variant="ghost" size="icon" className="size-10" onClick={() => setRailOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <Rail
              session={session}
              recapPlaying={recapPlaying}
              onStep={onStep}
              onRecap={onRecap}
              onReset={onReset}
            />
          </aside>
        </div>
      ) : null}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-11 lg:hidden"
              onClick={() => setRailOpen(true)}
              aria-label="Abrir jornada"
            >
              <Menu className="size-5" />
            </Button>
            <span className="size-1.5 shrink-0 rounded-full bg-sage" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{session.title}</p>
              <p className="truncate text-xs text-muted">
                {(LEVEL_COPY[session.level] ?? LEVEL_COPY.novice).label} · {session.subject}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              onClick={onRecap}
              disabled={session.messages.length === 0}
              aria-label={recapPlaying ? "Parar síntese" : "Ouvir síntese"}
            >
              {recapPlaying ? <Square className="size-5" /> : <Headphones className="size-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="size-11" onClick={onReset} aria-label="Encerrar sessão">
              <X className="size-5" />
            </Button>
          </div>
        </header>

        <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            {session.messages.map((msg) => (
              <Bubble
                key={msg.id}
                message={msg}
                speaking={speakingId === msg.id}
                onSpeak={() => onSpeak(msg)}
              />
            ))}
            {indexing || sending ? <Thinking indexing={indexing} /> : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-bg px-4 pb-4 pt-4 sm:px-8" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <div className="mx-auto w-full max-w-2xl">
            {error ? (
              <p className="mb-3 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
            {!busy && session.suggestions.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {session.suggestions.map((item, index) => (
                  <button
                    key={`${index}-${item.slice(0, 24)}`}
                    type="button"
                    onClick={() => submit(item)}
                    className="min-h-11 rounded-full border border-border bg-elevated px-3 py-2 text-left text-xs text-fg transition-colors duration-[var(--motion-quick)] hover:border-border-strong hover:bg-surface"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
            <form onSubmit={onSubmit} className="relative">
              <textarea
                ref={field}
                rows={1}
                value={draft}
                disabled={busy}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(draft);
                  }
                }}
                placeholder={indexing ? "Aguardando o guia…" : "Responda ao guia…"}
                className="min-h-14 w-full resize-none rounded-xl border border-border bg-elevated py-4 pl-4 pr-14 text-sm leading-relaxed text-fg outline-none placeholder:text-subtle focus:border-border-strong"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-lg"
                disabled={busy || !draft.trim()}
                aria-label="Enviar"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
              </Button>
            </form>
            <p className="mt-3 text-center text-xs text-subtle">
              O guia mede seu nível a cada fala e ajusta a pergunta — não entrega a resposta.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Rail({
  session,
  recapPlaying,
  onStep,
  onRecap,
  onReset,
}: {
  session: StudioSession;
  recapPlaying: boolean;
  onStep: (index: number) => void;
  onRecap: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <BrandMark />
        <div>
          <p className="text-sm font-semibold">SocraticPDF</p>
          <p className="text-xs text-muted">Jornada adaptativa</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <LearnerCard session={session} />

        <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-subtle">Etapas</p>
        <ol className="mt-4 space-y-1">
          {session.steps.map((step, index) => (
            <StepRow
              key={`${index}-${step.label}`}
              step={step}
              index={index}
              active={session.activeStep === index}
              done={index < session.activeStep}
              onClick={() => onStep(index)}
            />
          ))}
        </ol>

        <div className="mt-8 rounded-xl border border-border bg-elevated p-4">
          <p className="truncate text-sm font-medium">{session.fileName}</p>
          <p className="mt-1 text-xs text-muted">
            {session.pageCount ? `${session.pageCount} pág. · ` : null}
            {session.subject}
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-sage transition-[width] duration-[var(--motion-slow)] ease-[var(--ease-smooth-out)]"
              style={{ width: `${Math.max(4, session.progress)}%` }}
            />
          </div>
          <p className="mt-2 text-xs tabular-nums text-subtle">{session.progress}% assimilado</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-border p-4">
        <Button variant="secondary" className="w-full" onClick={onRecap} disabled={session.messages.length === 0}>
          {recapPlaying ? <Square className="size-4" /> : <Headphones className="size-4" />}
          {recapPlaying ? "Parar síntese" : "Ouvir síntese"}
        </Button>
        <Button variant="ghost" className="w-full" onClick={onReset}>
          Trocar documento
        </Button>
      </div>
    </>
  );
}

function LearnerCard({ session }: { session: StudioSession }) {
  const copy = LEVEL_COPY[session.level] ?? LEVEL_COPY.novice;
  const active = levelIndex(session.level);
  return (
    <div className="rounded-xl border border-border bg-elevated p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Nível do aluno</p>
      <p className="mt-2 font-display text-lg leading-tight">{copy.label}</p>
      <p className="mt-1 text-xs text-muted">{copy.hint} · pergunta {session.complexity} de 4</p>
      <ol className="mt-3 flex gap-1.5" aria-label={`Nível ${copy.label}`}>
        {LEVELS.map((level, index) => (
          <li
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              index <= active ? "bg-sage" : "bg-bg",
            )}
          />
        ))}
      </ol>
      {session.adaptationNote ? (
        <p className="mt-3 text-xs leading-relaxed text-muted">{session.adaptationNote}</p>
      ) : null}
      {session.mastery.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {session.mastery.map((item) => (
            <li key={item.concept}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-xs text-fg">{item.concept}</span>
                <span className="tabular-nums text-xs text-subtle">{item.score}%</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full bg-sage/80"
                  style={{ width: `${Math.max(item.score, 3)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function StepRow({
  step,
  index,
  active,
  done,
  onClick,
}: {
  step: JourneyStep;
  index: number;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  const Icon = STEP_ICONS[index] ?? BookOpen;
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-[var(--motion-quick)]",
          active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/70 hover:text-fg",
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
            active ? "bg-accent text-accent-fg" : done ? "bg-sage/20 text-sage" : "bg-bg text-subtle",
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium">{step.label}</span>
          <span className="mt-0.5 block text-xs font-normal leading-snug text-subtle line-clamp-2">{step.hint}</span>
        </span>
      </button>
    </li>
  );
}

function Bubble({
  message,
  speaking,
  onSpeak,
}: {
  message: ChatMessage;
  speaking: boolean;
  onSpeak: () => void;
}) {
  const mine = message.role === "user";
  return (
    <article className={cn("flex gap-3", mine ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
          mine ? "bg-elevated text-muted" : "bg-accent text-accent-fg",
        )}
        aria-hidden="true"
      >
        {mine ? <User className="size-4" /> : <BookOpen className="size-4" />}
      </div>
      <div
        className={cn(
          "max-w-xl rounded-2xl px-4 py-3",
          mine
            ? "rounded-tr-md border border-border bg-elevated text-fg"
            : "rounded-tl-md border border-border bg-surface text-fg",
        )}
      >
        <RichText text={message.content} serif={!mine} />
        {!mine ? (
          <button
            type="button"
            onClick={onSpeak}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-0 text-xs font-medium text-muted transition-colors duration-[var(--motion-quick)] hover:text-fg"
            aria-label={speaking ? "Parar áudio" : "Ouvir o guia"}
          >
            {speaking ? <Square className="size-3.5" /> : <Volume2 className="size-3.5" />}
            {speaking ? "Parar" : "Ouvir"}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function Thinking({ indexing }: { indexing: boolean }) {
  return (
    <article className="flex gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg">
        <Loader2 className="size-4 animate-spin" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3">
        <p className="shimmer-text font-display text-sm">
          {indexing ? "Lendo o documento e calibrando o primeiro nível…" : "Ajustando a próxima pergunta ao seu nível…"}
        </p>
      </div>
    </article>
  );
}
