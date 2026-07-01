import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OnboardingForm } from "@/components/OnboardingForm";
import { HollandTest, type HollandType } from "@/components/HollandTest";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduPath — Định hướng tổ hợp môn THPT bằng AI" },
      { name: "description", content: "Trắc nghiệm Holland Code + AI gợi ý tổ hợp môn phù hợp trong 15 phút cho học sinh THPT." },
      { property: "og:title", content: "EduPath — Định hướng tổ hợp môn THPT" },
      { property: "og:description", content: "Phân tích cá nhân hoá bằng AI dựa trên Holland Code và năng lực học tập." },
    ],
  }),
  component: Index,
});

type Phase = "home" | "info" | "holland";

const PHASES: { id: Phase; label: string }[] = [
  { id: "home", label: "Trang chủ" },
  { id: "info", label: "Thông tin" },
  { id: "holland", label: "Trắc nghiệm Holland" },
];

function PhaseBar({ phase }: { phase: Phase }) {
  if (phase === "home") return null;
  const activeIdx = PHASES.findIndex((p) => p.id === phase);
  return (
    <div className="border-b border-border bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-2 px-6 py-3 text-xs">
        {PHASES.map((p, i) => {
          const active = i === activeIdx;
          const done = i < activeIdx;
          return (
            <div key={p.id} className="flex items-center gap-2">
              <div
                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                  active
                    ? "btn-holo"
                    : done
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`font-medium ${
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {p.label}
              </span>
              {i < PHASES.length - 1 && (
                <span className="mx-2 h-px w-8 bg-border sm:w-12" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Index() {
  const [phase, setPhase] = useState<Phase>("home");
  const [, setInfo] = useState<unknown>(null);
  const [, setScores] = useState<Record<HollandType, number> | null>(null);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <PhaseBar phase={phase} />
      <main>
        {phase === "home" && <Hero onStart={() => setPhase("info")} />}
        {phase === "info" && (
          <OnboardingForm
            onBack={() => setPhase("home")}
            onComplete={(data) => {
              setInfo(data);
              setPhase("holland");
            }}
          />
        )}
        {phase === "holland" && (
          <HollandTest
            onBack={() => setPhase("info")}
            onComplete={(s) => {
              setScores(s);
              // TODO: Next phase — kết quả + gợi ý tổ hợp bằng AI
              console.log("Holland scores", s);
            }}
          />
        )}
      </main>
      <footer id="lien-he" className="border-t border-border bg-card/50 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EduPath · Định hướng tổ hợp môn THPT bằng AI · Made in Vietnam
        </div>
      </footer>
    </div>
  );
}
