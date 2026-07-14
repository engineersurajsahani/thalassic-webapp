"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import { Clock, Award, Star, Shield, Users, Globe, Building, ArrowRight, Check, Compass, Eye, Activity, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// --- SCROLL REVEAL COMPONENT WITH SPRING BOUNCE PHYSICS ---
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.05, 
        rootMargin: "0px 0px -40px 0px" 
      }
    );

    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform will-change-transform ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-16 scale-[0.97]"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      {children}
    </div>
  );
}

// --- FEATURED COURSES WITH UNIFORM PREMIUM DESIGN ---
const FEATURED_COURSES = [
  {
    id: "bst",
    code: "BST",
    name: "Basic Safety Training",
    description: "Personal Survival Techniques (PST), Elementary First Aid (EFA), and Fire Prevention & Fire Fighting (FPFF) conforming DGS regulations.",
    duration: "12 Days",
    level: "Entry Level",
    fees: "₹15,000",
    rating: 4.8,
    ratingCount: 342,
    icon: ShieldCheck,
    color: "from-blue-500 to-sky-400",
    bgClassDark: "bg-[#0a1122]/70 border-slate-800 hover:border-blue-500/20",
    bgClassLight: "bg-white border-slate-200/80 hover:border-blue-500/30 hover:shadow-md",
    tag: "Flagship Program",
    badgeColorDark: "bg-blue-950/40 text-blue-300 border-blue-500/10",
    badgeColorLight: "bg-blue-50 text-blue-700 border-blue-200/50",
    stcw: "STCW Reg VI/1"
  },
  {
    id: "stsdsd",
    code: "STSDSD",
    name: "Designated Security Duties",
    description: "Comprehensive instruction on shipboard security threats, piracy mitigation, search procedures, and security plan execution.",
    duration: "2 Days",
    level: "Entry Level",
    fees: "₹12,000",
    rating: 4.9,
    ratingCount: 188,
    icon: Shield,
    color: "from-indigo-500 to-blue-500",
    bgClassDark: "bg-[#090f1e]/70 border-slate-800 hover:border-blue-500/20",
    bgClassLight: "bg-white border-slate-200/80 hover:border-blue-500/30 hover:shadow-md",
    tag: "High Demand",
    badgeColorDark: "bg-blue-950/40 text-blue-200 border-blue-500/10",
    badgeColorLight: "bg-blue-50 text-blue-700 border-blue-200/50",
    stcw: "STCW Reg VI/6"
  },
  {
    id: "octco",
    code: "OCTCO",
    name: "Oil & Chemical Cargo Operations",
    description: "Specialized training covering tanker designs, cargo properties, safety hazards, emergency response, and marine pollution prevention.",
    duration: "6 Days",
    level: "Advanced Level",
    fees: "₹18,000",
    rating: 4.7,
    ratingCount: 124,
    icon: Globe,
    color: "from-sky-500 to-blue-600",
    bgClassDark: "bg-[#0a1122]/70 border-slate-800 hover:border-blue-500/20",
    bgClassLight: "bg-white border-slate-200/80 hover:border-blue-500/30 hover:shadow-md",
    tag: "Specialized",
    badgeColorDark: "bg-blue-950/40 text-blue-250 border-blue-500/10",
    badgeColorLight: "bg-blue-50 text-blue-700 border-blue-200/50",
    stcw: "STCW Reg V/1-1"
  },
];

const SHIELD_PARTNERS = [
  { name: "Maersk Line", routes: "Europe - Asia Routes", lat: "55° 40' N" },
  { name: "MSC Shipping", routes: "Global Transatlantic", lat: "46° 12' N" },
  { name: "Hapag-Lloyd", routes: "Pacific Gateway Lanes", lat: "53° 33' N" },
  { name: "NYK Line", routes: "Far East Express V", lat: "35° 40' N" },
  { name: "Thome Group", routes: "Indo-Pacific Transit", lat: "01° 21' N" },
  { name: "Synergy Marine", routes: "Arabian Sea Route IV", lat: "13° 04' N" },
];

// --- WORLD-CLASS CINEMATIC HERO ---
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);

  const totalFrames = 121;

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    const frameData = { frame: 1 };

    const render = (index: number) => {
      const img = images[index];
      if (!img) return;
      if (img.complete) {
        // Handle canvas sizing and aspect ratio to cover like object-fit: cover
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let renderWidth, renderHeight, xOffset, yOffset;

        if (canvasAspect > imgAspect) {
          renderWidth = canvas.width;
          renderHeight = canvas.width / imgAspect;
          xOffset = 0;
          yOffset = (canvas.height - renderHeight) / 2;
        } else {
          renderHeight = canvas.height;
          renderWidth = canvas.height * imgAspect;
          yOffset = 0;
          xOffset = (canvas.width - renderWidth) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.9; // Base opacity
        ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
      } else {
        // Fallback: draw when loaded if the user is still on this frame
        img.onload = () => {
          const currentFrameIndex = Math.round(frameData.frame) - 1;
          if (currentFrameIndex === index) {
            render(index);
          }
        };
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(Math.round(frameData.frame) - 1);
    };

    // Load images
    let loadedCount = 0;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameStr = String(i).padStart(3, "0");
      img.src = `/hero-images/ezgif-frame-${frameStr}.jpg`;
      img.onload = () => {
        loadedCount++;
        const currentFrameIndex = Math.round(frameData.frame) - 1;
        if (currentFrameIndex === i - 1) {
          render(currentFrameIndex);
        }
      };
      images.push(img);
    }

    window.addEventListener("resize", resizeCanvas);
    
    // Initial size setup
    resizeCanvas();

    // Initial state setup for story chapters
    gsap.set(".story-ch1", { opacity: 1, y: 0, filter: "blur(0px)" });
    gsap.set(".story-ch1-inner", { opacity: 0 });
    gsap.set(".story-ch2", { opacity: 0, x: 80, filter: "blur(6px)" });
    gsap.set(".story-ch3", { opacity: 0, y: 40, filter: "blur(6px)" });
    gsap.set(".story-ch4", { opacity: 0, scale: 0.3, filter: "blur(8px)" });
    gsap.set(".story-ch5", { opacity: 0, x: -80, filter: "blur(6px)" });
    gsap.set(".story-ch6", { opacity: 0, x: 80, filter: "blur(6px)" });
    gsap.set(".story-ch7", { opacity: 0, y: 40, filter: "blur(6px)" });
    gsap.set(".story-ch8", { opacity: 0, scale: 0.3, filter: "blur(8px)" });
    gsap.set(".story-ch9", { opacity: 0, y: 40, filter: "blur(6px)" });
    
    gsap.set(".final-hero", { opacity: 0 });
    gsap.set(".final-hero-badge", { opacity: 0, y: 20, filter: "blur(4px)" });
    gsap.set(".final-hero-title", { opacity: 0, y: 30, filter: "blur(6px)" });
    gsap.set(".final-hero-sub", { opacity: 0, y: 20, filter: "blur(4px)" });
    gsap.set(".final-hero-cta", { opacity: 0, y: 15, filter: "blur(3px)" });

    // Entrance Animation on Load (Chapter 1 Inner)
    gsap.fromTo(".story-ch1-inner", 
      { opacity: 0, y: 15, filter: "blur(6px)" }, 
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "power3.out", delay: 0.4 }
    );

<<<<<<< HEAD
    const tl = gsap.timeline({ paused: true });

    let maxProgress = 0;
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=700%",
      pin: true,
      onUpdate: (self) => {
        if (self.progress > maxProgress) {
          maxProgress = self.progress;
          gsap.to(tl, {
            progress: self.progress,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      },
      onLeave: (self) => {
        const scrollY = window.scrollY;
        const removedHeight = window.innerHeight * 7;
        self.kill(true);
        window.scrollTo(0, scrollY - removedHeight);
=======
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=700%", // 700% slows down the pacing significantly
        scrub: 1.5,
        pin: true,
>>>>>>> 9a7ddf93 (Fixed Scroll based animation, Changed Navbar, Fixed some UI bugs and given a premium touch)
      }
    });

    // 1. Animate image sequence
    tl.to(frameData, {
      frame: totalFrames,
      snap: "frame",
      ease: "none",
      duration: 1,
      onUpdate: () => render(Math.round(frameData.frame) - 1),
    }, 0);

    // Chapter 1 (0.00 - 0.08 scroll): Fade out opening message
    tl.to(".story-ch1", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.06, ease: "power2.inOut" }, 0.02);

    // Chapter 2 (0.08 - 0.18 scroll): Horizon - enters from right, leaves upward
    tl.to(".story-ch2", { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.08);
    tl.to(".story-ch2", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.14);

    // Chapter 3 (0.18 - 0.28 scroll): Preparing - comes slightly upward
    tl.to(".story-ch3", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.18);
    tl.to(".story-ch3", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.24);

    // Chapter 4 (0.28 - 0.38 scroll): Medicals - scales in from distance
    tl.to(".story-ch4", { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.28);
    tl.to(".story-ch4", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.34);

    // Chapter 5 (0.38 - 0.48 scroll): Certifications - enters from left
    tl.to(".story-ch5", { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.38);
    tl.to(".story-ch5", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.44);

    // Chapter 6 (0.48 - 0.58 scroll): Visa & Docs - enters from right
    tl.to(".story-ch6", { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.48);
    tl.to(".story-ch6", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.54);

    // Chapter 7 (0.58 - 0.68 scroll): Placement - comes slightly upward
    tl.to(".story-ch7", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.58);
    tl.to(".story-ch7", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.64);

    // Chapter 8 (0.68 - 0.78 scroll): Join Ship - scales in from distance
    tl.to(".story-ch8", { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.68);
    tl.to(".story-ch8", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.74);

    // Chapter 9 (0.78 - 0.88 scroll): Welcome - comes slightly upward
    tl.to(".story-ch9", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.78);
    tl.to(".story-ch9", { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.04, ease: "power2.in" }, 0.84);

    // Final Brand Reveal & CTA (starts at 0.90, CTA buttons at 1.02, pinned until 1.15)
    tl.to(".final-hero", { opacity: 1, duration: 0.02 }, 0.90);
    tl.to(".final-hero-badge", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.92);
    tl.to(".final-hero-title", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.95);
    tl.to(".final-hero-sub", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.04, ease: "power2.out" }, 0.98);
    
    // CTA appears exactly as the ship animation concludes
<<<<<<< HEAD
    tl.to(".final-hero-cta", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.05, ease: "power2.out" }, 0.98);
=======
    tl.to(".final-hero-cta", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.05, ease: "power2.out" }, 1.02);
>>>>>>> 9a7ddf93 (Fixed Scroll based animation, Changed Navbar, Fixed some UI bugs and given a premium touch)
    
    // Trigger global navbar reveal
    tl.call(() => {
      window.dispatchEvent(new CustomEvent("reveal-navbar"));
    }, [], 0.78);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen relative w-full overflow-hidden font-outfit select-none bg-[#050a14]">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        
        @keyframes driftFog {
          0% { transform: translateX(-40px) translateY(0px); opacity: 0.1; }
          50% { transform: translateX(40px) translateY(-10px); opacity: 0.2; }
          100% { transform: translateX(-40px) translateY(0px); opacity: 0.1; }
        }
        @keyframes rotateSunbeams {
          0% { transform: rotate(0deg); opacity: 0.04; }
          50% { transform: rotate(30deg); opacity: 0.1; }
          100% { transform: rotate(0deg); opacity: 0.04; }
        }
        .animate-drift-fog { animation: driftFog 20s ease-in-out infinite; }
        .animate-rotate-sunbeams { animation: rotateSunbeams 32s ease-in-out infinite; }
      ` }} />

      {/* GSAP Managed Canvas Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#050a14]">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover pointer-events-none" 
        />
        {/* Premium Multi-stop Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-[#050a14]/10 pointer-events-none" />
      </div>

      {/* Cinematic atmospheric overlays on top of background animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] left-[-20%] w-[140%] h-[140%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(96,165,250,0.03)_0deg,transparent_45deg,rgba(255,255,255,0.01)_90deg,transparent_135deg,rgba(96,165,250,0.03)_180deg,transparent_225deg,rgba(255,255,255,0.01)_270deg,transparent_315deg)] animate-rotate-sunbeams origin-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.02)_0%,transparent_60%)] animate-drift-fog" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(96,165,250,0.01)_0%,transparent_65%)] animate-drift-fog" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-30" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-30" />
      </div>

      {/* SCROLL TRIGGERED TEXT LAYOUT OVERLAY */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-20 pointer-events-none select-none text-center px-4 max-w-4xl mx-auto">
        <div ref={textGroupRef} className="relative w-full h-[60vh] max-w-5xl mx-auto flex items-center justify-center pointer-events-none">
          
          {/* Chapter 1: The Beginning (Dream) - Left aligned */}
          <div className="story-ch1 absolute left-4 md:left-12 text-left max-w-md pointer-events-none">
            <div className="story-ch1-inner opacity-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] text-slate-200/90 font-outfit uppercase leading-relaxed">
                Every Great Voyage
                <br />
                <span className="font-semibold text-white">Begins With A Dream.</span>
              </h2>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-slate-550 mt-12 flex items-center gap-4 font-outfit">
                <span>SCROLL TO BEGIN</span>
                <span className="inline-block animate-bounce text-xs">↓</span>
              </p>
            </div>
          </div>

          {/* Chapter 2: Horizon - Right aligned */}
          <div className="story-ch2 absolute right-4 md:right-12 text-right max-w-md pointer-events-none opacity-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.15em] text-slate-350 font-outfit uppercase leading-relaxed">
              Dream Beyond
              <br />
              <span className="font-bold text-transparent bg-gradient-to-r from-blue-300 to-cyan-100 bg-clip-text">The Horizon.</span>
            </h2>
          </div>

          {/* Chapter 3: Preparation - Centered directly below navbar */}
          <div className="story-ch3 absolute top-28 md:top-32 text-center max-w-xl pointer-events-none opacity-0">
            <h2 className="text-xl sm:text-2xl tracking-[0.2em] uppercase text-slate-400 font-light font-outfit">
              Step 1: <span className="font-bold text-cyan-300">Start Preparing.</span>
            </h2>
          </div>

          {/* Chapter 4: Medicals - Large center, scales in from distance */}
          <div className="story-ch4 absolute text-center max-w-2xl pointer-events-none opacity-0">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-white font-outfit">
              Complete Your Medicals.
            </h2>
            <p className="text-xs tracking-widest text-slate-450 uppercase mt-4 font-medium">
              Ensuring you are fit for the challenges at sea
            </p>
          </div>

          {/* Chapter 5: Certifications - Left aligned */}
          <div className="story-ch5 absolute left-4 md:left-12 text-left max-w-md pointer-events-none opacity-0">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] text-slate-300 font-outfit uppercase leading-relaxed">
              Obtain Mandatory
              <br />
              <span className="font-bold text-cyan-300">Certifications.</span>
            </h2>
          </div>

          {/* Chapter 6: Visa & Docs - Right aligned */}
          <div className="story-ch6 absolute right-4 md:right-12 text-right max-w-md pointer-events-none opacity-0">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] text-slate-300 font-outfit uppercase leading-relaxed">
              Documentation
              <br />
              <span className="font-bold text-blue-300">& Visa.</span>
            </h2>
          </div>

          {/* Chapter 7: Placement - Centered directly below navbar */}
          <div className="story-ch7 absolute top-28 md:top-32 text-center max-w-xl pointer-events-none opacity-0">
            <h2 className="text-xl sm:text-2xl tracking-[0.2em] uppercase text-slate-400 font-light font-outfit">
              Step 5: <span className="font-bold text-indigo-400">Placement Assistance.</span>
            </h2>
          </div>

          {/* Chapter 8: Join Ship - Large center, scales in */}
          <div className="story-ch8 absolute text-center max-w-2xl pointer-events-none opacity-0">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.2em] uppercase text-white font-outfit leading-tight">
              Join Your
              <br />
              First Ship.
            </h2>
          </div>

          {/* Chapter 9: Welcome - Center */}
          <div className="story-ch9 absolute text-center max-w-2xl pointer-events-none opacity-0">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.2em] uppercase text-slate-300 font-outfit leading-relaxed">
              Welcome to
              <br />
              <span className="font-black text-transparent bg-gradient-to-r from-blue-300 to-white bg-clip-text">Hari Om Thalassic.</span>
            </h2>
          </div>

          {/* FINAL HERO REVEAL: Brand Details & Action CTA */}
          <div className="final-hero absolute flex flex-col items-center opacity-0 w-full pointer-events-none">
            {/* Trust badge */}
            <div className="final-hero-badge mb-6 opacity-0">
              <span className="inline-block px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase bg-white/5 border border-white/10 text-cyan-300 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
                Trusted Maritime Career Partner
              </span>
            </div>

            {/* Main Brand Headline */}
            <h1 className="final-hero-title text-5xl sm:text-7xl md:text-8xl font-black leading-[1.1] tracking-tight text-white mb-6 font-outfit opacity-0">
              Hari Om Thalassic
            </h1>
            
            {/* Brand Subheading */}
            <p className="final-hero-sub text-lg sm:text-2xl font-light tracking-[0.2em] uppercase text-slate-300 font-outfit mb-12 opacity-0">
              A Complete Seafarer's Home
            </p>

            {/* Action buttons */}
            <div className="final-hero-cta flex flex-wrap gap-6 items-center justify-center pointer-events-auto opacity-0">
              <Link
                href="/courses"
                className="px-8 py-4 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-xl shadow-white/10 transform hover:scale-105 active:scale-95"
              >
                Begin Your Maritime Career
              </Link>

              <Link
                href="/contact"
                className="px-6 py-4 font-bold text-slate-300 hover:text-white transition-colors underline-offset-8 hover:underline"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- MAIN WRAPPER PAGE ---
export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const stripRef = useRef<HTMLDivElement>(null);

  // Counter metric data for telemetry console
  const metrics = [
    { value: "10,000+", label: "Certified Seafarers", tech: "STATUS: ACTIVE" },
    { value: "98.7%", label: "Success Rate", tech: "DGS CERTIFIED" },
    { value: "25+", label: "Master Trainers", tech: "SINCE 2004" },
    { value: "45+", label: "Approved Programs", tech: "GLOBAL NETWORK" },
  ];

  useGSAP(() => {
    if (!stripRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stripRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      }
    });

    // 1. Expand console strip container horizontally from center
    tl.fromTo(".console-strip-container",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1.0, ease: "power4.inOut" }
    );

    // 2. Expand accent line borders
    tl.fromTo(".console-accent-line",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );

    // 3. Draw vertical divider lines (scale Y)
    tl.fromTo(".console-divider-y",
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
      "-=0.4"
    );

    // 4. Draw horizontal divider lines (scale X)
    tl.fromTo(".console-divider-x",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
      "-=0.4"
    );

    // 5. Stagger reveal metric contents (fade/slide up)
    tl.fromTo(".console-metric-item",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.15 },
      "-=0.5"
    );
  }, { scope: stripRef });

  return (
    <div className={`overflow-x-hidden font-outfit transition-colors duration-300 ${
      isDark ? "bg-[#050a14] text-slate-100" : "bg-[#f8fafc] text-slate-900"
    }`}>
      {/* Premium custom animations and soft cool glassmorphism styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-glass {
          background: rgba(10, 18, 36, 0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.35), 
            inset 0 1px 0 rgba(255, 255, 255, 0.02);
        }
        .nautical-grid {
          background-size: 20px 20px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.01) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
        }
        .brand-pill {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Spin animations for navigation vector compasses */
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverseSlow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spinSlow 32s linear infinite; }
        .animate-spin-reverse-slow { animation: spinReverseSlow 44s linear infinite; }
      ` }} />

      {/* 1. Cinematic Scroll Hero Component */}
      <Hero />

      {/* 2. Key Achievements Maritime Console Strip */}
      <section 
        ref={stripRef}
        className="relative z-20 bg-[#050a14] py-20 border-t border-white/5 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Main Console Strip */}
          <div className="console-strip-container origin-center relative border-y border-white/10 bg-[#070f1e]/40 backdrop-blur-md py-12 md:py-16 px-4 md:px-8 shadow-2xl">
            
            {/* Top and Bottom Accent Lines */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent console-accent-line origin-center" />
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent console-accent-line origin-center" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 md:gap-y-20 lg:gap-y-0 relative">
              {metrics.map((item, index) => (
                <div 
                  key={index}
                  className="console-metric-item flex flex-col items-center justify-center text-center px-4 relative opacity-0"
                >
                  {/* Technical Label (Above) */}
                  <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-400/85 mb-4 block">
                    {item.tech}
                  </span>

                  {/* Large Number */}
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-2.5 font-outfit">
                    {item.value}
                  </h3>

                  {/* Core Label (Below) */}
                  <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                    {item.label}
                  </h4>

                  {/* Desktop Dividers: Vertical (between columns) */}
                  {index < 3 && (
                    <div className="console-divider-y origin-center absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/10 hidden lg:block" />
                  )}

                  {/* Tablet Dividers: Vertical (between items 1-2 and 3-4) */}
                  {index % 2 === 0 && (
                    <div className="console-divider-y origin-center absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/10 hidden md:block lg:hidden" />
                  )}

                  {/* Mobile Dividers: Horizontal (below stacked items) */}
                  {index < 3 && (
                    <div className="console-divider-x origin-center absolute bottom-[-32px] left-6 right-6 h-[1px] bg-white/5 block md:hidden" />
                  )}
                </div>
              ))}
            </div>

            {/* Tablet Row Divider (Horizontal between Row 1 and Row 2) */}
            <div className="console-divider-x origin-center absolute left-12 right-12 top-1/2 -translate-y-1/2 h-[1px] bg-white/5 hidden md:block lg:hidden" />

          </div>

        </div>
      </section>

      {/* 3. About Section */}
      <section className={`py-28 border-t relative z-20 overflow-hidden ${
        isDark ? "bg-[#050a14] border-slate-900" : "bg-white border-slate-200"
      }`}>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/2 blur-[150px] pointer-events-none z-0" />
        
        {/* Horizontal Navigation Telemetry Bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          <ScrollReveal>
            <div className={`w-full py-2 px-6 rounded-full border text-[9px] font-black tracking-widest flex flex-wrap justify-between items-center gap-4 ${
              isDark 
                ? "border-slate-800/80 bg-slate-950/30 text-slate-500" 
                : "border-slate-200 bg-slate-100/50 text-slate-600"
            }`}>
              <span>POSITION: 18°55&apos;N / 72°50&apos;E</span>
              <span>HEADING: 240° SOUTHWEST</span>
              <span className={`animate-pulse ${isDark ? "text-blue-300" : "text-blue-605"}`}>TELEMETRY LINK: ACTIVE</span>
              <span>SPEED: 14.2 KNOTS</span>
              <span>BAROMETER: 1013 HPA</span>
            </div>
          </ScrollReveal>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Angled dashboard tracker with highly visible rotating compass background */}
            <div className="lg:col-span-5 flex justify-center relative">
              <ScrollReveal>
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none scale-125 z-0 transition-opacity duration-300 ${
                  isDark ? "opacity-[0.58] text-blue-500" : "opacity-[0.42] text-blue-655"
                }`}>
                  <Compass className="w-80 h-80 stroke-[1.6] animate-spin-reverse-slow" />
                </div>

                <div className={`w-full max-w-[390px] p-8 rounded-[32px] border relative z-10 shadow-2xl transition-all duration-700 hover:rotate-0 hover:scale-[1.02] transform -rotate-2 ${
                  isDark 
                    ? "bg-[#090f1f]/95 border-slate-800 shadow-black/40 text-slate-100" 
                    : "bg-white border-slate-250 shadow-slate-200 text-slate-800"
                }`}>
                  <div className="absolute inset-0 pointer-events-none rounded-[32px] opacity-15 nautical-grid" />

                  {/* Compliance circular gauge dashboard */}
                  <div className={`flex gap-4 items-center mb-6 pb-5 border-b relative z-10 ${
                    isDark ? "border-slate-800" : "border-slate-100"
                  }`}>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" fill="none" stroke={isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.15)"} strokeWidth="4" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="125" strokeDashoffset="0" className="animate-pulse" />
                      </svg>
                      <span className={`absolute text-[8px] font-black ${isDark ? "text-blue-300" : "text-blue-600"}`}>100%</span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-400 leading-none mb-1">COMPLIANCE LEDGER</h4>
                      <span className={`text-[8px] font-bold border px-2 py-0.5 rounded ${
                        isDark ? "text-blue-300 bg-blue-950/30 border-blue-500/10" : "text-blue-600 bg-blue-50 border-blue-200"
                      }`}>DGS VERIFIED</span>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    {[
                      { log: "LOG-01", label: "Biometric INDOS Profile", status: "Active", desc: "Linked to DGS portal" },
                      { log: "LOG-02", label: "Basic Safety Compliance", status: "Passed", desc: "STCW VI/1 validation" },
                      { log: "LOG-03", label: "Medical Fitness Endorsement", status: "Cleared", desc: "Approved practitioner check" }
                    ].map((task, i) => (
                      <div key={i} className={`flex items-center justify-between border-b pb-3.5 last:border-b-0 last:pb-0 ${
                        isDark ? "border-slate-800" : "border-slate-100"
                      }`}>
                        <div className="flex items-start gap-2.5">
                          <span className="text-[9px] font-black text-slate-500 mt-0.5">{task.log}</span>
                          <div>
                            <span className="text-xs font-black block leading-none">{task.label}</span>
                            <span className="text-[9px] text-slate-505 font-medium">{task.desc}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                          <span className={`text-[9px] font-black border px-2 py-0.5 rounded uppercase ${
                            isDark ? "text-blue-300 bg-blue-950/20 border-blue-500/10" : "text-blue-605"
                          }`}>{task.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-8 pt-5 border-t relative z-10 ${
                    isDark ? "border-slate-800" : "border-slate-100"
                  }`}>
                    <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-wider text-slate-400">
                      <span>SEAFARER READINESS</span>
                      <span className={`font-black ${isDark ? "text-blue-300" : "text-blue-605"}`}>SECURE</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden border ${
                      isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
                    }`}>
                      <div className="h-full bg-gradient-to-r from-blue-500 to-slate-400 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Custom nautical details */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <ScrollReveal delay={150}>
                <div className="space-y-3">
                  <span className={`text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full border inline-block ${
                    isDark ? "bg-blue-500/5 border-blue-500/10 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-655"
                  }`}>
                    // MARITIME TRAINING MATRIX
                  </span>
                  <h2 className={`text-4xl lg:text-5xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r ${
                    isDark ? "from-white via-slate-100 to-slate-350" : "from-slate-900 via-blue-950 to-slate-800"
                  }`}>
                    NAVIGATING <span className="font-extralight">GLOBAL</span> MARITIME CAREERS
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-slate-400 rounded-full" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <p className={`text-base leading-relaxed font-light ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  Hari Om Thalassic serves as a premier maritime training & recruitment ecosystem. We act as a critical operational nexus, guiding seafarers through DGS preparatory courses, certification, dynamic documentation processing, and placement pipelines worldwide.
                </p>
              </ScrollReveal>

              {/* Asymmetrical features */}
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <ScrollReveal delay={350}>
                  <div className={`space-y-1.5 pl-4 border-l-2 group ${
                    isDark ? "border-slate-800" : "border-slate-200"
                  }`}>
                    <div className={`flex items-center gap-2 ${isDark ? "text-blue-300" : "text-blue-655"}`}>
                      <Activity className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      <h4 className="text-sm font-black tracking-tight">DGS Approved Certifications</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">100% compliant safety certifications for global sea service.</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={450}>
                  <div className={`space-y-1.5 pl-4 border-l-2 group ${
                    isDark ? "border-slate-800" : "border-slate-200"
                  }`}>
                    <div className={`flex items-center gap-2 ${isDark ? "text-blue-300" : "text-blue-655"}`}>
                      <Eye className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      <h4 className="text-sm font-black tracking-tight">Master Mariner Instruction</h4>
                    </div>
                    <p className="text-xs text-slate-505 leading-relaxed font-medium">Coached directly by certified Master Mariners and Chief Engineers.</p>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={500}>
                <div className="pt-4">
                  <Link
                    href="/about"
                    className={`inline-flex items-center font-bold text-xs tracking-widest gap-2 group px-6 py-3.5 rounded-2xl transition-all border ${
                      isDark 
                        ? "bg-slate-900 border-white/5 hover:border-blue-500/20 text-white" 
                        : "bg-white border-slate-200 hover:border-blue-500/20 text-slate-850 shadow-sm"
                    }`}
                  >
                    DISCOVER FULL ROADMAP
                    <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Featured Courses Section */}
      <section className={`py-28 border-t relative z-20 ${
        isDark ? "bg-[#050a14] border-slate-900" : "bg-slate-50/50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <ScrollReveal>
              <div>
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  isDark ? "bg-blue-500/5 border-blue-500/10 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-600"
                }`}>
                  ACADEMIC BLUEPRINT
                </span>
                <h2 className="text-4xl font-black tracking-tight mt-3">
                  Featured Maritime Training
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <Link
                href="/courses"
                className={`inline-flex items-center font-bold text-xs gap-1.5 group px-4 py-2.5 rounded-xl border ${
                  isDark ? "bg-slate-900 border-white/5 hover:border-blue-500/20 text-blue-300" : "bg-white border-slate-200 hover:border-blue-500/20 text-slate-655"
                }`}
              >
                BROWSE PROGRAMS
                <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {FEATURED_COURSES.map((course, index) => {
              const IconComp = course.icon;
              
              return (
                <ScrollReveal key={course.id} delay={index * 150}>
                  <div 
                    className={`border transition-all duration-500 flex flex-col justify-between overflow-hidden group hover:-translate-y-2 hover:shadow-2xl h-full rounded-3xl ${
                      isDark ? course.bgClassDark : `${course.bgClassLight} border-slate-200`
                    }`}
                    style={{ 
                      boxShadow: isDark ? "0 15px 40px -10px rgba(0,0,0,0.5)" : "0 15px 30px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div className="p-7 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                          isDark ? course.badgeColorDark : course.badgeColorLight
                        }`}>
                          {course.code}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
                          {course.stcw}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${course.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                            <IconComp className="w-4.5 h-4.5" />
                          </div>
                          <h3 className={`font-black text-lg tracking-tight transition-colors ${
                            isDark ? "group-hover:text-blue-300" : "group-hover:text-blue-655 text-slate-800"
                          }`}>
                            {course.name}
                          </h3>
                        </div>
                        <p className={`text-xs leading-relaxed ${
                          isDark ? "text-slate-400" : "text-slate-505"
                        }`}>
                          {course.description}
                        </p>
                      </div>

                      <div className={`flex gap-4 items-center text-[10px] uppercase font-bold tracking-wider pt-2 border-t ${
                        isDark ? "border-slate-800" : "border-slate-100"
                      }`}>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{course.rating} ({course.ratingCount})</span>
                        </div>
                      </div>
                    </div>

                    <div className={`px-7 py-4 flex items-center justify-between border-t ${
                      isDark ? "border-slate-800 bg-slate-950/20" : "border-slate-100 bg-slate-50/50"
                    }`}>
                      <div>
                        <span className="text-[9px] text-slate-500 block font-black uppercase tracking-wider">Fee Registry</span>
                        <span className={`text-base font-black ${isDark ? "text-blue-300" : "text-blue-605"}`}>{course.fees}</span>
                      </div>
                      <Link
                        href={`/courses`}
                        className="px-4 py-2 rounded-xl text-xs font-black transition-all bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white"
                      >
                        ENROLL NOW
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Placements Section */}
      <section className={`py-24 border-t relative z-20 overflow-hidden ${
        isDark ? "bg-[#050a14] border-slate-900" : "bg-white border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <ScrollReveal>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              isDark ? "bg-blue-500/5 border-blue-500/10 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-655"
            }`}>
              GLOBAL TRANSIT LOGISTICS
            </span>
            <h3 className={`text-3xl font-black mt-3 mb-12 ${isDark ? "text-white" : "text-slate-800"}`}>Recruitment & Fleet Placement Alliances</h3>
          </ScrollReveal>
          
          <div className="flex flex-wrap gap-5 justify-center max-w-5xl mx-auto">
            {SHIELD_PARTNERS.map((fleet, index) => (
              <ScrollReveal key={index} delay={index * 70}>
                <div className={`brand-pill px-6 py-4 rounded-2xl flex items-center gap-4 relative overflow-hidden group ${
                  isDark ? "bg-white/[0.015] border-white/5 text-white hover:bg-blue-500/5 hover:border-blue-500/15" : "bg-slate-100 border-slate-200 text-slate-850 hover:bg-slate-205"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    isDark ? "bg-blue-400 group-hover:bg-blue-300" : "bg-blue-600"
                  }`} />
                  <div className="text-left">
                    <span className={`text-xs font-black block leading-none mb-1 ${isDark ? "text-white" : "text-slate-850"}`}>{fleet.name}</span>
                    <span className="text-[9px] text-slate-505 font-bold block">{fleet.routes} • {fleet.lat}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className={`py-28 border-t relative z-20 ${
        isDark ? "bg-[#050a14] border-slate-900" : "bg-slate-50/50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column vertical title */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <ScrollReveal>
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  isDark ? "bg-blue-500/5 border-blue-500/10 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-600"
                }`}>
                  CORE METRICS
                </span>
                <h2 className={`text-4xl font-black tracking-tight leading-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                  Operational Advantages
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-505"}`}>
                  We align our infrastructure with global administrative criteria to maximize compliance, learning speed, and career outcomes.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="pt-4 pointer-events-auto">
                  <div className={`p-6 rounded-2xl border ${
                    isDark ? "bg-blue-950/20 border-blue-500/10 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-755"
                  }`}>
                    <Compass className="w-8 h-8 mb-3 animate-spin-slow" />
                    <span className="text-xs font-black uppercase tracking-widest block mb-1">DGS Compliant Ledger</span>
                    <p className="text-[10px] text-slate-505 leading-relaxed font-semibold">Every preparatory training is verified by automated biometric portals.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column staggered boxes */}
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Certified Master Trainers",
                  text: "Instructional modules led exclusively by certified Master Mariners, Chief Engineers, and industry veterans.",
                  index: "01",
                  border: "border-l-4 border-blue-500/80"
                },
                {
                  title: "Official DGS Standards",
                  text: "All training curriculum and simulator modules strictly align with updated DGS administrative criteria.",
                  index: "02",
                  border: "border-l-4 border-sky-400/80"
                },
                {
                  title: "Worldwide Placement Network",
                  text: "Recruitment assistance aligned with verified shipping conglomerates and global crew managers.",
                  index: "03",
                  border: "border-l-4 border-indigo-500/80"
                },
                {
                  title: "Polished Simulator Labs",
                  text: "Interactive training simulations that prepare candidates to ace standard examination metrics.",
                  index: "04",
                  border: "border-l-4 border-blue-400/80"
                }
              ].map((item, index) => (
                <ScrollReveal key={index} delay={item.index === "01" ? 0 : index * 120}>
                  <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${item.border} ${
                    isDark 
                      ? "bg-[#0b1224]/45 border-slate-800 hover:border-slate-750" 
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}>
                    <span className="text-[10px] font-black text-slate-500 block mb-3">CRITERIA {item.index}</span>
                    <h3 className={`font-black text-base tracking-tight mb-2 ${isDark ? "text-slate-100" : "text-slate-850"}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-505"}`}>
                      {item.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}