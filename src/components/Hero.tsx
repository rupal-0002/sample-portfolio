"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const blobRef1 = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!textRef.current) return;
    // Simple custom split text effect
    const chars = textRef.current.innerText.split("");
    textRef.current.innerHTML = "";
    chars.forEach((c) => {
      const span = document.createElement("span");
      span.innerText = c === " " ? "\u00A0" : c;
      span.className = "char inline-block opacity-0 transform-gpu";
      textRef.current?.appendChild(span);
    });

    const ctx = gsap.context(() => {
      // Rapid bullet fire aerodynamic animation with bounce and scale up
      const tl = gsap.timeline();
      tl.fromTo(".char", 
        {
          opacity: 0,
          x: 150,
          scaleX: 3,
          skewX: -40,
          filter: "blur(8px)"
        },
        {
          x: 0,
          scaleX: 1,
          skewX: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.015,
          duration: 0.5,
          ease: "back.out(2)",
          delay: 0.2
        }
      ).to(textRef.current, {
        scale: 1.05,
        duration: 4,
        ease: "power2.out"
      }, "-=0.2");

      // Scroll parallax for blobs
      gsap.to(blobRef1.current, {
        y: 200,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(blobRef2.current, {
        y: -150,
        scale: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      
      // Fade out hero content on scroll
      gsap.to(".hero-content", {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

    }, container);

    // Galaxy Canvas
    const canvas = canvasRef.current;
    let animationId: number;
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        handleResize();
        const stars = Array.from({length: 400}, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.5,
          a: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.005
        }));

        const comets: {x: number, y: number, length: number, speed: number, opacity: number}[] = [];

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Twinkling stars
          stars.forEach(s => {
            s.a += s.speed;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            const opacity = Math.pow(Math.abs(Math.sin(s.a)), 4);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
          });

          // Comets (shooting stars)
          if (Math.random() < 0.02 && comets.length < 2) {
            comets.push({
              x: Math.random() * canvas.width * 1.5,
              y: -100,
              length: Math.random() * 150 + 100,
              speed: Math.random() * 15 + 15,
              opacity: 1
            });
          }

          for (let i = comets.length - 1; i >= 0; i--) {
            const c = comets[i];
            c.x -= c.speed;
            c.y += c.speed;
            
            if (c.x < -c.length || c.y > canvas.height + c.length) {
              comets.splice(i, 1);
              continue;
            }

            const gradient = ctx.createLinearGradient(c.x, c.y, c.x + c.length, c.y - c.length);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${c.opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(c.x + c.length, c.y - c.length);
            ctx.lineWidth = 2;
            ctx.strokeStyle = gradient;
            ctx.stroke();
          }

          animationId = requestAnimationFrame(render);
        };
        render();
        window.addEventListener("resize", handleResize);
      }
    }

    return () => {
      ctx.revert();
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section ref={container} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#030008] text-white">
      
      {/* Galaxy Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

      {/* Milky Way Bands */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[30vh] bg-gradient-to-r from-transparent via-purple-900/30 to-transparent rotate-[-30deg] blur-[80px] z-0 pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[10vh] bg-gradient-to-r from-transparent via-fuchsia-600/20 to-transparent rotate-[-30deg] blur-[60px] z-0 pointer-events-none mix-blend-screen" />

      {/* Parallax Blobs */}
      <div ref={blobRef1} className="absolute top-0 left-10 w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[100px] z-0 pointer-events-none" />
      <div ref={blobRef2} className="absolute bottom-0 right-10 w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/20 blur-[120px] z-0 pointer-events-none" />

      <div className="hero-content relative z-10 flex flex-col items-center px-4">
        <h1 ref={textRef} className={`${playfair.className} text-[6vw] md:text-[5vw] font-bold tracking-tighter text-center whitespace-nowrap leading-tight`}>
          You didn&apos;t land here by accident
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-lg text-center opacity-0 animate-[fadeIn_1s_ease_1.5s_forwards]">
          There&apos;s a reason you clicked. Scroll down to see what you&apos;re looking for.
        </p>
      </div>
    </section>
  );
}
