"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, Sparkles, Zap, Layers } from "lucide-react";

const CARDS = [
  {
    title: "AI Companion",
    description: "Your buddy assistant that learns your preferences over time.",
    color: "bg-zinc-900 border-zinc-800",
    icon: <Bot className="w-12 h-12 text-purple-400 mb-6" />
  },
  {
    title: "Lightning Fast",
    description: "Built on Next.js and optimized for blazing fast 60fps performance.",
    color: "bg-zinc-800 border-zinc-700",
    icon: <Zap className="w-12 h-12 text-fuchsia-400 mb-6" />
  },
  {
    title: "Immersive Motion",
    description: "Scroll-driven storytelling powered by GSAP and ScrollTrigger.",
    color: "bg-zinc-900 border-zinc-800",
    icon: <Sparkles className="w-12 h-12 text-violet-400 mb-6" />
  },
  {
    title: "Layered Design",
    description: "Sleek, modern UI with depth, soft shadows, and glassmorphism.",
    color: "bg-zinc-950 border-zinc-800",
    icon: <Layers className="w-12 h-12 text-purple-300 mb-6" />
  }
];

export function ScrollStory() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".story-card");
      
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
        animation: gsap.timeline()
          .to(cards[0], { scale: 0.95, y: -40, ease: "none" }, 0)
          .fromTo(cards[1], { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, ease: "none" }, 0)
          
          .to(cards[1], { scale: 0.95, y: -40, ease: "none" }, 1)
          .to(cards[0], { scale: 0.90, y: -80, ease: "none" }, 1)
          .fromTo(cards[2], { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, ease: "none" }, 1)
          
          .to(cards[2], { scale: 0.95, y: -40, ease: "none" }, 2)
          .to(cards[1], { scale: 0.90, y: -80, ease: "none" }, 2)
          .to(cards[0], { scale: 0.85, y: -120, ease: "none" }, 2)
          .fromTo(cards[3], { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, ease: "none" }, 2)
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-screen w-full flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-purple-500/10 rounded-full blur-[100px]" />
      
      <div className="relative w-full max-w-2xl px-4 aspect-[4/3] flex items-center justify-center">
        {CARDS.map((card, i) => (
          <div 
            key={i} 
            className={`story-card absolute inset-0 flex flex-col justify-center items-center p-12 rounded-[2rem] border ${card.color} shadow-2xl`}
            style={{ zIndex: i }}
          >
            {card.icon}
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-center">{card.title}</h2>
            <p className="text-lg text-zinc-400 text-center max-w-md">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
