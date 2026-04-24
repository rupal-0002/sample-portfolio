"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Outro() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, 
        { scale: 0.8, opacity: 0, y: 100 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            end: "center center",
            scrub: true
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white">
      <div ref={textRef} className="text-center px-4">
        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8">Ready to Build?</h2>
        <a 
          href="/portfolio/index.html" 
          className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full text-lg hover:scale-105 transition-transform duration-300"
        >
          Enter Portfolio
        </a>
      </div>
    </section>
  );
}
