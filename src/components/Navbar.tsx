import { Sparkles } from "lucide-react";

export function Navbar() {
  const links = [
    { href: "#tinh-nang", label: "Tính năng" },
    { href: "#danh-gia", label: "Đánh giá" },
    { href: "#huong-dan", label: "Hướng dẫn" },
    { href: "#lien-he", label: "Liên hệ" },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl btn-holo">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Edu<span className="text-primary">Path</span>
          </span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#form"
          className="rounded-full btn-holo px-5 py-2 text-sm font-semibold hover:scale-[1.03]"
        >
          Đăng nhập
        </a>
      </nav>
    </header>
  );
}
