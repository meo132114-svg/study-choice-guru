import { ArrowRight, Users, Building2, ThumbsUp, Star } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

const metrics = [
  { icon: Users, big: "100+", small: "Trường đại học tin dùng" },
  { icon: Building2, big: "5000+", small: "Cơ sở dữ liệu điểm chuẩn" },
  { icon: ThumbsUp, big: "95%", small: "Mức độ hài lòng sau tư vấn" },
];

const reviews = [
  {
    name: "Nguyễn Minh Anh",
    meta: "Lớp 12A1 · THPT Chuyên Hà Nội – Amsterdam",
    text: "Trắc nghiệm ngắn nhưng gợi ý tổ hợp cực kỳ chính xác. Em đã tự tin chọn khối A00 nhờ kết quả từ EduPath.",
  },
  {
    name: "Trần Gia Bảo",
    meta: "Lớp 11B · THPT Lê Hồng Phong (TP.HCM)",
    text: "Giao diện đẹp, dễ dùng, phân tích chi tiết từng nhóm nghề. Bố mẹ em cũng đồng ý với hướng đi mới.",
  },
  {
    name: "Lê Thảo Vy",
    meta: "Lớp 12C · THPT Phan Châu Trinh (Đà Nẵng)",
    text: "Em đang phân vân giữa D01 và A01, EduPath đã giúp em quyết định trong 15 phút. Rất đáng thử!",
  },
];

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center animate-fade-in-up">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Nền tảng định hướng nghề nghiệp #1 dành cho học sinh THPT
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          ĐỊNH HƯỚNG TƯƠNG LAI
          <br />
          <span className="text-holo">CHỌN ĐÚNG TỔ HỢP</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Phân tích cá nhân hóa bằng AI dựa trên trắc nghiệm sở thích nghề nghiệp Holland Code,
          năng lực học tập và mong muốn của bạn. Gợi ý tổ hợp chính xác chỉ trong 15 phút.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-full btn-holo px-8 py-4 text-base font-semibold hover:scale-[1.03]"
          >
            Bắt đầu ngay
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href="#danh-gia"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-base font-semibold text-foreground hover:border-primary/60 hover:text-primary"
          >
            Xem đánh giá
          </a>
        </div>

        {/* Metrics */}
        <div id="tinh-nang" className="mt-16 grid gap-5 sm:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.small} className="card-soft p-6 text-left transition-transform hover:-translate-y-1">
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                <m.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-3xl font-bold text-foreground">{m.big}</div>
              <div className="mt-1 text-sm text-muted-foreground">{m.small}</div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div id="danh-gia" className="mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Học sinh nói gì về <span className="text-primary">EduPath</span>?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Những chia sẻ thật từ học sinh đã sử dụng nền tảng.</p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="card-soft p-6 text-left">
                <div className="mb-3 flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">"{r.text}"</p>
                <div className="mt-5 border-t border-border pt-4">
                  <div className="text-sm font-semibold text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
