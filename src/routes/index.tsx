import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StudentFlow, type FlowStep, type FlowData } from "@/components/StudentFlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduPath — Định hướng tổ hợp môn THPT bằng AI" },
      { name: "description", content: "Chọn tổ hợp môn THPT phù hợp: xem cấu trúc chương trình, so sánh tổ hợp của trường và nhận tư vấn cá nhân hoá trong vài phút." },
      { property: "og:title", content: "EduPath — Định hướng tổ hợp môn THPT" },
      { property: "og:description", content: "Tư vấn tổ hợp môn học và ngành nghề cho học sinh THPT dựa trên dữ liệu học tập cá nhân." },
    ],
  }),
  component: Index,
});

type Phase = "home" | "flow" | "done";

const STEPS = [
  { id: 1, label: "Khối lớp" },
  { id: 2, label: "Tổ hợp môn" },
  { id: 3, label: "Chọn tổ hợp" },
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
  const [result, setResult] = useState<FlowData | null>(null);

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
              setResult(data);
              setPhase("done");
            }}
          />
        )}
        {phase === "done" && result && (
          <section className="min-h-[calc(100vh-4rem)] bg-hero py-16">
            <div className="mx-auto max-w-2xl px-6 text-center animate-fade-in-up">
              <div className="card-soft p-10">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full btn-holo text-2xl">
                  ✓
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Cảm ơn {result.ho_ten}!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thông tin của em đã được lưu. Chúng mình sẽ dùng dữ liệu này để đưa ra gợi ý
                  tổ hợp môn và ngành học phù hợp nhất trong bước tiếp theo.
                </p>
                <div className="mt-6 grid gap-2 rounded-2xl border border-border bg-card p-5 text-left text-sm">
                  <Row k="Trường" v={result.truong} />
                  <Row k="Khối lớp" v={`Lớp ${result.khoi_lop}`} />
                  <Row k="Tổ hợp đã chọn" v={result.to_hop_da_chon} />
                  <Row k="Xếp loại lớp 9" v={result.xep_loai_lop9} />
                  <Row k="Điểm tuyển sinh" v={String(result.diem_tuyen_sinh)} />
                  <Row k="Môn giỏi" v={result.mon_gioi.join(", ")} />
                  {result.nganh_du_kien && <Row k="Ngành dự kiến" v={result.nganh_du_kien} />}
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setPhase("home");
                    setStep(1);
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/60 hover:text-primary"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </section>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium text-foreground">{v}</span>
    </div>
  );
}
