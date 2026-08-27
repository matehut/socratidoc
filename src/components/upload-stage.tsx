import { useId, useState, type DragEvent } from "react";
import { FileText, Loader2, RotateCcw, Upload } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { LEVEL_COPY } from "@/lib/adaptive";
import { SAMPLE_DOCS, type SampleDoc } from "@/lib/samples";
import type { StudioSession } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  busy: boolean;
  error: string | null;
  resume: StudioSession | null;
  onPdf: (file: File) => void;
  onSample: (sample: SampleDoc) => void;
  onResume: () => void;
};

export function UploadStage({ busy, error, resume, onPdf, onSample, onResume }: Props) {
  const inputId = useId();
  const [over, setOver] = useState(false);

  const takeFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onPdf(file);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setOver(false);
    takeFiles(event.dataTransfer.files);
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--color-elevated) 70%, transparent) 0%, var(--color-bg) 42%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold tracking-tight">SocraticPDF</p>
            <p className="text-xs text-muted">Estudo guiado por perguntas</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-10">
        <section className="reveal">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-sage">Método socrático</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-medium leading-[1.12] tracking-[-0.03em] text-fg sm:text-5xl">
            Não leia o PDF. Deixe ele te interrogar.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            O guia lê o documento, estima o que você já sabe e recusa o resumo fácil. Cada turno
            traz um insight curto e uma pergunta calibrada ao seu nível — não sobre o texto, com o texto.
          </p>
          <blockquote className="mt-8 max-w-md border-l border-border-strong pl-4 font-display text-lg italic leading-snug text-fg/90">
            Não posso te ensinar nada. Posso apenas fazer você pensar.
            <cite className="mt-2 block font-sans text-xs not-italic tracking-wide text-subtle">
              Sócrates
            </cite>
          </blockquote>
        </section>

        <section className="reveal reveal-2">
          {resume ? (
            <div className="mb-4 rounded-xl border border-border bg-elevated p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Sessão salva</p>
              <p className="mt-2 truncate text-sm font-medium text-fg">{resume.title}</p>
              <p className="mt-1 truncate text-xs text-muted">
                {resume.subject} · {resume.messages.length} falas · {LEVEL_COPY[resume.level].label}
              </p>
              <Button
                variant="primary"
                className="mt-4 w-full"
                disabled={busy}
                onClick={onResume}
              >
                <RotateCcw className="size-4" />
                Continuar de onde parei
              </Button>
            </div>
          ) : null}

          <label
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={onDrop}
            className={cn(
              "group block cursor-pointer rounded-2xl border border-dashed p-7 transition-[border-color,background-color] duration-[var(--motion-fast)] sm:p-8",
              over
                ? "border-accent bg-elevated"
                : "border-border bg-surface hover:border-border-strong hover:bg-elevated",
              busy && "pointer-events-none opacity-70",
            )}
          >
            <input
              id={inputId}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                takeFiles(e.target.files);
                e.currentTarget.value = "";
              }}
            />
            <div className="flex size-12 items-center justify-center rounded-xl bg-elevated text-accent">
              {busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            </div>
            <h2 className="mt-5 font-display text-2xl font-medium tracking-tight">
              {busy ? "Lendo o documento…" : "Suba o PDF de estudo"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Texto selecionável, até 8 MB. Arraste o arquivo ou escolha no computador.
            </p>
            <div className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg">
              Selecionar arquivo
            </div>
          </label>

          {error ? (
            <p className="mt-3 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">
              Ou comece com um texto de estudo
            </p>
            <ul className="mt-3 grid gap-2">
              {SAMPLE_DOCS.map((sample) => (
                <li key={sample.id}>
                  <Button
                    variant="secondary"
                    size="chip"
                    disabled={busy}
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3"
                    onClick={() => onSample(sample)}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-bg text-sage">
                      <FileText className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-fg">{sample.title}</span>
                      <span className="block truncate text-xs font-normal text-muted">
                        {sample.author} · {sample.blurb}
                      </span>
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
