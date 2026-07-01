import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, Sparkles } from "lucide-react";

interface Props {
  onBack: () => void;
  onComplete: (data: unknown) => void;
}

const SUBJECTS = [
  "Ngữ văn",
  "Toán",
  "Ngoại ngữ",
  "Giáo dục công dân",
  "Lịch sử và Địa lí",
  "Khoa học tự nhiên",
  "Công nghệ",
  "Tin học",
  "Giáo dục thể chất",
  "Nghệ thuật (Âm nhạc, Mĩ thuật)",
];

// TODO: replace with Supabase query to schema `data_truong`, table `truong_thpt`.
const SCHOOLS = [
  "THPT Chuyên Hà Nội – Amsterdam",
  "THPT Chuyên Khoa học Tự nhiên",
  "THPT Chuyên Sư phạm",
  "THPT Chu Văn An (Hà Nội)",
  "THPT Kim Liên (Hà Nội)",
  "THPT Lê Hồng Phong (TP.HCM)",
  "THPT Nguyễn Thượng Hiền (TP.HCM)",
  "THPT Trần Đại Nghĩa (TP.HCM)",
  "THPT Chuyên Lê Quý Đôn (Đà Nẵng)",
  "THPT Phan Châu Trinh (Đà Nẵng)",
  "THPT Chuyên Lê Hồng Phong (Nam Định)",
  "THPT Chuyên Nguyễn Trãi (Hải Dương)",
];

export function OnboardingForm({ onBack, onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    fullName: "",
    grade: "",
    school: "",
    email: "",
    scoreMath: "",
    scoreLit: "",
    scoreEng: "",
    strongSubjects: [] as string[],
  });
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolOpen, setSchoolOpen] = useState(false);

  const filteredSchools = useMemo(() => {
    const q = schoolQuery.trim().toLowerCase();
    if (!q) return SCHOOLS;
    return SCHOOLS.filter((s) => s.toLowerCase().includes(q));
  }, [schoolQuery]);

  const canNext =
    form.fullName.trim() && form.grade && form.school;

  const toggleSubject = (s: string) => {
    setForm((f) => ({
      ...f,
      strongSubjects: f.strongSubjects.includes(s)
        ? f.strongSubjects.filter((x) => x !== s)
        : [...f.strongSubjects, s],
    }));
  };

  const handleSubmit = () => {
    // Next step: Holland Code test — hook up here.
    console.log("Form submit", form);
    alert("Đã lưu thông tin! Bước tiếp theo: Trắc nghiệm Holland Code (sẽ được tích hợp).");
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-hero py-14">
      <div className="mx-auto max-w-2xl px-6 animate-fade-in-up">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
        </button>

        <div className="card-soft p-8 sm:p-10">
          {/* Stepper */}
          <div className="mb-8 flex items-center gap-3">
            {[1, 2].map((n) => (
              <div key={n} className="flex flex-1 items-center gap-3">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition-all ${
                    step >= n
                      ? "btn-holo"
                      : "border border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {step > n ? <Check className="h-4 w-4" /> : n}
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-medium ${step >= n ? "text-primary" : "text-muted-foreground"}`}>
                    Bước {n}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {n === 1 ? "Thông tin cơ bản" : "Năng lực học tập"}
                  </div>
                </div>
                {n === 1 && <div className={`h-px flex-1 ${step > 1 ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <Field label="Họ và tên">
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="input"
                />
              </Field>

              <Field label="Lớp hiện tại">
                <div className="relative">
                  <select
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="input appearance-none pr-10"
                  >
                    <option value="">-- Chọn lớp --</option>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>

              <Field label="Trường THPT">
                <div className="relative">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={form.school || schoolQuery}
                      onChange={(e) => {
                        setSchoolQuery(e.target.value);
                        setForm({ ...form, school: "" });
                        setSchoolOpen(true);
                      }}
                      onFocus={() => setSchoolOpen(true)}
                      placeholder="Tìm kiếm trường của bạn..."
                      className="input pl-10"
                    />
                  </div>
                  {schoolOpen && (
                    <div className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lg">
                      {filteredSchools.length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Không có kết quả</div>
                      )}
                      {filteredSchools.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, school: s });
                            setSchoolQuery("");
                            setSchoolOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          {s}
                          {form.school === s && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Email" hint="Tuỳ chọn">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ban@example.com"
                  className="input"
                />
              </Field>

              <div className="pt-2">
                <button
                  disabled={!canNext}
                  onClick={() => setStep(2)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  Tiếp tục <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-foreground">Điểm thi tuyển sinh lớp 10</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Dùng để đánh giá năng lực tương đối (0 – 10, cho phép nhập thập phân)
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <ScoreInput label="Toán" value={form.scoreMath} onChange={(v) => setForm({ ...form, scoreMath: v })} />
                  <ScoreInput label="Ngữ văn" value={form.scoreLit} onChange={(v) => setForm({ ...form, scoreLit: v })} />
                  <ScoreInput label="Anh" value={form.scoreEng} onChange={(v) => setForm({ ...form, scoreEng: v })} />
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-foreground">Môn học giỏi lớp 9</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Chọn các môn bạn học tốt để tăng trọng số tổ hợp phù hợp
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => {
                    const active = form.strongSubjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSubject(s)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-primary btn-holo shadow-sm"
                            : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50"
                >
                  <ArrowLeft className="h-4 w-4" /> Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold hover:scale-[1.01]"
                >
                  <Sparkles className="h-4 w-4" /> Bắt đầu trắc nghiệm Holland
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

function ScoreInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      <input
        type="number"
        min={0}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.0"
        className="input text-center text-lg font-semibold"
      />
    </div>
  );
}
