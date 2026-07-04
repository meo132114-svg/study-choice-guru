import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Layers,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import {
  supabaseDataTruong,
  supabasePublic,
  type NganhDaoTao,
  type Truong,
} from "@/lib/supabase";

interface Props {
  onBack: () => void;
  onComplete: (data: FlowData) => void;
  onStepChange?: (step: FlowStep) => void;
}

export type FlowStep = 1 | 2 | 3 | 4;

export type FlowData = {
  truong: string;
  khoi_lop: "10" | "11" | "12";
  ho_ten: string;
  xep_loai_lop9: "Tốt" | "Khá" | "Đạt" | "Chưa đạt";
  diem_toan: number;
  diem_van: number;
  diem_anh: number;
  diem_tong: number;
  mon_gioi: string[];
  nganh_du_kien: string;
};

const GRADES = [
  { id: "10" as const, emoji: "🎒", label: "Lớp 10", hint: "Tư vấn tổ hợp môn học" },
  { id: "11" as const, emoji: "📚", label: "Lớp 11", hint: "Xem tổ hợp mở ra được các ngành gì" },
  { id: "12" as const, emoji: "🎓", label: "Lớp 12", hint: "Gợi ý ngành, trường xét tuyển" },
];

const MON_BAT_BUOC = ["Toán", "Ngữ văn", "Tiếng Anh", "Lịch sử", "GDTC", "GDĐP", "GDQP", "HĐTN-HN"];
const MON_LUA_CHON = ["Vật lý", "Hóa học", "Sinh học", "Địa lý", "GDKT-PL", "Tin học", "Công nghệ"];

const TO_HOP = [
  {
    id: "TH1",
    name: "Tổ hợp TH1",
    lop: 4,
    mon: ["Địa lí", "GDKT&PL", "Sinh học", "Tin học"],
    chuyen_de: ["Toán", "Văn", "Địa"],
    so_luoc: "Chuyên về các môn xã hội, dành cho học sinh không tư duy tốt các môn tự nhiên.",
  },
  {
    id: "TH2",
    name: "Tổ hợp TH2",
    lop: 4,
    mon: ["Vật lý", "Hóa học", "Sinh học", "Công nghệ (NN)"],
    chuyen_de: ["Toán", "Lý", "Hóa"],
    so_luoc: "Tập trung các trường tuyển khối A, B, D các ngành có liên quan. Dành cho học sinh tư duy tốt và giỏi đều các môn tự nhiên.",
  },
  {
    id: "TH3",
    name: "Tổ hợp TH3",
    lop: 5,
    mon: ["Vật lý", "Hóa học", "GDKT&PL", "Công nghệ (CN)"],
    chuyen_de: ["Toán", "Lý", "Hóa"],
    so_luoc: "Dành cho học sinh tư duy tốt về 3 môn tự nhiên Toán, Lý, Hóa.",
  },
  {
    id: "TH4",
    name: "Tổ hợp TH4",
    lop: 5,
    mon: ["Vật lý", "Hóa học", "Địa lý", "Tin học"],
    chuyen_de: ["Toán", "Lý", "Hóa"],
    so_luoc: "Dành cho học sinh tư duy tốt về 3 môn tự nhiên Toán, Lý, Hóa.",
  },
];

const MON_GIOI_LIST = [
  "Toán", "Ngữ văn", "Lịch sử", "Địa lý", "Tiếng Anh",
  "Vật lý", "Hóa học", "Sinh học", "Tin học", "Công nghệ", "GDCD",
];

const XEP_LOAI = ["Tốt", "Khá", "Đạt", "Chưa đạt"] as const;

export function StudentFlow({ onBack, onComplete, onStepChange }: Props) {
  const [step, setStep] = useState<FlowStep>(1);
  const [truong, setTruong] = useState("");
  const [khoiLop, setKhoiLop] = useState<"10" | "11" | "12" | "">("");
  const [hoTen, setHoTen] = useState("");
  const [xepLoai, setXepLoai] = useState<(typeof XEP_LOAI)[number] | "">("");
  const [diemToan, setDiemToan] = useState("");
  const [diemVan, setDiemVan] = useState("");
  const [diemAnh, setDiemAnh] = useState("");
  const [monGioi, setMonGioi] = useState<string[]>([]);
  const [nganh, setNganh] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const go = (n: FlowStep) => setStep(n);

  const handleFinish = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const t = Number(diemToan);
    const v = Number(diemVan);
    const a = Number(diemAnh);
    const payload = {
      truong_thpt: truong,
      khoi_lop: khoiLop,
      ho_ten: hoTen,
      xep_loai_lop9: xepLoai,
      diem_toan: t,
      diem_van: v,
      diem_anh: a,
      mon_gioi: monGioi,
      nganh_du_kien: nganh || null,
    };
    const { error } = await supabasePublic.from("hoc_sinh_profile").insert(payload);
    setSubmitting(false);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    onComplete({
      truong,
      khoi_lop: khoiLop as "10" | "11" | "12",
      ho_ten: hoTen,
      xep_loai_lop9: xepLoai as (typeof XEP_LOAI)[number],
      diem_toan: t,
      diem_van: v,
      diem_anh: a,
      diem_tong: +(t + v + a).toFixed(2),
      mon_gioi: monGioi,
      nganh_du_kien: nganh,
    });
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-hero py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-6 animate-fade-in-up">
        <button
          onClick={step === 1 ? onBack : () => go((step - 1) as FlowStep)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> {step === 1 ? "Quay lại trang chủ" : "Quay lại"}
        </button>

        {step === 1 && (
          <Step1
            truong={truong}
            setTruong={setTruong}
            khoiLop={khoiLop}
            setKhoiLop={setKhoiLop}
            onNext={() => go(2)}
          />
        )}
        {step === 2 && <Step2 onNext={() => go(3)} />}
        {step === 3 && <Step3 truong={truong} onNext={() => go(4)} />}
        {step === 4 && (
          <Step4
            hoTen={hoTen}
            setHoTen={setHoTen}
            xepLoai={xepLoai}
            setXepLoai={setXepLoai}
            diemToan={diemToan}
            setDiemToan={setDiemToan}
            diemVan={diemVan}
            setDiemVan={setDiemVan}
            diemAnh={diemAnh}
            setDiemAnh={setDiemAnh}
            monGioi={monGioi}
            setMonGioi={setMonGioi}
            nganh={nganh}
            setNganh={setNganh}
            submitting={submitting}
            submitError={submitError}
            onSubmit={handleFinish}
          />
        )}
      </div>
    </section>
  );
}

/* ----------------------------- STEP 1 ----------------------------- */

function Step1({
  truong,
  setTruong,
  khoiLop,
  setKhoiLop,
  onNext,
}: {
  truong: string;
  setTruong: (v: string) => void;
  khoiLop: "10" | "11" | "12" | "";
  setKhoiLop: (v: "10" | "11" | "12") => void;
  onNext: () => void;
}) {
  const [schools, setSchools] = useState<Truong[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabaseDataTruong
        .from("truong_thpt")
        .select("id, ten_truong, khu_vuc, ma_truong")
        .order("ten_truong", { ascending: true });
      if (cancelled) return;
      if (error) setErr(error.message);
      else setSchools((data ?? []) as Truong[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? schools.filter(
          (s) =>
            s.ten_truong.toLowerCase().includes(q) ||
            (s.khu_vuc ?? "").toLowerCase().includes(q),
        )
      : schools;
    return base.slice(0, 100);
  }, [query, schools]);

  const canNext = truong && khoiLop;

  return (
    <div className="card-soft p-8 sm:p-10 space-y-8">
      <Header
        step={1}
        title="Khởi đầu hành trình"
        desc="Cho chúng mình biết em đang học ở đâu và ở khối lớp nào nhé."
      />

      <div className="space-y-3">
        <div className="text-sm font-semibold text-foreground">
          Trường THPT của em là gì?
        </div>
        <div className="relative">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={truong || query}
              onChange={(e) => {
                setQuery(e.target.value);
                setTruong("");
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Tìm và chọn trường của em..."
              className="input pl-10"
            />
          </div>
          {open && (
            <div className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lg">
              {loading && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải danh sách trường...
                </div>
              )}
              {err && <div className="px-3 py-2 text-sm text-destructive">Lỗi: {err}</div>}
              {!loading && !err && filtered.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">Không có kết quả</div>
              )}
              {filtered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setTruong(s.ten_truong);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="truncate">
                    {s.ten_truong}
                    {s.khu_vuc && (
                      <span className="ml-2 text-xs text-muted-foreground">· {s.khu_vuc}</span>
                    )}
                  </span>
                  {truong === s.ten_truong && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-foreground">Em đang học lớp mấy?</div>
        <div className="grid gap-4 sm:grid-cols-3">
          {GRADES.map((g) => {
            const active = khoiLop === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setKhoiLop(g.id)}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                  active
                    ? "border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/50 hover:-translate-y-0.5"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-3xl">{g.emoji}</div>
                  {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                <div className="font-display text-lg font-bold text-foreground">{g.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{g.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <button
          disabled={!canNext}
          onClick={onNext}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
        >
          Tiếp tục <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- STEP 2 ----------------------------- */

function Step2({ onNext }: { onNext: () => void }) {
  return (
    <div className="card-soft p-8 sm:p-10 space-y-6">
      <Header
        step={2}
        title="Cấu trúc chương trình THPT"
        desc="Mỗi học sinh học 8 môn bắt buộc và chọn thêm 4 môn tự chọn phù hợp năng lực."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FrameCard
          title="8 MÔN BẮT BUỘC"
          desc="Giống nhau ở mọi tổ hợp"
          items={MON_BAT_BUOC}
          tone="from-primary/15 to-primary/5"
          badge="Cố định"
        />
        <FrameCard
          title="4 MÔN LỰA CHỌN"
          desc="Học sinh chọn 4 trong các môn sau"
          items={MON_LUA_CHON}
          tone="from-primary/10 to-primary/[0.03]"
          badge="Tự chọn"
        />
      </div>

      <div className="rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/12 to-primary/5 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl btn-holo">
            <Layers className="h-4 w-4" />
          </div>
          <div className="text-sm text-foreground">
            <div className="mb-1 font-display text-base font-bold text-foreground">
              Chuyên đề học tập
            </div>
            <p className="leading-relaxed">
              Mỗi học sinh còn học thêm{" "}
              <span className="font-semibold text-primary">3 cụm chuyên đề</span> gắn với các môn
              lựa chọn nhằm đào sâu kiến thức, phục vụ định hướng nghề nghiệp và xét tuyển đại học.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold hover:scale-[1.01]"
      >
        Xem tổ hợp của trường em <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function FrameCard({
  title,
  desc,
  items,
  tone,
  badge,
}: {
  title: string;
  desc: string;
  items: string[];
  tone: string;
  badge: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-gradient-to-br ${tone} p-5`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="font-display text-lg font-bold text-foreground">{title}</div>
        <div className="rounded-full bg-card px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
          {badge}
        </div>
      </div>
      <div className="mb-4 text-xs text-muted-foreground">{desc}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((m) => (
          <span
            key={m}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- STEP 3 (Informational) ----------------------------- */

function Step3({ truong, onNext }: { truong: string; onNext: () => void }) {
  return (
    <div className="card-soft p-8 sm:p-10 space-y-6">
      <Header
        step={3}
        title={`Tổ hợp môn của ${truong || "trường em"}`}
        desc="Các tổ hợp môn học nhà trường đang tổ chức. Xem để hiểu rõ trước khi tiếp tục."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {TO_HOP.map((t) => (
          <div
            key={t.id}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 to-primary/[0.02] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {t.id} · {t.lop} lớp
                </div>
                <div className="font-display text-lg font-bold text-foreground">{t.name}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                4 môn lựa chọn
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.mon.map((m) => (
                  <span
                    key={m}
                    className="rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                3 chuyên đề
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.chuyen_de.map((m) => (
                  <span
                    key={m}
                    className="rounded-lg border border-primary/30 bg-primary/8 px-3 py-1.5 text-sm font-semibold text-primary"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">{t.so_luoc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold hover:scale-[1.01]"
      >
        Tiếp tục <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ----------------------------- STEP 4 ----------------------------- */

function Step4({
  hoTen,
  setHoTen,
  xepLoai,
  setXepLoai,
  diemToan,
  setDiemToan,
  diemVan,
  setDiemVan,
  diemAnh,
  setDiemAnh,
  monGioi,
  setMonGioi,
  nganh,
  setNganh,
  submitting,
  submitError,
  onSubmit,
}: {
  hoTen: string;
  setHoTen: (v: string) => void;
  xepLoai: (typeof XEP_LOAI)[number] | "";
  setXepLoai: (v: (typeof XEP_LOAI)[number]) => void;
  diemToan: string;
  setDiemToan: (v: string) => void;
  diemVan: string;
  setDiemVan: (v: string) => void;
  diemAnh: string;
  setDiemAnh: (v: string) => void;
  monGioi: string[];
  setMonGioi: (v: string[]) => void;
  nganh: string;
  setNganh: (v: string) => void;
  submitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}) {
  const [nganhOpen, setNganhOpen] = useState(false);
  const [nganhQuery, setNganhQuery] = useState("");
  const [nganhList, setNganhList] = useState<NganhDaoTao[]>([]);
  const [nganhLoading, setNganhLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!nganhQuery.trim()) {
      setNganhList([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setNganhLoading(true);
      const { data } = await supabaseDataTruong
        .from("nganh_dao_tao_bgd")
        .select("id, ma_nganh, ten_nganh, level, parent_code, trinh_do")
        .eq("level", 3)
        .ilike("ten_nganh", `%${nganhQuery.trim()}%`)
        .limit(30);
      setNganhList((data ?? []) as NganhDaoTao[]);
      setNganhLoading(false);
    }, 250);
  }, [nganhQuery]);

  const toggleMon = (m: string) => {
    if (monGioi.includes(m)) {
      setMonGioi(monGioi.filter((x) => x !== m));
    } else if (monGioi.length < 3) {
      setMonGioi([...monGioi, m]);
    }
  };

  const parseScore = (v: string) => {
    const n = Number(v);
    return v !== "" && !Number.isNaN(n) && n >= 0 && n <= 10 ? n : null;
  };
  const tNum = parseScore(diemToan);
  const vNum = parseScore(diemVan);
  const aNum = parseScore(diemAnh);
  const allValid = tNum !== null && vNum !== null && aNum !== null;
  const total = allValid ? +(tNum + vNum + aNum).toFixed(2) : null;

  const canSubmit =
    hoTen.trim().length >= 2 && xepLoai && allValid && monGioi.length === 3 && !submitting;

  return (
    <div className="card-soft p-8 sm:p-10 space-y-6">
      <Header
        step={4}
        title="Thông tin chi tiết của em"
        desc="Giúp NaviCareer cá nhân hoá tư vấn tổ hợp môn và ngành học phù hợp nhất."
      />

      <Field label="Họ và tên">
        <input
          value={hoTen}
          onChange={(e) => setHoTen(e.target.value)}
          placeholder="Nguyễn Văn A"
          className="input"
        />
      </Field>

      <div>
        <div className="mb-1.5 text-sm font-medium text-foreground">Xếp loại năm học lớp 9</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {XEP_LOAI.map((x) => {
            const active = xepLoai === x;
            return (
              <button
                key={x}
                type="button"
                onClick={() => setXepLoai(x)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "border-primary btn-holo shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {x}
              </button>
            );
          })}
        </div>
      </div>

      {/* Điểm 3 môn */}
      <div>
        <div className="mb-1.5 text-sm font-medium text-foreground">
          Điểm tuyển sinh vào lớp 10
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ScoreInput label="Toán" value={diemToan} onChange={setDiemToan} />
          <ScoreInput label="Ngữ Văn" value={diemVan} onChange={setDiemVan} />
          <ScoreInput label="Tiếng Anh" value={diemAnh} onChange={setDiemAnh} />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-medium text-muted-foreground">Điểm tổng (tự động)</span>
          <span className="font-display text-lg font-bold text-primary">
            {total !== null ? total : "—"}
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ 30</span>
          </span>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Chọn 3 môn em giỏi hoặc thích nhất
          </span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
            {monGioi.length}/3
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {MON_GIOI_LIST.map((m) => {
            const active = monGioi.includes(m);
            const disabled = !active && monGioi.length >= 3;
            return (
              <button
                key={m}
                type="button"
                disabled={disabled}
                onClick={() => toggleMon(m)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "border-primary btn-holo shadow-sm"
                    : disabled
                    ? "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-60"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {active && <Check className="h-3.5 w-3.5" />}
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Ngành học dự kiến" hint="Tuỳ chọn">
        <div className="relative">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={nganh || nganhQuery}
              onChange={(e) => {
                setNganhQuery(e.target.value);
                setNganh("");
                setNganhOpen(true);
              }}
              onFocus={() => setNganhOpen(true)}
              placeholder="Gõ tên ngành để tìm kiếm (VD: công nghệ thông tin)"
              className="input pl-10"
            />
            {nganh && (
              <button
                type="button"
                onClick={() => {
                  setNganh("");
                  setNganhQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary"
              >
                Xoá
              </button>
            )}
          </div>
          {nganhOpen && nganhQuery && (
            <div className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lg">
              {nganhLoading && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tìm...
                </div>
              )}
              {!nganhLoading && nganhList.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">Không có ngành phù hợp</div>
              )}
              {nganhList.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setNganh(n.ten_nganh);
                    setNganhQuery("");
                    setNganhOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="truncate">
                    {n.ten_nganh}
                    <span className="ml-2 text-xs text-muted-foreground">· {n.ma_nganh}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Field>

      {submitError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          Không lưu được: {submitError}.
        </div>
      )}

      <button
        disabled={!canSubmit}
        onClick={onSubmit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Đang lưu thông tin...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> Hoàn tất & bắt đầu bài test Holland
          </>
        )}
      </button>
    </div>
  );
}

function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <input
        type="number"
        min={0}
        max={10}
        step={0.05}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0 - 10"
        className="input"
      />
    </label>
  );
}

/* ----------------------------- SHARED ----------------------------- */

function Header({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div>
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="grid h-4 w-4 place-items-center rounded-full btn-holo text-[10px]">
          {step}
        </span>
        Bước {step} / 4
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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
