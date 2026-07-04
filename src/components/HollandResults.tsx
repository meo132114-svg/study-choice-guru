import { ArrowLeft, Sparkles } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { HollandCode, HollandScores } from "./HollandTest";

interface Props {
  scores: HollandScores;
  name?: string;
  onHome: () => void;
}

const CODE_META: Record<
  HollandCode,
  { title: string; short: string; desc: string; strengths: string[]; careers: string[] }
> = {
  R: {
    title: "Realistic – Kỹ thuật",
    short: "Người thực tế",
    desc: "Em thích làm việc với công cụ, máy móc, vật thể cụ thể và các công việc mang tính ứng dụng, kỹ thuật. Em học tốt qua hành động và thí nghiệm.",
    strengths: ["Tư duy thực tế", "Khéo léo tay chân", "Kiên trì", "Giải quyết vấn đề cụ thể"],
    careers: ["Kỹ sư", "Cơ khí – Điện – Điện tử", "Xây dựng", "Nông nghiệp công nghệ cao"],
  },
  I: {
    title: "Investigative – Nghiên cứu",
    short: "Người nghiên cứu",
    desc: "Em thích quan sát, phân tích, tìm hiểu bản chất của sự vật hiện tượng. Em học tốt qua tư duy logic và giải quyết bài toán trí óc.",
    strengths: ["Tư duy logic", "Tò mò khoa học", "Phân tích dữ liệu", "Suy luận độc lập"],
    careers: ["Nghiên cứu khoa học", "Y – Dược", "Công nghệ thông tin", "Toán – Vật lý ứng dụng"],
  },
  A: {
    title: "Artistic – Nghệ thuật",
    short: "Người sáng tạo",
    desc: "Em có óc thẩm mỹ và trí tưởng tượng phong phú, thích tự do thể hiện bản thân qua nghệ thuật, hình ảnh, âm nhạc, ngôn từ.",
    strengths: ["Sáng tạo", "Trực giác thẩm mỹ", "Biểu đạt cá nhân", "Nhạy cảm cảm xúc"],
    careers: ["Thiết kế đồ hoạ", "Kiến trúc", "Truyền thông – Marketing", "Sáng tác – Điện ảnh"],
  },
  S: {
    title: "Social – Xã hội",
    short: "Người kết nối",
    desc: "Em quan tâm và thích giúp đỡ người khác, dễ đồng cảm, làm việc nhóm tốt, phù hợp các nghề chăm sóc, giáo dục, cộng đồng.",
    strengths: ["Giao tiếp tốt", "Đồng cảm", "Làm việc nhóm", "Truyền cảm hứng"],
    careers: ["Giáo viên", "Tâm lý học", "Công tác xã hội", "Điều dưỡng – Chăm sóc sức khoẻ"],
  },
  E: {
    title: "Enterprising – Quản lý",
    short: "Người dẫn dắt",
    desc: "Em năng động, tự tin, thích thuyết phục và lãnh đạo. Em phù hợp với các công việc kinh doanh, tổ chức, tạo tầm ảnh hưởng.",
    strengths: ["Lãnh đạo", "Thuyết phục", "Ra quyết định", "Chịu áp lực"],
    careers: ["Kinh doanh – Bán hàng", "Marketing", "Quản trị", "Luật – Tài chính"],
  },
  C: {
    title: "Conventional – Nghiệp vụ",
    short: "Người tổ chức",
    desc: "Em thích sự chính xác, ngăn nắp, có kỷ luật cao và làm việc hiệu quả với số liệu, quy trình, hồ sơ.",
    strengths: ["Cẩn thận", "Chính xác", "Tổ chức tốt", "Tuân thủ quy trình"],
    careers: ["Kế toán – Kiểm toán", "Ngân hàng", "Hành chính – Nhân sự", "Logistics – Vận hành"],
  },
};

const ORDER: HollandCode[] = ["R", "I", "A", "S", "E", "C"];

export function HollandResults({ scores, name, onHome }: Props) {
  const ranked = ORDER
    .map((c) => ({ code: c, score: scores[c] }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0].code;
  const meta = CODE_META[top];

  const chartData = ORDER.map((c) => ({
    code: `${c} (${scores[c]})`,
    label: c,
    score: scores[c],
  }));

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-hero py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-6 animate-fade-in-up space-y-6">
        <button
          onClick={onHome}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Về trang chủ
        </button>

        <div className="card-soft p-8 sm:p-10">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Kết quả Holland Code
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {name ? `${name}, ` : ""}nhóm nổi bật của em là{" "}
              <span className="text-holo">{meta.short}</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Xu hướng nghề nghiệp mạnh nhất:{" "}
              <span className="font-semibold text-foreground">{meta.title}</span>
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Radar */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Biểu đồ 6 mã Holland
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData} outerRadius="75%">
                    <PolarGrid stroke="oklch(0.53 0.24 300 / 0.2)" />
                    <PolarAngleAxis
                      dataKey="code"
                      tick={{
                        fill: "var(--foreground)",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 50]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                      tickCount={6}
                    />
                    <Radar
                      dataKey="score"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ranking */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Thứ tự từ cao đến thấp
              </div>
              {ranked.map((r, i) => {
                const m = CODE_META[r.code];
                const isTop = i === 0;
                const pct = (r.score / 50) * 100;
                return (
                  <div
                    key={r.code}
                    className={`rounded-xl border p-3 ${
                      isTop
                        ? "border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5 shadow-sm"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                            isTop ? "btn-holo" : "bg-muted text-foreground"
                          }`}
                        >
                          {r.code}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{m.short}</span>
                      </div>
                      <span className="font-display text-lg font-bold text-primary">
                        {r.score}
                        <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                          /50
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: isTop
                            ? "var(--gradient-primary)"
                            : "oklch(0.53 0.24 300 / 0.4)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="card-soft p-8 sm:p-10 border-2 border-primary/25 bg-gradient-to-br from-primary/8 to-transparent">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full btn-holo px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            Phân tích nhóm {top} · {meta.short}
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">{meta.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{meta.desc}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                Điểm mạnh nổi bật
              </div>
              <div className="flex flex-wrap gap-1.5">
                {meta.strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                Xu hướng nghề nghiệp phù hợp
              </div>
              <ul className="space-y-1.5 text-sm text-foreground">
                {meta.careers.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/60 hover:text-primary"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </section>
  );
}
