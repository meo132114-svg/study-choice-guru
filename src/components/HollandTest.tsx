import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

interface Props {
  onBack: () => void;
  onComplete: (scores: Record<HollandType, number>) => void;
}

export type HollandType = "R" | "I" | "A" | "S" | "E" | "C";

const TYPE_LABELS: Record<HollandType, { name: string; desc: string }> = {
  R: { name: "Realistic", desc: "Kỹ thuật - Thực tế" },
  I: { name: "Investigative", desc: "Nghiên cứu - Phân tích" },
  A: { name: "Artistic", desc: "Nghệ thuật - Sáng tạo" },
  S: { name: "Social", desc: "Xã hội - Hỗ trợ" },
  E: { name: "Enterprising", desc: "Quản lý - Khởi nghiệp" },
  C: { name: "Conventional", desc: "Nghiệp vụ - Tổ chức" },
};

// 42 câu hỏi (7 câu / nhóm) — trắc nghiệm Holland Code rút gọn
const QUESTIONS: { text: string; type: HollandType }[] = [
  { text: "Tôi thích tự tay lắp ráp hoặc sửa chữa đồ vật (xe đạp, đồ điện, máy móc).", type: "R" },
  { text: "Tôi thấy thoải mái khi làm việc ngoài trời hoặc trong xưởng thực hành.", type: "R" },
  { text: "Tôi thích các môn thể thao hoặc hoạt động vận động thể chất.", type: "R" },
  { text: "Tôi thích sử dụng công cụ, thiết bị kỹ thuật hơn là ngồi bàn giấy.", type: "R" },
  { text: "Tôi thích quan sát cách máy móc vận hành.", type: "R" },
  { text: "Tôi thích trồng cây, chăm sóc vật nuôi hoặc làm việc với thiên nhiên.", type: "R" },
  { text: "Tôi muốn học một nghề thủ công hoặc kỹ thuật cụ thể.", type: "R" },

  { text: "Tôi thích giải các bài toán logic, câu đố khó.", type: "I" },
  { text: "Tôi tò mò muốn biết vì sao mọi thứ xảy ra như vậy.", type: "I" },
  { text: "Tôi thích đọc sách khoa học, tài liệu nghiên cứu.", type: "I" },
  { text: "Tôi thích làm thí nghiệm và kiểm tra giả thuyết.", type: "I" },
  { text: "Tôi thích phân tích số liệu để tìm quy luật.", type: "I" },
  { text: "Tôi thấy hứng thú với Toán, Vật lý, Hóa học hoặc Sinh học.", type: "I" },
  { text: "Tôi thích tự nghiên cứu độc lập một chủ đề mình quan tâm.", type: "I" },

  { text: "Tôi thích vẽ, thiết kế hoặc chụp ảnh.", type: "A" },
  { text: "Tôi thích viết truyện, làm thơ hoặc viết nhật ký sáng tạo.", type: "A" },
  { text: "Tôi thích chơi nhạc cụ, hát hoặc sáng tác nhạc.", type: "A" },
  { text: "Tôi hay có ý tưởng độc đáo và muốn thể hiện chúng.", type: "A" },
  { text: "Tôi thích diễn xuất, làm phim ngắn hoặc dựng video.", type: "A" },
  { text: "Tôi thích trang trí, phối màu, sắp đặt không gian.", type: "A" },
  { text: "Tôi cảm thấy tự do khi được thể hiện cá tính riêng.", type: "A" },

  { text: "Tôi thích giúp đỡ bạn bè khi họ gặp khó khăn.", type: "S" },
  { text: "Tôi thích giảng bài hoặc hướng dẫn người khác.", type: "S" },
  { text: "Tôi có thể lắng nghe và đồng cảm với người khác.", type: "S" },
  { text: "Tôi thích tham gia hoạt động tình nguyện, thiện nguyện.", type: "S" },
  { text: "Tôi cảm thấy hạnh phúc khi làm việc theo nhóm.", type: "S" },
  { text: "Tôi thích trò chuyện, kết nối với nhiều người khác nhau.", type: "S" },
  { text: "Tôi quan tâm đến các vấn đề xã hội, cộng đồng.", type: "S" },

  { text: "Tôi thích thuyết phục người khác theo ý tưởng của mình.", type: "E" },
  { text: "Tôi thích làm nhóm trưởng, dẫn dắt đội nhóm.", type: "E" },
  { text: "Tôi muốn tự khởi nghiệp hoặc kinh doanh riêng.", type: "E" },
  { text: "Tôi tự tin khi nói trước đám đông.", type: "E" },
  { text: "Tôi thích cạnh tranh và không sợ rủi ro.", type: "E" },
  { text: "Tôi thích lên kế hoạch và ra quyết định quan trọng.", type: "E" },
  { text: "Tôi quan tâm đến kinh doanh, đầu tư, marketing.", type: "E" },

  { text: "Tôi thích làm việc có kế hoạch, quy trình rõ ràng.", type: "C" },
  { text: "Tôi cẩn thận với con số, chi tiết và độ chính xác.", type: "C" },
  { text: "Tôi thích sắp xếp tài liệu, dữ liệu ngăn nắp.", type: "C" },
  { text: "Tôi làm tốt các công việc lặp lại đòi hỏi tỉ mỉ.", type: "C" },
  { text: "Tôi thích sử dụng phần mềm văn phòng (Excel, Word).", type: "C" },
  { text: "Tôi tuân thủ quy định, kỷ luật và đúng deadline.", type: "C" },
  { text: "Tôi thích quản lý tài chính, ghi chép sổ sách.", type: "C" },
];

const OPTIONS = [
  { value: 1, label: "Rất không" },
  { value: 2, label: "Không" },
  { value: 3, label: "Bình thường" },
  { value: 4, label: "Đồng ý" },
  { value: 5, label: "Rất đồng ý" },
];

const BATCH = 7;

export function HollandTest({ onBack, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(QUESTIONS.length / BATCH);
  const start = page * BATCH;
  const current = QUESTIONS.slice(start, start + BATCH);
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);
  const pageComplete = current.every((_, i) => answers[start + i] !== undefined);
  const isLast = page === totalPages - 1;

  const scores = useMemo(() => {
    const s: Record<HollandType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    QUESTIONS.forEach((q, i) => {
      const v = answers[i];
      if (v) s[q.type] += v;
    });
    return s;
  }, [answers]);

  const handleFinish = () => {
    onComplete(scores);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-hero py-14">
      <div className="mx-auto max-w-2xl px-6 animate-fade-in-up">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>

        <div className="card-soft p-8 sm:p-10">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-primary">
                Trắc nghiệm Holland Code
              </div>
              <div className="text-lg font-bold text-foreground">
                Phần {page + 1} / {totalPages}
              </div>
            </div>
            <div className="text-sm font-semibold text-primary">{progress}%</div>
          </div>

          <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            Đọc từng phát biểu và chọn mức độ đúng với bạn. Không có đáp án sai — hãy chọn theo cảm nhận thật.
          </p>

          <div className="space-y-5">
            {current.map((q, i) => {
              const idx = start + i;
              const val = answers[idx];
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card/60 p-4"
                >
                  <div className="mb-3 flex gap-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {q.text}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {OPTIONS.map((opt) => {
                      const active = val === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [idx]: opt.value }))
                          }
                          className={`flex-1 min-w-[92px] rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                            active
                              ? "border-primary btn-holo shadow-sm"
                              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                          }`}
                        >
                          <div className="text-base font-bold">{opt.value}</div>
                          <div className="mt-0.5 text-[10px] leading-tight">{opt.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => (page === 0 ? onBack() : setPage(page - 1))}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50"
            >
              <ArrowLeft className="h-4 w-4" /> {page === 0 ? "Quay lại" : "Trước"}
            </button>
            {!isLast ? (
              <button
                disabled={!pageComplete}
                onClick={() => setPage(page + 1)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                Tiếp theo <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                disabled={!pageComplete}
                onClick={handleFinish}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full btn-holo px-6 py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                <Sparkles className="h-4 w-4" /> Xem kết quả
              </button>
            )}
          </div>
        </div>

        {/* Kết quả preview thầm lặng — chỉ hiện khi hoàn tất */}
        {answered === QUESTIONS.length && (
          <div className="mt-6 card-soft p-6 animate-fade-in-up">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Check className="h-4 w-4" /> Đã hoàn tất — điểm sơ bộ
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(Object.keys(TYPE_LABELS) as HollandType[]).map((t) => (
                <div key={t} className="rounded-xl border border-border bg-card p-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    {TYPE_LABELS[t].desc}
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {t} · {scores[t]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
