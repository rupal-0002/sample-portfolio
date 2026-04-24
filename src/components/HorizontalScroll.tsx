"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const ITEMS = [
  { id: 1, image: "/images/neon_purple_1.png", title: "Stay Focused" },
  { id: 2, image: "/images/neon_purple_2.png", title: "Keep Pushing" },
  { id: 3, image: "/images/neon_purple_3.png", title: "Embrace Failure" },
  { id: 4, image: "/images/neon_purple_4.png", title: "Defy Limits" },
  { id: 5, image: "/images/neon_purple_5.png", title: "Never Settle" },
];

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!scrollRef.current || !sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const scrollWidth = scrollRef.current!.scrollWidth;
      const amountToScroll = scrollWidth - window.innerWidth;

      gsap.to(scrollRef.current, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${amountToScroll}`,
          pin: true,
          scrub: 1, // Add slight delay for smooth feel
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen w-full bg-zinc-950 flex items-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
      
      <div ref={scrollRef} className="flex gap-8 px-10 md:px-32 h-[60vh] items-center will-change-transform">
        <div className="w-[30vw] shrink-0 text-white pl-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">Find Your<br/>Drive</h2>
          <p className="text-zinc-400 text-lg">Swipe horizontally to spark your motivation. Stay disciplined and keep building the future.</p>
        </div>
        
        {ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="w-[70vw] md:w-[35vw] h-full shrink-0 rounded-3xl p-8 flex flex-col justify-end shadow-2xl relative overflow-hidden group border border-purple-900/50"
          >
            <Image src={item.image} alt={item.title} fill className="object-cover absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-80" />
            <h3 className="text-4xl font-bold text-white relative z-20">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
