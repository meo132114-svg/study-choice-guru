import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StudentFlow, type FlowStep, type FlowData } from "@/components/StudentFlow";
import { HollandTest, type HollandScores } from "@/components/HollandTest";
import { HollandResults } from "@/components/HollandResults";
import HollandSubjectSuggestion from "@/components/HollandSubjectSuggestion"; // Sửa lại đường dẫn nếu cần

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NaviCareer — Định hướng tổ hợp môn THPT bằng AI" },
      { name: "description", content: "Chọn tổ hợp môn THPT phù hợp: xem cấu trúc chương trình, so sánh tổ hợp của trường và nhận tư vấn cá nhân hoá trong vài phút." },
      { property: "og:title", content: "NaviCareer — Định hướng tổ hợp môn THPT" },
      { property: "og:description", content: "Tư vấn tổ hợp môn học và ngành nghề cho học sinh THPT dựa trên dữ liệu học tập cá nhân." },
    ],
  }),
  component: Index,
});

// 1. Thêm "suggestion" vào type Phase
type Phase = "home" | "flow" | "holland" | "result" | "suggestion";

const STEPS = [
  { id: 1, label: "Khối lớp" },
  { id: 2, label: "Chương trình" },
  { id: 3, label: "Tổ hợp môn" },
  { id: 4, label: "Thông tin" },
];

function PhaseBar({ show, activeIdx }: { show: boolean; activeIdx: number }) {
  if (!show) return null;
  return (
    <div className="border-b border-border bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-6 py-3 text-xs">
        {STEPS.map((p, i) => {
          const active = i === activeIdx;
          const done = i < activeIdx;
          return (
            <div key={p.id} className="flex items-center gap-2">
              <div
                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                  active ? "btn-holo" : done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {p.id}
              </div>
              <span
                className={`font-medium ${
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {p.label}
              </span>
              {i < STEPS.length - 1 && <span className="mx-2 h-px w-8 bg-border sm:w-12" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Index() {
  const [phase, setPhase] = useState<Phase>("home");
  const [step, setStep] = useState<FlowStep>(1);
  const [profile, setProfile] = useState<FlowData | null>(null);
  const [scores, setScores] = useState<HollandScores | null>(null);

  const reset = () => {
    setProfile(null);
    setScores(null);
    setStep(1);
    setPhase("home");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <PhaseBar show={phase === "flow"} activeIdx={step - 1} />
      <main>
        {phase === "home" && <Hero onStart={() => setPhase("flow")} />}
        {phase === "flow" && (
          <StudentFlow
            onBack={() => setPhase("home")}
            onStepChange={setStep}
            onComplete={(data) => {
              setProfile(data);
              setPhase("holland");
            }}
          />
        )}
        {phase === "holland" && (
          <HollandTest
            onBack={() => setPhase("flow")}
            onDone={(s) => {
              setScores(s);
              setPhase("result");
            }}
          />
        )}
        {/* 2. Sửa lại logic gọi hàm ở đây */}
        {phase === "result" && scores && (
          <HollandResults 
            scores={scores} 
            name={profile?.ho_ten} 
            onHome={reset} 
            onViewSuggestions={() => setPhase("suggestion")}
          />
        )}
        {/* 3. Hiển thị component gợi ý */}
        {phase === "suggestion" && (
          <HollandSubjectSuggestion scores={scores} onBack={() => setPhase("result")} />
        )}
      </main>
      <footer id="lien-he" className="border-t border-border bg-card/50 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NaviCareer · Định hướng tổ hợp môn THPT bằng AI · Made in Vietnam
        </div>
      </footer>
    </div>
  );
}