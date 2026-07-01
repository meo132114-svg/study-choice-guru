import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OnboardingForm } from "@/components/OnboardingForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduPath — Định hướng tổ hợp môn THPT bằng AI" },
      { name: "description", content: "Trắc nghiệm Holland Code + AI gợi ý tổ hợp môn phù hợp trong 15 phút cho học sinh THPT." },
      { property: "og:title", content: "EduPath — Định hướng tổ hợp môn THPT" },
      { property: "og:description", content: "Phân tích cá nhân hoá bằng AI dựa trên Holland Code và năng lực học tập." },
    ],
  }),
  component: Index,
});

function Index() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        {!started ? (
          <Hero onStart={() => setStarted(true)} />
        ) : (
          <OnboardingForm onBack={() => setStarted(false)} />
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
