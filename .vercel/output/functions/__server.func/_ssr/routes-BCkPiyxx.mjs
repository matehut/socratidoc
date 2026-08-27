import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as asLevel, c as clampInt$1, d as levelIndex, f as parseMastery, g as toSpeechText, h as seedAdaptation, i as applyTurnAdaptation, l as clip, n as LEVELS, o as asScaffolding, r as LEVEL_COPY, t as DEFAULT_STEPS, u as defaultAdaptation } from "./speech-BjpHsBQw.mjs";
import { c as PenLine, d as Headphones, f as GraduationCap, g as ArrowUp, h as BookOpen, i as Upload, l as Menu, m as Compass, n as Volume2, o as Square, p as FileText, r as User, s as RotateCcw, t as X, u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BCkPiyxx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var MAX_CHARS = 2e4;
function truncateDocument(text, max = MAX_CHARS) {
	const trimmed = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
	if (trimmed.length <= max) return trimmed;
	return `${trimmed.slice(0, max)}\n\n[Documento truncado para caber no tutor.]`;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function BrandMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex size-9 items-center justify-center rounded-lg bg-accent text-accent-fg", className),
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "size-5",
			fill: "none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M5 6.5c3.2-1.4 5.5-.4 7 1.2 1.5-1.6 3.8-2.6 7-1.2V18c-3.2-1.2-5.5-.4-7 1.1-1.5-1.5-3.8-2.3-7-1.1V6.5Z",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeLinejoin: "round"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 8v11",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeLinecap: "round"
			})]
		})
	});
}
function inline(text) {
	return text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/g).map((chunk, index) => {
		if (chunk.startsWith("**") && chunk.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-fg",
			children: chunk.slice(2, -2)
		}, index);
		if (chunk.startsWith("*") && chunk.endsWith("*")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "italic",
			children: chunk.slice(1, -1)
		}, index);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: chunk }, index);
	});
}
function RichText({ text, serif = false }) {
	const blocks = text.split(/\n{2,}/).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: serif ? "font-display text-base leading-relaxed" : "text-sm leading-relaxed",
		children: blocks.map((block, i) => {
			const lines = block.split("\n");
			if (lines.every((line) => /^\s*([-*]|\d+\.)\s+/.test(line))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1.5 first:mt-0",
				children: lines.map((line, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "relative pl-4 before:absolute before:left-0 before:text-subtle before:content-['–']",
					children: inline(line.replace(/^\s*([-*]|\d+\.)\s+/, ""))
				}, j))
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 first:mt-0",
				children: lines.map((line, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [j > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, inline(line)] }, j))
			}, i);
		})
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background-color,color,opacity,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-cream",
			secondary: "border border-border bg-elevated text-fg hover:border-border-strong hover:bg-surface",
			ghost: "text-muted hover:bg-elevated hover:text-fg",
			paper: "bg-cream text-accent-fg hover:bg-accent"
		},
		size: {
			sm: "h-9 rounded-md px-3 text-sm",
			md: "h-11 rounded-lg px-4 text-sm",
			lg: "h-12 rounded-xl px-5 text-sm",
			icon: "size-11 rounded-lg",
			chip: "h-auto min-h-11 rounded-lg px-3 py-2 text-left text-sm font-medium leading-snug"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var STEP_ICONS = [
	BookOpen,
	Compass,
	PenLine,
	GraduationCap
];
function Studio({ session, indexing, sending, speakingId, error, onSend, onStep, onSpeak, onRecap, onReset }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	const [railOpen, setRailOpen] = (0, import_react.useState)(false);
	const scroller = (0, import_react.useRef)(null);
	const field = (0, import_react.useRef)(null);
	const busy = indexing || sending;
	const recapPlaying = speakingId === "recap";
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTo({
			top: el.scrollHeight,
			behavior: "smooth"
		});
	}, [
		session.messages,
		sending,
		indexing
	]);
	(0, import_react.useEffect)(() => {
		setRailOpen(false);
	}, [session.messages.length]);
	const submit = (text) => {
		const value = text.trim();
		if (!value || busy) return;
		setDraft("");
		onSend(value);
	};
	const onSubmit = (event) => {
		event.preventDefault();
		submit(draft);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh overflow-hidden overscroll-none bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-80 shrink-0 flex-col border-r border-border bg-surface lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					session,
					recapPlaying,
					onStep,
					onRecap,
					onReset
				})
			}),
			railOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-bg/70",
					"aria-label": "Fechar menu",
					onClick: () => setRailOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "relative flex h-full w-80 max-w-[88vw] flex-col border-r border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-10",
							onClick: () => setRailOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
						session,
						recapPlaying,
						onStep,
						onRecap,
						onReset
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex h-14 shrink-0 items-center justify-between border-b border-border px-3 sm:px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-11 lg:hidden",
									onClick: () => setRailOpen(true),
									"aria-label": "Abrir jornada",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 shrink-0 rounded-full bg-sage" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: session.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted",
										children: [
											(LEVEL_COPY[session.level] ?? LEVEL_COPY.novice).label,
											" · ",
											session.subject
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-11",
								onClick: onRecap,
								disabled: session.messages.length === 0,
								"aria-label": recapPlaying ? "Parar síntese" : "Ouvir síntese",
								children: recapPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-11",
								onClick: onReset,
								"aria-label": "Encerrar sessão",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scroller,
						className: "min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex w-full max-w-2xl flex-col gap-6",
							children: [session.messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, {
								message: msg,
								speaking: speakingId === msg.id,
								onSpeak: () => onSpeak(msg)
							}, msg.id)), indexing || sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thinking, { indexing }) : null]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 border-t border-border bg-bg px-4 pb-4 pt-4 sm:px-8",
						style: { paddingBottom: "max(1rem, env(safe-area-inset-bottom))" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto w-full max-w-2xl",
							children: [
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-sm text-danger",
									role: "alert",
									children: error
								}) : null,
								!busy && session.suggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 flex flex-wrap gap-2",
									children: session.suggestions.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => submit(item),
										className: "min-h-11 rounded-full border border-border bg-elevated px-3 py-2 text-left text-xs text-fg transition-colors duration-[var(--motion-quick)] hover:border-border-strong hover:bg-surface",
										children: item
									}, `${index}-${item.slice(0, 24)}`))
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit,
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										ref: field,
										rows: 1,
										value: draft,
										disabled: busy,
										onChange: (e) => setDraft(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												submit(draft);
											}
										},
										placeholder: indexing ? "Aguardando o guia…" : "Responda ao guia…",
										className: "min-h-14 w-full resize-none rounded-xl border border-border bg-elevated py-4 pl-4 pr-14 text-sm leading-relaxed text-fg outline-none placeholder:text-subtle focus:border-border-strong"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "icon",
										className: "absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-lg",
										disabled: busy || !draft.trim(),
										"aria-label": "Enviar",
										children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-center text-xs text-subtle",
									children: "O guia mede seu nível a cada fala e ajusta a pergunta — não entrega a resposta."
								})
							]
						})
					})
				]
			})
		]
	});
}
function Rail({ session, recapPlaying, onStep, onRecap, onReset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 border-b border-border px-5 py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "SocraticPDF"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Jornada adaptativa"
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-5 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearnerCard, { session }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-xs font-medium uppercase tracking-[0.16em] text-subtle",
					children: "Etapas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 space-y-1",
					children: session.steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepRow, {
						step,
						index,
						active: session.activeStep === index,
						done: index < session.activeStep,
						onClick: () => onStep(index)
					}, `${index}-${step.label}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl border border-border bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: session.fileName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [session.pageCount ? `${session.pageCount} pág. · ` : null, session.subject]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1.5 overflow-hidden rounded-full bg-bg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-sage transition-[width] duration-[var(--motion-slow)] ease-[var(--ease-smooth-out)]",
								style: { width: `${Math.max(4, session.progress)}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs tabular-nums text-subtle",
							children: [session.progress, "% assimilado"]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 border-t border-border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "w-full",
				onClick: onRecap,
				disabled: session.messages.length === 0,
				children: [recapPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-4" }), recapPlaying ? "Parar síntese" : "Ouvir síntese"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "w-full",
				onClick: onReset,
				children: "Trocar documento"
			})]
		})
	] });
}
function LearnerCard({ session }) {
	const copy = LEVEL_COPY[session.level] ?? LEVEL_COPY.novice;
	const active = levelIndex(session.level);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-elevated p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Nível do aluno"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-lg leading-tight",
				children: copy.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted",
				children: [
					copy.hint,
					" · pergunta ",
					session.complexity,
					" de 4"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-3 flex gap-1.5",
				"aria-label": `Nível ${copy.label}`,
				children: LEVELS.map((level, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: cn("h-1.5 flex-1 rounded-full", index <= active ? "bg-sage" : "bg-bg") }, level))
			}),
			session.adaptationNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: session.adaptationNote
			}) : null,
			session.mastery.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: session.mastery.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-xs text-fg",
						children: item.concept
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-xs text-subtle",
						children: [item.score, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 h-1 overflow-hidden rounded-full bg-bg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-sage/80",
						style: { width: `${Math.max(item.score, 3)}%` }
					})
				})] }, item.concept))
			}) : null
		]
	});
}
function StepRow({ step, index, active, done, onClick }) {
	const Icon = STEP_ICONS[index] ?? BookOpen;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-[var(--motion-quick)]", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/70 hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md", active ? "bg-accent text-accent-fg" : done ? "bg-sage/20 text-sage" : "bg-bg text-subtle"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm font-medium",
				children: step.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-xs font-normal leading-snug text-subtle line-clamp-2",
				children: step.hint
			})]
		})]
	}) });
}
function Bubble({ message, speaking, onSpeak }) {
	const mine = message.role === "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("flex gap-3", mine ? "flex-row-reverse" : "flex-row"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg", mine ? "bg-elevated text-muted" : "bg-accent text-accent-fg"),
			"aria-hidden": "true",
			children: mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("max-w-xl rounded-2xl px-4 py-3", mine ? "rounded-tr-md border border-border bg-elevated text-fg" : "rounded-tl-md border border-border bg-surface text-fg"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
				text: message.content,
				serif: !mine
			}), !mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onSpeak,
				className: "mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-0 text-xs font-medium text-muted transition-colors duration-[var(--motion-quick)] hover:text-fg",
				"aria-label": speaking ? "Parar áudio" : "Ouvir o guia",
				children: [speaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-3.5" }), speaking ? "Parar" : "Ouvir"]
			}) : null]
		})]
	});
}
function Thinking({ indexing }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "shimmer-text font-display text-sm",
				children: indexing ? "Lendo o documento e calibrando o primeiro nível…" : "Ajustando a próxima pergunta ao seu nível…"
			})
		})]
	});
}
var SAMPLE_DOCS = [
	{
		id: "caverna",
		title: "A alegoria da caverna",
		author: "Platão — retelling de estudo",
		blurb: "Sombras, libertação e o custo de ver o real.",
		pages: 4,
		text: `A ALEGoria DA CAVERNA — texto de estudo

Imagine uma caverna subterrânea. Desde a infância, um grupo de pessoas vive ali, acorrentado pelo pescoço e pelas pernas. Não podem virar a cabeça. Às suas costas há uma fogueira; entre o fogo e os prisioneiros passa um muro baixo, como o palco de um teatro de marionetes. Outros homens caminham sobre esse muro carregando estátuas, vasos, figuras de animais. A luz projeta as sombras desses objetos na parede que os prisioneiros encaram o dia inteiro.

Para eles, a verdade é o que se move na parede. Nomeiam as sombras, apostam qual virá a seguir, honram quem prevê melhor o desfile. Nunca viram a coisa em si — só a cópia projetada.

Agora suponha que um prisioneiro é solto. A luz da fogueira dói. Os objetos reais, que ele tomava por ilusão, parecem menos nítidos do que as sombras familiares. Se o arrastam para fora, a subida é íngreme e o sol o cega. Primeiro distingue reflexos na água, depois as coisas, depois o céu, e por fim o próprio sol — a causa de tudo o que via.

Platão chama esse movimento de educação: não é colocar visão em olhos cegos, é girar a alma inteira na direção do que é. O bem, no mito, ocupa o lugar do sol. Sem ele, não há verdade nem justiça visíveis.

O libertado lembra dos companheiros. Desce de novo. Na penumbra, seus olhos já não competem no jogo das sombras. Os que ficaram zombam: a viagem para cima estragou a vista. Se ele tenta desatar as correntes, ameaçam matá-lo. A cidade das sombras defende o hábito como se fosse a verdade.

Três teses para o estudo:

1. Percepção não é conhecimento. O que se vê com mais frequência pode ser só o mais projetado.
2. Educar dói. A passagem da opinião (doxa) ao conhecimento (episteme) exige um giro, não um acúmulo de fatos.
3. Quem viu o sol tem uma dívida e um risco: voltar à caverna é um dever político, e também um perigo.

Perguntas que o texto deixa abertas: as sombras de hoje são quais — notícias, métricas, slogans? O educador deve arrastar o outro à força, ou basta apontar a saída? E se o libertado, ao voltar, passa a falar uma língua que a caverna não reconhece?`
	},
	{
		id: "juros",
		title: "Juros compostos",
		author: "Caderno de fundamentos",
		blurb: "Por que o tempo multiplica — e quando destrói.",
		pages: 3,
		text: `JUROS COMPOSTOS — texto de estudo

Juro simples incide só sobre o capital inicial. Juro composto incide sobre o capital e sobre os juros que já foram incorporados. A fórmula canônica do montante M depois de n períodos, com taxa i por período, é:

M = C × (1 + i)^n

C é o capital. i deve estar na mesma unidade de n: 1% ao mês com n em meses; 12% ao ano com n em anos. Trocar a unidade sem converter a taxa é o erro mais comum.

Um exemplo numérico. R$ 1.000 a 1% ao mês, por 12 meses:
M = 1000 × (1,01)^12 ≈ 1.126,83
O juro simples equivalente teria sido 12% × 1000 = 120, total 1.120. A diferença de R$ 6,83 parece pequena. Em 20 anos, 1% ao mês vira:
M = 1000 × (1,01)^240 ≈ 10.892
Quase onze vezes o capital. O mesmo 1% “inofensivo”, com horizonte longo, deixa de ser arredondamento e vira o fenômeno.

Três ideias que o texto pede para dominar:

1. A taxa e o tempo são o mesmo motor. Duplicar a taxa não duplica o resultado final — eleva a base. Duplicar o tempo também não duplica: o expoente cresce, e o crescimento é acelerado.
2. A regra prática do 72: anos para dobrar ≈ 72 / (taxa percentual ao ano). A 6% a.a., cerca de 12 anos. É aproximação, não lei, e piora com taxas altas.
3. Compostos funcionam nos dois sentidos. Dívida de cartão, correção de multa, inflação sobre preço — o mesmo motor que enriquece a reserva destrói o saldo devedor. O sinal da operação (investir versus dever) não muda a matemática; muda quem paga o expoente.

Inflação é juro composto com sinal invertido sobre o poder de compra. Um salário que não reajusta a 6% a.a. perde metade do poder de compra em cerca de 12 anos — de novo a regra do 72.

Para estudar de verdade, não memorize a fórmula. Pegue um caso: “se eu atrasar a dívida em 8 meses a 3,5% a.m., o que acontece com o principal?” Calcule. Depois pergunte o que aconteceria se a taxa caísse pela metade e o prazo dobrasse. Os dois cenários quase nunca dão o mesmo montante — e essa assimetria é o ponto do capítulo.`
	},
	{
		id: "foto",
		title: "Fotossíntese, o essencial",
		author: "Notas de biologia",
		blurb: "Luz vira açúcar — e oxigênio é o subproduto.",
		pages: 3,
		text: `FOTOSSÍNTESE — o essencial

A frase escolar “plantas fazem comida com sol” esconde uma reação química com dois atos. A equação resumida:

6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂

Dióxido de carbono e água, com energia luminosa, tornam-se glicose e oxigênio. O oxigênio que respiramos não vem do CO₂: vem da água. Experiências com o isótopo ¹⁸O mostraram isso. Quem “quebra” a água nas fases claras é o fotossistema II, no tilacoide do cloroplasto.

Dois atos:

Fase clara (dependente de luz). Ocorre nas membranas dos tilacoides. A luz excita clorofila. Elétrons sobem de nível energético e viajam por uma cadeia de transporte. Essa queda controlada bombeia prótons para o lúmen; o fluxo de prótons de volta através da ATP sintase produz ATP. NADP+ recebe elétrons e vira NADPH. Água é a fonte dos elétrons perdidos — daí o O₂ liberado.

Fase escura (independente de luz direta, o ciclo de Calvin). Ocorre no estroma. Não precisa de escuro: precisa de ATP e NADPH. A enzima Rubisco fixa CO₂ numa molécula de 5 carbonos (RuBP), gerando compostos de 3 carbonos que, após gasto de ATP e NADPH, formam açúcar. Parte do açúcar recompõe RuBP; o ciclo continua.

Três armadilhas clássicas de prova:

1. “Fase escura acontece de noite.” Falso. Acontece quando há ATP e NADPH, em geral com luz. De noite a planta respira, não “fotossintetiza no escuro”.
2. “O oxigênio sai do gás carbônico.” Falso. Sai da água.
3. “Fotossíntese é o contrário da respiração.” Quase: as equações se espelham, mas os organelos, as enzimas e o sentido energético não são um filme rebobinado.

Para aplicar: se uma folha fecha os estômatos num dia muito quente, entra menos CO₂. O ciclo de Calvin desacelera, NADPH e ATP se acumulam, e a fase clara também trava. Luz demais com pouco CO₂ ainda pode danificar o fotossistema. O organismo não é uma fórmula — é um sistema com gargalos.`
	}
];
function UploadStage({ busy, error, resume, onPdf, onSample, onResume }) {
	const inputId = (0, import_react.useId)();
	const [over, setOver] = (0, import_react.useState)(false);
	const takeFiles = (files) => {
		const file = files?.[0];
		if (file) onPdf(file);
	};
	const onDrop = (event) => {
		event.preventDefault();
		setOver(false);
		takeFiles(event.dataTransfer.files);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-x-hidden bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				style: { background: "linear-gradient(180deg, color-mix(in oklab, var(--color-elevated) 70%, transparent) 0%, var(--color-bg) 42%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative z-10 flex items-center justify-between px-5 py-5 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold tracking-tight",
						children: "SocraticPDF"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Estudo guiado por perguntas"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "reveal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.18em] text-sage",
							children: "Método socrático"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 max-w-xl font-display text-4xl font-medium leading-[1.12] tracking-[-0.03em] text-fg sm:text-5xl",
							children: "Não leia o PDF. Deixe ele te interrogar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-md text-base leading-relaxed text-muted",
							children: "O guia lê o documento, estima o que você já sabe e recusa o resumo fácil. Cada turno traz um insight curto e uma pergunta calibrada ao seu nível — não sobre o texto, com o texto."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-8 max-w-md border-l border-border-strong pl-4 font-display text-lg italic leading-snug text-fg/90",
							children: ["Não posso te ensinar nada. Posso apenas fazer você pensar.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cite", {
								className: "mt-2 block font-sans text-xs not-italic tracking-wide text-subtle",
								children: "Sócrates"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "reveal reveal-2",
					children: [
						resume ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 rounded-xl border border-border bg-elevated p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.16em] text-subtle",
									children: "Sessão salva"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 truncate text-sm font-medium text-fg",
									children: resume.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 truncate text-xs text-muted",
									children: [
										resume.subject,
										" · ",
										resume.messages.length,
										" falas · ",
										LEVEL_COPY[resume.level].label
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "primary",
									className: "mt-4 w-full",
									disabled: busy,
									onClick: onResume,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Continuar de onde parei"]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: inputId,
							onDragOver: (e) => {
								e.preventDefault();
								setOver(true);
							},
							onDragLeave: () => setOver(false),
							onDrop,
							className: cn("group block cursor-pointer rounded-2xl border border-dashed p-7 transition-[border-color,background-color] duration-[var(--motion-fast)] sm:p-8", over ? "border-accent bg-elevated" : "border-border bg-surface hover:border-border-strong hover:bg-elevated", busy && "pointer-events-none opacity-70"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: inputId,
									type: "file",
									accept: "application/pdf,.pdf",
									className: "sr-only",
									disabled: busy,
									onChange: (e) => {
										takeFiles(e.target.files);
										e.currentTarget.value = "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-12 items-center justify-center rounded-xl bg-elevated text-accent",
									children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-5 font-display text-2xl font-medium tracking-tight",
									children: busy ? "Lendo o documento…" : "Suba o PDF de estudo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-sm text-sm leading-relaxed text-muted",
									children: "Texto selecionável, até 8 MB. Arraste o arquivo ou escolha no computador."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg",
									children: "Selecionar arquivo"
								})
							]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-danger",
							role: "alert",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.16em] text-subtle",
								children: "Ou comece com um texto de estudo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 grid gap-2",
								children: SAMPLE_DOCS.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									size: "chip",
									disabled: busy,
									className: "w-full justify-start gap-3 rounded-xl px-4 py-3",
									onClick: () => onSample(sample),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-9 shrink-0 items-center justify-center rounded-md bg-bg text-sage",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-fg",
											children: sample.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block truncate text-xs font-normal text-muted",
											children: [
												sample.author,
												" · ",
												sample.blurb
											]
										})]
									})]
								}) }, sample.id))
							})]
						})
					]
				})]
			})
		]
	});
}
var RECAP_MAX = 900;
function buildSessionRecap(session) {
	if (!session) return "";
	const level = LEVEL_COPY[session.level]?.label ?? "Iniciante";
	const step = session.steps[session.activeStep]?.label ?? "";
	const lastGuide = [...session.messages].reverse().find((msg) => msg.role === "assistant")?.content ?? "";
	const mastery = session.mastery.filter((item) => item.score > 0).map((item) => `${item.concept} ${item.score} por cento`).join(", ");
	const parts = [
		`Síntese da sessão. ${session.title}.`,
		session.subject ? `Tema: ${session.subject}.` : "",
		`Nível do aluno: ${level}.`,
		step ? `Etapa atual: ${step}.` : "",
		session.adaptationNote || "",
		mastery ? `Domínio parcial: ${mastery}.` : "",
		lastGuide ? `Última pergunta do guia: ${lastGuide}` : ""
	];
	return toSpeechText(parts.filter(Boolean).join(" "), RECAP_MAX);
}
var SESSION_KEY = "socraticpdf.session.v1";
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function asMessages(value) {
	if (!Array.isArray(value) || value.length === 0) return null;
	const messages = [];
	for (const item of value.slice(-24)) {
		if (!isRecord(item)) continue;
		const role = item.role === "assistant" ? "assistant" : item.role === "user" ? "user" : null;
		const content = typeof item.content === "string" ? item.content.trim() : "";
		const id = typeof item.id === "string" && item.id ? item.id : `msg_${messages.length}`;
		if (!role || !content) continue;
		messages.push({
			id,
			role,
			content
		});
	}
	return messages.length > 0 ? messages : null;
}
function asSteps(value) {
	if (!Array.isArray(value) || value.length < 3) return DEFAULT_STEPS;
	const steps = [];
	for (const item of value.slice(0, 4)) {
		if (!isRecord(item)) continue;
		const label = typeof item.label === "string" ? item.label.trim() : "";
		if (!label) continue;
		const hint = typeof item.hint === "string" && item.hint.trim() ? item.hint.trim() : "Siga as perguntas do guia.";
		steps.push({
			label,
			hint
		});
	}
	return steps.length >= 3 ? steps : DEFAULT_STEPS;
}
function asStringList(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 8);
}
function parseStoredSession(raw) {
	const root = typeof raw === "string" ? safeJson(raw) : raw;
	if (!isRecord(root)) return null;
	const session = isRecord(root.session) ? root.session : root;
	const messages = asMessages(session.messages);
	const documentText = typeof session.documentText === "string" ? session.documentText.trim() : "";
	const fileName = typeof session.fileName === "string" ? session.fileName.trim() : "";
	if (!messages || documentText.length < 80 || !fileName) return null;
	const pageCount = session.pageCount == null ? null : Number(session.pageCount);
	const activeStep = Number(session.activeStep);
	const progress = Number(session.progress);
	const concepts = asStringList(session.concepts);
	const adaptive = defaultAdaptation(concepts);
	return {
		fileName,
		pageCount: Number.isFinite(pageCount) && pageCount !== null ? Math.max(1, Math.round(pageCount)) : null,
		documentText,
		title: typeof session.title === "string" && session.title.trim() ? session.title.trim() : fileName.replace(/\.pdf$/i, ""),
		subject: typeof session.subject === "string" && session.subject.trim() ? session.subject.trim() : "Sessão de estudo",
		concepts,
		steps: asSteps(session.steps),
		activeStep: Number.isFinite(activeStep) ? Math.min(3, Math.max(0, Math.round(activeStep))) : 0,
		progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 8,
		messages,
		suggestions: asStringList(session.suggestions).slice(0, 3),
		level: asLevel(session.level, adaptive.level),
		complexity: clampInt$1(session.complexity, 1, 4, adaptive.complexity),
		scaffolding: asScaffolding(session.scaffolding, adaptive.scaffolding),
		adaptationNote: typeof session.adaptationNote === "string" && session.adaptationNote.trim() ? session.adaptationNote.trim().slice(0, 180) : adaptive.adaptationNote,
		mastery: parseMastery(session.mastery, concepts)
	};
}
function safeJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function serializeSession(session) {
	return JSON.stringify({
		v: 1,
		savedAt: Date.now(),
		session: {
			...session,
			documentText: session.documentText.slice(0, 2e4),
			messages: session.messages.slice(-24)
		}
	});
}
function loadSession() {
	if (typeof localStorage === "undefined") return null;
	try {
		return parseStoredSession(localStorage.getItem(SESSION_KEY));
	} catch {
		return null;
	}
}
function saveSession(session) {
	if (typeof localStorage === "undefined") return;
	if (session.messages.length === 0) return;
	try {
		localStorage.setItem(SESSION_KEY, serializeSession(session));
	} catch {}
}
function clearSession() {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.removeItem(SESSION_KEY);
	} catch {}
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DOC_LIMIT = 18e3;
var openTutoring = createServerFn({ method: "POST" }).validator((input) => ({
	fileName: clip(String(input?.fileName ?? "documento.pdf"), 180),
	documentText: clip(String(input?.documentText ?? ""), DOC_LIMIT)
})).handler(createSsrRpc("9b33bed3da163ce11b2df417941ad0276d170159fbfed13d83d163ea66699bdc"));
var continueTutoring = createServerFn({ method: "POST" }).validator((input) => ({
	fileName: clip(String(input?.fileName ?? "documento.pdf"), 180),
	documentText: clip(String(input?.documentText ?? ""), DOC_LIMIT),
	title: clip(String(input?.title ?? "Documento"), 80),
	activeStep: Math.min(3, Math.max(0, Number(input?.activeStep) || 0)),
	progress: Math.min(100, Math.max(0, Number(input?.progress) || 0)),
	level: clip(String(input?.level ?? "novice"), 24),
	complexity: Math.min(4, Math.max(1, Number(input?.complexity) || 1)),
	scaffolding: clip(String(input?.scaffolding ?? "heavy"), 24),
	mastery: (Array.isArray(input?.mastery) ? input.mastery : []).slice(0, 6).map((item) => ({
		concept: clip(String(item?.concept ?? ""), 48),
		score: Math.min(100, Math.max(0, Number(item?.score) || 0))
	})).filter((item) => item.concept.length > 0),
	messages: (Array.isArray(input?.messages) ? input.messages : []).slice(-12).map((msg) => ({
		role: msg.role === "assistant" ? "assistant" : "user",
		content: clip(String(msg.content ?? ""), 3500)
	})).filter((msg) => msg.content.length > 0)
})).handler(createSsrRpc("18e7ca597c7295db18cb144eab2e06ff45c8f01cbc0e425a265283d8ef1f00fa"));
var speakTutor = createServerFn({ method: "POST" }).validator((input) => ({ text: toSpeechText(String(input?.text ?? "")) })).handler(createSsrRpc("bbf6a6b1007a0b8ae176d05fcedd003588dab0dc153438b3956ba355dbc1c460"));
function SocraticApp() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [resume, setResume] = (0, import_react.useState)(null);
	const [indexing, setIndexing] = (0, import_react.useState)(false);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [speakingId, setSpeakingId] = (0, import_react.useState)(null);
	const generation = (0, import_react.useRef)(0);
	const audioRef = (0, import_react.useRef)(null);
	const voiceCache = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	(0, import_react.useEffect)(() => {
		setResume(loadSession());
	}, []);
	(0, import_react.useEffect)(() => {
		if (session && session.messages.length > 0) saveSession(session);
		voiceCache.current.delete("recap");
	}, [session]);
	const bump = () => {
		generation.current += 1;
		audioRef.current?.pause();
		setSpeakingId(null);
		return generation.current;
	};
	const startFromText = (0, import_react.useCallback)(async (fileName, documentText, pageCount, gen) => {
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
			...defaultAdaptation()
		});
		const result = await openTutoring({ data: {
			fileName,
			documentText: text
		} });
		if (generation.current !== gen) return;
		setIndexing(false);
		if (!result.ok) {
			setSession(null);
			setError(result.error);
			return;
		}
		const first = {
			id: uid(),
			role: "assistant",
			content: result.session.reply
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
			...adaptive
		});
		setResume(null);
	}, []);
	const onPdf = async (file) => {
		const gen = bump();
		setError(null);
		setIndexing(true);
		try {
			const { extractPdfText } = await import("./pdf-extract-BkK2RB9H.mjs");
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
	const onSample = (sample) => {
		const gen = bump();
		startFromText(`${sample.title}.pdf`, sample.text, sample.pages, gen);
	};
	const onSend = async (text) => {
		if (!session || sending || indexing) return;
		const gen = generation.current;
		const userMsg = {
			id: uid(),
			role: "user",
			content: text
		};
		const nextMessages = [...session.messages, userMsg];
		setSession({
			...session,
			messages: nextMessages,
			suggestions: []
		});
		setSending(true);
		setError(null);
		const previousSuggestions = session.suggestions;
		const result = await continueTutoring({ data: {
			fileName: session.fileName,
			documentText: session.documentText,
			title: session.title,
			messages: nextMessages.map((msg) => ({
				role: msg.role,
				content: msg.content
			})),
			activeStep: session.activeStep,
			progress: session.progress,
			level: session.level,
			complexity: session.complexity,
			scaffolding: session.scaffolding,
			mastery: session.mastery
		} });
		if (generation.current !== gen) return;
		setSending(false);
		if (!result.ok) {
			setError(result.error);
			setSession((current) => current && generation.current === gen ? {
				...current,
				suggestions: previousSuggestions
			} : current);
			return;
		}
		const reply = {
			id: uid(),
			role: "assistant",
			content: result.turn.reply
		};
		setSession((current) => {
			if (!current || generation.current !== gen) return current;
			const adaptive = applyTurnAdaptation({
				previous: current,
				turn: result.turn,
				userAnswer: text,
				concepts: current.concepts
			});
			return {
				...current,
				messages: [...current.messages, reply],
				activeStep: result.turn.stepIndex,
				progress: Math.max(current.progress, result.turn.progress),
				suggestions: result.turn.suggestions,
				...adaptive
			};
		});
	};
	const onStep = (index) => {
		if (!session || sending || indexing) return;
		const step = session.steps[index];
		if (!step) return;
		onSend(`Quero focar na etapa “${step.label}”. Comece a me ensinar por essa parte.`);
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
	const playAudio = async (id, text) => {
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
	const onSpeak = async (message) => {
		await playAudio(message.id, message.content);
	};
	const onRecap = async () => {
		if (!session) return;
		await playAudio("recap", buildSessionRecap(session));
	};
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadStage, {
		busy: indexing,
		error,
		resume,
		onPdf,
		onSample,
		onResume
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {
		session,
		indexing,
		sending,
		speakingId,
		error,
		onSend,
		onStep,
		onSpeak,
		onRecap,
		onReset
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocraticApp, {});
}
//#endregion
export { truncateDocument as n, routes_exports as t };
