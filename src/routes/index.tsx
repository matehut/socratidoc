import { createFileRoute } from "@tanstack/react-router";
import { SocraticApp } from "@/components/socratic-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SocraticApp />;
}
