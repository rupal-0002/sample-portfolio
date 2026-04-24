import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { ScrollStory } from "@/components/ScrollStory";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { Outro } from "@/components/Outro";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950 overflow-x-hidden selection:bg-purple-500/30">
        <Hero />
        <ScrollStory />
        <HorizontalScroll />
        <Outro />
      </main>
    </SmoothScroll>
  );
}
