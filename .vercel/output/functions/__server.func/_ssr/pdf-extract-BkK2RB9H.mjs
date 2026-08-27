import { n as truncateDocument } from "./routes-BCkPiyxx.mjs";
import { n as getDocument, t as GlobalWorkerOptions } from "../_libs/pdfjs-dist.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-extract-BkK2RB9H.js
var pdf_worker_min_default = "/assets/pdf.worker.min-CHFwMXne.mjs";
var MAX_BYTES = 8388608;
var MAX_PAGES = 40;
var workerConfigured = false;
function ensureWorker() {
	if (workerConfigured) return;
	GlobalWorkerOptions.workerSrc = pdf_worker_min_default;
	workerConfigured = true;
}
async function extractPdfText(file) {
	if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) throw new Error("Envie um arquivo PDF.");
	if (file.size > MAX_BYTES) throw new Error("O PDF precisa ter no máximo 8 MB.");
	ensureWorker();
	const data = await file.arrayBuffer();
	const pdf = await getDocument({
		data,
		isOffscreenCanvasSupported: false
	}).promise;
	const pageCount = pdf.numPages;
	const limit = Math.min(pageCount, MAX_PAGES);
	const parts = [];
	for (let i = 1; i <= limit; i += 1) {
		const line = (await (await pdf.getPage(i)).getTextContent()).items.map((item) => "str" in item ? item.str : "").join(" ").replace(/\s+/g, " ").trim();
		if (line) parts.push(`--- página ${i} ---\n${line}`);
	}
	const text = truncateDocument(parts.join("\n\n"));
	if (text.length < 80) throw new Error("Não encontrei texto neste PDF. Tente um arquivo com texto selecionável, não só imagens.");
	return {
		text,
		pages: pageCount
	};
}
//#endregion
export { extractPdfText };
