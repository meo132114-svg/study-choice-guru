import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";
import type { HollandScores } from "./HollandTest";

interface Props {
  scores?: HollandScores | null;
  onBack?: () => void;
}

type DiemNganh = {
  ma_nganh: string;
  ten_nganh: string;
  score_r: number;
  score_i: number;
  score_a: number;
  score_s: number;
  score_e: number;
  score_c: number;
};

type TohopCuaNganh = { ma_nganh: string; cac_to_hop: string | null };
type TohopBD = {
  to_hop_mon: string;
  ma_tohop: string;
  mon1: string | null;
  mon2: string | null;
  mon3: string | null;
};

type ComboResult = {
  to_hop_mon: string;
  score_pct: number;
  mon_list: string[];
  admission_codes: string[];
  nganh_top: string[];
};

function cosine(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

const splitCodes = (s: string | null) =>
  (s || "")
    .split(/[,;\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);

export default function HollandSubjectSuggestion({ scores, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [combos, setCombos] = useState<ComboResult[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Vector user
        let userVec: number[] | null = null;
        if (scores) {
          userVec = [scores.R, scores.I, scores.A, scores.S, scores.E, scores.C];
        } else {
          const { data, error: e } = await supabasePublic
            .from("holland_results")
            .select("score_r,score_i,score_a,score_s,score_e,score_c,created_at")
            .order("created_at", { ascending: false })
            .limit(1);
          if (e) throw e;
          if (!data?.length) throw new Error("Chưa có kết quả Holland để phân tích.");
          const r = data[0] as any;
          userVec = [r.score_r, r.score_i, r.score_a, r.score_s, r.score_e, r.score_c];
        }

        // 2. Fetch song song
        const [nganhRes, tohopNganhRes, tohopBDRes] = await Promise.all([
          supabasePublic
            .from("diem_nganh")
            .select("ma_nganh,ten_nganh,score_r,score_i,score_a,score_s,score_e,score_c"),
          supabasePublic.from("tohop_cua_nganh").select("ma_nganh,cac_to_hop"),
          supabasePublic.from("tohop_BD").select("to_hop_mon,ma_tohop,mon1,mon2,mon3"),
        ]);
        if (nganhRes.error) throw nganhRes.error;
        if (tohopNganhRes.error) throw tohopNganhRes.error;
        if (tohopBDRes.error) throw tohopBDRes.error;

        const nganhList = (nganhRes.data || []) as DiemNganh[];
        const tohopNganh = (tohopNganhRes.data || []) as TohopCuaNganh[];
        const tohopBD = (tohopBDRes.data || []) as TohopBD[];

        if (!nganhList.length || !tohopBD.length) {
          throw new Error("Dữ liệu ngành hoặc tổ hợp trống.");
        }

        // 3. Similarity từng ngành
        const sims = nganhList.map((n) => ({
          ma_nganh: n.ma_nganh,
          ten_nganh: n.ten_nganh,
          sim: cosine(userVec!, [
            n.score_r,
            n.score_i,
            n.score_a,
            n.score_s,
            n.score_e,
            n.score_c,
          ]),
        }));
        sims.sort((a, b) => b.sim - a.sim);
        const top3Nganh = sims.slice(0, 3);
        const top3Codes = new Set(top3Nganh.map((n) => n.ma_nganh));

        // Map ma_nganh -> admission codes
        const nganhCodes = new Map<string, string[]>();
        for (const row of tohopNganh) {
          const arr = nganhCodes.get(row.ma_nganh) || [];
          arr.push(...splitCodes(row.cac_to_hop));
          nganhCodes.set(row.ma_nganh, arr);
        }

        // Map to_hop_mon -> {admission codes set, mon list}
        const comboMap = new Map<
          string,
          { codes: Set<string>; mons: Set<string> }
        >();
        for (const row of tohopBD) {
          const c = comboMap.get(row.to_hop_mon) || {
            codes: new Set<string>(),
            mons: new Set<string>(),
          };
          c.codes.add(row.ma_tohop);
          [row.mon1, row.mon2, row.mon3].forEach((m) => m && c.mons.add(m));
          comboMap.set(row.to_hop_mon, c);
        }

        // 4. Điểm tổ hợp = tổng sim của các ngành (trong sims) mà admission code
        // giao với combo. Ưu tiên top-N ngành để trọng số có ý nghĩa.
        const TOP_N = Math.min(30, sims.length);
        const topNganhForScoring = sims.slice(0, TOP_N);

        const comboScored: ComboResult[] = [];
        for (const [to_hop_mon, info] of comboMap) {
          const nganhHits: { ten: string; sim: number; isTop3: boolean }[] = [];
          for (const n of topNganhForScoring) {
            const codes = nganhCodes.get(n.ma_nganh) || [];
            if (codes.some((c) => info.codes.has(c))) {
              nganhHits.push({
                ten: n.ten_nganh,
                sim: Math.max(0, n.sim),
                isTop3: top3Codes.has(n.ma_nganh),
              });
            }
          }
          // Trung bình cộng chỉ số Cosine của các ngành phù hợp nhất
          // mà tổ hợp đó tham gia xét tuyển, chuẩn hoá về thang 100.
          const sortedSims = [...nganhHits].sort((a, b) => b.sim - a.sim);
          const K = Math.min(5, sortedSims.length);
          const avg =
            K > 0 ? sortedSims.slice(0, K).reduce((s, x) => s + x.sim, 0) / K : 0;
          comboScored.push({
            to_hop_mon,
            score_pct: Math.round(Math.min(1, Math.max(0, avg)) * 100),
            mon_list: Array.from(info.mons),
            admission_codes: Array.from(info.codes).sort(),
            nganh_top: nganhHits
              .sort((a, b) => Number(b.isTop3) - Number(a.isTop3) || b.sim - a.sim)
              .slice(0, 3)
              .map((n) => n.ten),
          });
        }

        comboScored.sort((a, b) => b.score_pct - a.score_pct);
        const normalized = comboScored.slice(0, 4);

        if (!cancelled) setCombos(normalized);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Không tải được dữ liệu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scores]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-hero py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-6 animate-fade-in-up">
        <button
          onClick={() => (onBack ? onBack() : window.history.back())}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>

        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Gợi ý <span className="text-holo">tổ hợp môn</span> phù hợp
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dựa trên vector Holland của em và ma trận điểm ngành đào tạo.
        </p>

        {loading && <LoadingState />}

        {error && !loading && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-semibold">Không tải được gợi ý</div>
              <div className="mt-1 text-destructive/80">{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && combos.length === 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Chưa có tổ hợp phù hợp để gợi ý.
          </div>
        )}

        {!loading && !error && combos.length > 0 && (
          <div className="mt-6 space-y-4">
            {combos.map((c) => (
              <ComboCard key={c.to_hop_mon} data={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tính toán độ phù hợp…
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-20 rounded bg-muted" />
            <div className="h-6 w-16 rounded bg-muted" />
          </div>
          <div className="mb-4 h-2 w-full rounded-full bg-muted" />
          <div className="mb-3 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-muted" />
            <div className="h-6 w-20 rounded-full bg-muted" />
            <div className="h-6 w-14 rounded-full bg-muted" />
          </div>
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function ComboCard({ data }: { data: ComboResult }) {
  return (
    <div className="rounded-3xl border-2 border-primary/25 bg-card p-6 shadow-sm transition hover:border-primary/50">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-foreground">
            {data.to_hop_mon}
          </h2>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Xét ĐH:{" "}
            <span className="text-foreground">
              {data.admission_codes.slice(0, 8).join(" · ")}
              {data.admission_codes.length > 8 ? " …" : ""}
            </span>
          </p>
        </div>
        <span className="font-display text-3xl font-bold text-primary">
          {data.score_pct}%
        </span>
      </div>

      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${data.score_pct}%`,
            background: "var(--gradient-primary)",
          }}
        />
      </div>

      {data.mon_list.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Môn học trong tổ hợp
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.mon_list.map((m) => (
              <span
                key={m}
                className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.nganh_top.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Nhóm ngành gợi ý
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.nganh_top.map((n) => (
              <span
                key={n}
                className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
