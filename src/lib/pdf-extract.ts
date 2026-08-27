import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { truncateDocument } from "@/lib/document";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PAGES = 40;

let workerConfigured = false;

function ensureWorker() {
  if (workerConfigured) return;
  GlobalWorkerOptions.workerSrc = pdfWorker;
  workerConfigured = true;
}

export async function extractPdfText(file: File): Promise<{
  text: string;
  pages: number;
}> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Envie um arquivo PDF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("O PDF precisa ter no máximo 8 MB.");
  }

  ensureWorker();
  const data = await file.arrayBuffer();
  const loadingTask = getDocument({ data, isOffscreenCanvasSupported: false });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const limit = Math.min(pageCount, MAX_PAGES);
  const parts: string[] = [];

  for (let i = 1; i <= limit; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (line) parts.push(`--- página ${i} ---\n${line}`);
  }

  const text = truncateDocument(parts.join("\n\n"));
  if (text.length < 80) {
    throw new Error(
      "Não encontrei texto neste PDF. Tente um arquivo com texto selecionável, não só imagens.",
    );
  }

  return { text, pages: pageCount };
}
