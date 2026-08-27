export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type JourneyStep = {
  label: string;
  hint: string;
};

export type LearnerLevel = "novice" | "developing" | "proficient" | "mastery";
export type Scaffolding = "heavy" | "moderate" | "light" | "none";

export type MasteryItem = {
  concept: string;
  score: number;
};

export type AdaptiveState = {
  level: LearnerLevel;
  complexity: number;
  scaffolding: Scaffolding;
  adaptationNote: string;
  mastery: MasteryItem[];
};

export type Adaptation = AdaptiveState;

export type TutorPayload = {
  reply: string;
  stepIndex: number;
  progress: number;
  suggestions: string[];
} & AdaptiveState;

export type OpenSession = {
  title: string;
  subject: string;
  concepts: string[];
  steps: JourneyStep[];
} & TutorPayload;

export type StudioSession = {
  fileName: string;
  pageCount: number | null;
  documentText: string;
  title: string;
  subject: string;
  concepts: string[];
  steps: JourneyStep[];
  activeStep: number;
  progress: number;
  messages: ChatMessage[];
  suggestions: string[];
} & AdaptiveState;

export const DEFAULT_STEPS: JourneyStep[] = [
  {
    label: "Fundamentos",
    hint: "Vocabulário, premissas e o mapa do texto",
  },
  {
    label: "Análise crítica",
    hint: "Por que o autor afirma isso — e o que fica de fora",
  },
  {
    label: "Aplicação prática",
    hint: "Levar a ideia para um caso concreto",
  },
  {
    label: "Domínio",
    hint: "Ensinar de volta, com as suas palavras",
  },
];
