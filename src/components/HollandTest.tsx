import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";

export type HollandCode = "R" | "I" | "A" | "S" | "E" | "C";

export type HollandScores = Record<HollandCode, number>;

type Question = { id: number; text: string; type: HollandCode };

const LEVELS = [
  { value: 1, emoji: "😡", label: "Rất không thích" },
  { value: 2, emoji: "🙁", label: "Không thích" },
  { value: 3, emoji: "😐", label: "Không chắc" },
  { value: 4, emoji: "🙂", label: "Thích" },
  { value: 5, emoji: "😍", label: "Rất thích" },
] as const;

interface Props {
  onBack: () => void;
  onDone: (scores: HollandScores) => void;
}

export function HollandTest({ onBack, onDone }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [fade, setFade] = useState<"in" | "out">("in");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabasePublic
        .from("holland_question")
        .select("id, text, type")
        .order("id", { ascending: true });
      if (error) setErr(error.message);
      else setQuestions((data ?? []) as Question[]);
      setLoading(false);
    })();
  }, []);

  const total = questions.length;
  const current = questions[idx];
  const answered = Object.keys(answers).length;
  const progress = total ? Math.round(((idx + 1) / total) * 100) : 0;

  const goNext = () => {
    if (idx < total - 1) {
      setFade("out");
      setTimeout(() => {
        setIdx((i) => i + 1);
        setFade("in");
      }, 180);
    }
  };
  const goPrev = () => {
    if (idx > 0) {
      setFade("out");
      setTimeout(() => {
        setIdx((i) => i - 1);
        setFade("in");
      }, 180);
    }
  };

  const pick = (v: number) => {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.id]: v }));
    if (idx < total - 1) goNext();
  };

  const submit = async () => {
    setSubmitting(true);
    const scores: HollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    for (const q of questions) {
      const v = answers[q.id];
      if (v) scores[q.type] += v;
    }
    const { error } = await supabasePublic.from("holland_results").insert({
      score_r: scores.R,
      score_i: scores.I,
      score_a: scores.A,
      score_s: scores.S,
      score_e: scores.E,
      score_c: scores.C,
    });
    setSubmitting(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onDone(scores);
  };

  const canSubmit = total > 0 && answered === total && !submitting;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-hero py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-6 animate-fade-in-up">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>

        <div className="card-soft p-8 sm:p-10 space-y-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Trắc nghiệm Holland Code
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Khám phá xu hướng nghề nghiệp
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Hãy trả lời thành thật theo cảm nhận đầu tiên của em với mỗi hoạt động.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Đang tải câu hỏi...
            </div>
          )}
          {err && !loading && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
              {err}
            </div>
          )}

          {!loading && !err && current && (
            <>
              {/* Progress */}
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary">
                    Câu hỏi {idx + 1} / {total}
                  </span>
                  <span className="text-muted-foreground">
                    Đã trả lời {answered}/{total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: "var(--gradient-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div
                key={current.id}
                className={`rounded-2xl border border-border bg-gradient-to-br from-primary/8 to-primary/[0.02] p-8 text-center transition-opacity duration-200 ${
                  fade === "in" ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Em cảm thấy như thế nào với hoạt động này?
                </div>
                <p className="font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {current.text}
                </p>
              </div>

              {/* Answer buttons */}
              <div className="grid grid-cols-5 gap-2">
                {LEVELS.map((l) => {
                  const active = answers[current.id] === l.value;
                  return (
                    <button
                      key={l.value}
                      onClick={() => pick(l.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition-all ${
                        active
                          ? "border-primary bg-primary/10 shadow-sm scale-[1.03]"
                          : "border-border bg-card hover:border-primary/50 hover:-translate-y-0.5"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl">{l.emoji}</span>
                      <span
                        className={`text-[10px] font-semibold leading-tight sm:text-xs ${
                          active ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {l.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={goPrev}
                  disabled={idx === 0}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" /> Quay lại
                </button>
                {idx < total - 1 ? (
                  <button
                    onClick={goNext}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/50"
                  >
                    Tiếp theo <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={!canSubmit}
                    className="inline-flex items-center gap-2 rounded-full btn-holo px-6 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Đang nộp...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Nộp bài
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
