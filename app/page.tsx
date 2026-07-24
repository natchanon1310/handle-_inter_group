"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { dictionary } from "./utils/dictionaries";

// 🎬 Component ตัวอักษรโผล่มาทีละตัว (แก้ไขลดการเกิด Hydration Mismatch)
function TextReveal({ 
  text, 
  className = "", 
  delayStep = 0.035,
  lang = "en"
}: { 
  text: string; 
  className?: string; 
  delayStep?: number;
  lang?: "en" | "th";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const wordsAndChars = useMemo(() => {
    if (!text) return [];

    if (isMounted && typeof window !== "undefined" && "Segmenter" in Intl) {
      const wordSegmenter = new Intl.Segmenter(lang === "th" ? "th" : "en", { granularity: "word" });
      const charSegmenter = new Intl.Segmenter(lang === "th" ? "th" : "en", { granularity: "grapheme" });

      const wordSegments = Array.from(wordSegmenter.segment(text));
      
      return wordSegments.map((w) => {
        const chars = Array.from(charSegmenter.segment(w.segment)).map((c) => c.segment);
        return {
          word: w.segment,
          isSpace: w.segment.trim() === "",
          chars,
        };
      });
    }

    return text.split(" ").map((w) => ({
      word: w,
      isSpace: false,
      chars: w.split(""),
    }));
  }, [text, lang, isMounted]);

  let globalCharIndex = 0;

  return (
    <div ref={containerRef} className={`inline-block overflow-hidden leading-tight ${className}`}>
      {wordsAndChars.map((item, wordIdx) => {
        if (item.isSpace) {
          return <span key={wordIdx} className="inline-block">&nbsp;</span>;
        }

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {item.chars.map((char) => {
              const currentIndex = globalCharIndex;
              globalCharIndex++;
              return (
                <span
                  key={currentIndex}
                  style={{
                    transitionDelay: `${currentIndex * delayStep}s`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible 
                      ? "translateY(0) rotateX(0deg) scale(1)" 
                      : "translateY(120%) rotateX(60deg) scale(0.8)",
                  }}
                  className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu origin-bottom"
                >
                  {char}
                </span>
              );
            })}
            {lang === "en" && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </div>
  );
}

// 🎬 3D Tilt Wrapper
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y / height) - 0.5) * -10;
    const rotateY = ((x / width) - 0.5) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.2s ease-out" }}
      className={`will-change-transform ${className || ""}`}
    >
      {children}
    </div>
  );
}

// 🎯 Component การ์ดบริการวิดีโอเต็มใบ
function FullVideoServiceCard({
  idx,
  service,
  desc,
  tags,
  bgImg,
  videoSrc,
  lang,
  onHoverChange
}: {
  idx: number;
  service: string;
  desc: string;
  tags: string[];
  bgImg: string;
  videoSrc: string;
  lang: "en" | "th";
  onHoverChange: (isHovered: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <TiltCard className="h-full shrink-0 w-[300px] sm:w-[360px] md:w-[400px]">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative h-[480px] md:h-[520px] w-full rounded-[32px] overflow-hidden bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between p-8 transition-all duration-500 hover:border-orange-500/80 hover:shadow-2xl cursor-pointer select-none"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImg}
            alt={service}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-0 scale-110" : "opacity-75 scale-100"
            }`}
          />

          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-95 scale-105" : "opacity-0 scale-100"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-black/20 z-10" />
        </div>

        <div className="relative z-20 flex justify-between items-center w-full">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-mono text-xs font-bold text-white shadow-sm">
            0{idx + 1}
          </div>

          <div className="flex space-x-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-mono text-white px-3 py-1 rounded-full uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-20 flex justify-between items-end gap-4 w-full pt-4">
          <div className="space-y-2 max-w-[78%]">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-orange-400 transition-colors">
              <TextReveal text={service} lang={lang} delayStep={0.03} />
            </h3>
            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
              {desc}
            </p>
          </div>

          <div className={`w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg shrink-0 transition-all duration-300 transform ${
            isHovered ? "scale-110 bg-orange-500 rotate-45 shadow-lg shadow-orange-500/40" : "scale-100"
          }`}>
            ↗
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// 🎬 Component การ์ดบริษัทในเครือ (ปรับขยายขนาดโลโก้ใหญ่ขึ้น + แสดงสีจริง ไม่ใช้ Grayscale)
function CurvedTimelinePartnerCardLocked({
  idx,
  name,
  logoSrc,
  desc,
  link,
  totalItems,
  scrollYProgress,
}: {
  idx: number;
  name: string;
  logoSrc: string;
  desc: string;
  link: string;
  totalItems: number;
  scrollYProgress: any;
}) {
  const step = 1 / totalItems;
  const startProgress = idx * (step * 0.7);
  const endProgress = Math.min(1, startProgress + 0.5);

  const x = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    ["140%", "-160%"]
  );

  const yVal = idx % 2 === 0 ? [50, -70, 40] : [-50, 70, -30];
  const y = useTransform(
    scrollYProgress,
    [startProgress, (startProgress + endProgress) / 2, endProgress],
    yVal
  );

  const opacity = useTransform(
    scrollYProgress,
    [startProgress, startProgress + 0.08, endProgress - 0.08, endProgress],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [startProgress, (startProgress + endProgress) / 2, endProgress],
    [0.85, 1, 0.88]
  );

  return (
    <motion.div
      style={{ x, y, opacity, scale }}
      className="absolute top-1/2 -translate-y-1/2 will-change-transform z-20 pointer-events-auto"
    >
      <Link href={link}>
        <div className="bg-white rounded-[32px] border border-slate-200/90 p-8 md:p-9 shadow-2xl shadow-slate-300/40 w-[300px] sm:w-[360px] md:w-[400px] flex flex-col justify-between transition-all duration-300 hover:shadow-orange-500/20 hover:border-orange-500 hover:scale-105 cursor-pointer select-none group">
          
          {/* Header & Number Badge */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-3xl md:text-4xl font-black font-mono text-orange-500/90 tracking-tighter">
              '{String(idx + 1).padStart(2, "0")}
            </span>
            <span className="bg-orange-50 border border-orange-200/80 text-[10px] font-mono text-orange-600 px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
              SUBSIDIARY
            </span>
          </div>

          {/* 🌟 Logo แสดงผลเป็นสีจริง (Full Color) ขนาดใหญ่ */}
          <div className="my-3 py-2 flex items-center justify-start min-h-[90px]">
            <img
              src={logoSrc}
              alt={name}
              className="h-20 md:h-24 w-auto max-w-[90%] object-contain drop-shadow-sm transition-all duration-300 group-hover:scale-105 origin-left"
            />
          </div>

          {/* Title & Description */}
          <div className="space-y-2 text-left mb-2">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
              {name}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-normal line-clamp-2">
              {desc}
            </p>
          </div>

          {/* Footer Read More */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              EXPLORE HUB
            </span>
            <span className="bg-slate-900 group-hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-1.5 shadow-md">
              <span>Read more</span>
              <span className="text-xs group-hover:translate-x-1 transition-transform">↗</span>
            </span>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("who-we-are");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [visitedSections, setVisitedSections] = useState<Record<string, boolean>>({ "who-we-are": true });

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Ref & State สำหรับ Pinned Service Slider
  const serviceWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState("2200px");
  const [progressRatio, setProgressRatio] = useState(0);

  // State & Ref สำหรับ Hero Section
  const [heroBlur, setHeroBlur] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroTranslateY, setHeroTranslateY] = useState(0);

  const [isIdle, setIsIdle] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔒 Ref & Scroll Engine สำหรับ Subsidiaries Section (Pin & Lock Screen)
  const subsidiariesContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: subsidiariesScrollProgress } = useScroll({
    target: subsidiariesContainerRef,
    offset: ["start start", "end end"],
  });

  // ระบบ Idle Detector
  useEffect(() => {
    const handleUserActivity = () => {
      setIsIdle(false);
      if (heroVideoRef.current) {
        heroVideoRef.current.pause();
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
        if (heroVideoRef.current) {
          heroVideoRef.current.play().catch(() => {});
        }
      }, 2500);
    };

    handleUserActivity();

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, []);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("langChange", checkLang);
    return () => window.removeEventListener("langChange", checkLang);
  }, []);

  const t = dictionary[lang] || dictionary.en;

  const sections = useMemo(() => [
    { id: "who-we-are", label: lang === "en" ? "Overview" : "ภาพรวม" },
    { id: "what-we-offer", label: lang === "en" ? "Services" : "บริการ" },
    { id: "subsidiaries", label: lang === "en" ? "Subsidiaries" : "บริษัทในเครือ" },
    { id: "worldwide", label: lang === "en" ? "Network" : "เครือข่าย" },
    { id: "news", label: lang === "en" ? "Update" : "ข่าวสาร" },
  ], [lang]);

  const serviceCardsData = [
    {
      title: lang === "en" ? "Sea Freight" : "ขนส่งทางทะเล",
      desc: lang === "en" ? "Comprehensive ocean freight solutions with global container tracking." : "บริการขนส่งสินค้าทางเรือครอบคลุมทั่วโลก ปลอดภัย พร้อมระบบติดตาม",
      tags: ["SEA", "CONTAINER", "GLOBAL"],
      bg: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-cargo-container-ship-sailing-in-the-sea-41484-large.mp4"
    },
    {
      title: lang === "en" ? "Air Freight" : "ขนส่งทางอากาศ",
      desc: lang === "en" ? "Express air cargo services for time-critical global deliveries." : "จัดส่งสินค้ารวดเร็วทันใจทางเครื่องบิน ตอบโจทย์ทุกเวลาเร่งด่วน",
      tags: ["AIR", "EXPRESS", "CARGO"],
      bg: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-commercial-airplane-taking-off-at-sunset-21545-large.mp4"
    },
    {
      title: lang === "en" ? "Land Transport" : "ขนส่งทางบก",
      desc: lang === "en" ? "Cross-border and domestic trucking network with maximum safety." : "เครือข่ายรถบรรทุกขนส่งภายในประเทศและข้ามแดนอย่างมีประสิทธิภาพ",
      tags: ["TRUCK", "DOMESTIC", "CROSS-BORDER"],
      bg: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-semi-truck-driving-on-a-highway-at-sunset-42907-large.mp4"
    },
    {
      title: lang === "en" ? "Warehousing" : "คลังสินค้า",
      desc: lang === "en" ? "Modern warehouse management with real-time inventory control." : "ระบบจัดเก็บและบริหารคลังสินค้าอัจฉริยะ ตรวจสอบได้แบบเรียลไทม์",
      tags: ["STORAGE", "LOGISTICS", "SMART"],
      bg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-warehouse-with-shelves-and-boxes-43343-large.mp4"
    },
    {
      title: lang === "en" ? "Customs Clearance" : "พิธีการศุลกากร",
      desc: lang === "en" ? "Seamless import-export documentation by certified specialists." : "จัดการเอกสารนำเข้า-ส่งออกอย่างถูกต้องรวดเร็ว โดยผู้เชี่ยวชาญ",
      tags: ["CUSTOMS", "EXPORT", "IMPORT"],
      bg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-hand-checking-documents-41551-large.mp4"
    },
    {
      title: lang === "en" ? "Project Cargo" : "สินค้าโครงการ",
      desc: lang === "en" ? "Specialized heavy-lift and oversized cargo handling." : "การดูแลขนส่งเครื่องจักรขนาดใหญ่และสินค้าโครงการพิเศษครบวงจร",
      tags: ["PROJECT", "HEAVY", "SPECIAL"],
      bg: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-crane-lifting-a-heavy-container-in-a-port-41485-large.mp4"
    }
  ];

  const partnerLogos = [
    { name: "H.I.T. INTERCON", src: "/images/1725e41.png", desc: "Total Ocean & Air Freight Solutions with global network connectivity.", link: "/H-I-T-INTERCON" },
    { name: "HANDLE INTER LOGISTICS", src: "/images/1713676611302.png", desc: "Comprehensive Logistics Management & Domestic Trucking Fleet.", link: "/HANDLE-INTER-LOGISTICS" },
    { name: "HANDLE INTER CONSOLIDATION", src: "/images/handle inter con.png", desc: "Expert LCL Consolidation Hub & Container Warehouse Facility.", link: "/HANDLE-INTER-CONSOLIDATION" },
    { name: "CONSOLE LINK", src: "/images/consol-link.png", desc: "Digital Freight & Trade Connectivity Solutions for Modern Logistics.", link: "/CONSOLE-LINK" },
    { name: "SIAM LINERS", src: "/images/siam liner.png", desc: "NVOCC Liner & Vessel Schedules across Southeast Asia paths.", link: "/SIAM-LINERS" },
  ];

  useEffect(() => {
    const calcWrapperHeight = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxScrollableWidth = trackWidth - viewportWidth;
        setWrapperHeight(`${maxScrollableWidth + window.innerHeight}px`);
      }
    };

    calcWrapperHeight();
    window.addEventListener("resize", calcWrapperHeight);
    return () => window.removeEventListener("resize", calcWrapperHeight);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // 1. Scroll-driven Blur ใน Hero
          if (scrollY <= 600) {
            const blurVal = (scrollY / 600) * 16;
            const opacityVal = Math.max(0, 1 - scrollY / 500);
            const translateYVal = (scrollY / 600) * -80;

            setHeroBlur(blurVal);
            setHeroOpacity(opacityVal);
            setHeroTranslateY(translateYVal);
          }

          // 2. Pinned Horizontal Scroll การ์ดบริการ
          if (serviceWrapperRef.current && trackRef.current) {
            const wrapperTop = serviceWrapperRef.current.offsetTop;
            const trackWidth = trackRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;
            const maxScrollX = trackWidth - viewportWidth;

            if (scrollY < wrapperTop) {
              setTranslateX(0);
              setProgressRatio(0);
            } else if (scrollY >= wrapperTop && scrollY <= wrapperTop + maxScrollX) {
              const moved = scrollY - wrapperTop;
              setTranslateX(-moved);
              setProgressRatio(moved / maxScrollX);
            } else {
              setTranslateX(-maxScrollX);
              setProgressRatio(1);
            }
          }

          // 3. Side Dots Active State
          const scrollPosition = scrollY + 300;
          for (const section of sections) {
            const el = document.getElementById(section.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section.id);
                setVisitedSections((prev) => ({ ...prev, [section.id]: true }));
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setVisitedSections((prev) => ({ ...prev, [id]: true }));
  };

  const newsItems = [
    {
      date: "18 JUL 2026",
      title: lang === "en" ? "Expanding Global Network with New Sea Freight Routes" : "ขยายเครือข่ายระดับโลกด้วยเส้นทางขนส่งทางเรือใหม่",
      img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80"
    },
    {
      date: "10 JUN 2026",
      title: lang === "en" ? "Sustainable Supply Chain Solutions for 2026" : "โซลูชันซัพพลายเชนอย่างยั่งยืนสำหรับปี 2026",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
    },
    {
      date: "25 MAY 2026",
      title: lang === "en" ? "Smart Warehousing Technologies Implementation" : "การประยุกต์ใช้เทคโนโลยีคลังสินค้าอัจฉริยะ",
      img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="relative bg-slate-50 text-slate-800 cursor-default selection:bg-orange-500 selection:text-white">
      
      {/* Custom Cursor Circle */}
      <div 
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        className={`fixed w-8 h-8 pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-600/50 bg-orange-500/10 backdrop-blur-[1px] transition-transform duration-300 z-50 hidden lg:block ${
          isHovered ? "scale-150 border-orange-500 bg-orange-500/20" : "scale-100"
        }`}
      />

      {/* Side Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-6 items-end">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isVisited = visitedSections[section.id];

          return (
            <button 
              key={section.id} 
              onClick={() => scrollToSection(section.id)} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group flex items-center space-x-4 focus:outline-none cursor-pointer"
            >
              <span className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${
                isActive 
                  ? "text-orange-600 font-bold translate-x-0 opacity-100" 
                  : isVisited 
                    ? "text-slate-500 opacity-70 group-hover:opacity-100" 
                    : "text-slate-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
              }`}>{section.label}</span>
              
              <div className="relative w-8 h-8 flex items-center justify-end">
                <span className={`absolute transition-all duration-300 rounded-full ${
                  isActive 
                    ? "w-8 h-[2.5px] bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.6)]" 
                    : isVisited 
                      ? "w-4 h-[2px] bg-slate-400 group-hover:bg-orange-500 group-hover:w-6" 
                      : "w-2 h-[2px] bg-slate-300 group-hover:bg-slate-400 group-hover:w-5"
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: HERO */}
      <section id="who-we-are" className="min-h-screen flex items-center relative border-b border-slate-200/80 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              isIdle ? "opacity-0 scale-105" : "opacity-40 scale-100"
            }`}
          />

          <video
            ref={heroVideoRef}
            src="/images/top.mp4"
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              isIdle ? "opacity-80 scale-105" : "opacity-0 scale-100"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 z-10" />
        </div>

        <div 
          style={{
            filter: `blur(${heroBlur + (isIdle ? 12 : 0)}px)`,
            opacity: isIdle ? 0 : heroOpacity,
            transform: `translateY(${heroTranslateY + (isIdle ? -30 : 0)}px)`,
            willChange: "filter, opacity, transform"
          }}
          className="max-w-7xl mx-auto px-6 py-28 relative z-20 w-full transition-all duration-1000 ease-in-out"
        >
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="text-xs font-mono tracking-wider text-orange-400 uppercase font-bold">{t.hero.sub}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] flex flex-col items-start">
              <TextReveal text={t.hero.title1} lang={lang} />
              <TextReveal text={t.hero.title2} lang={lang} className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" delayStep={0.03} />
              <TextReveal text={t.hero.title3} lang={lang} delayStep={0.02} />
            </h1>
            
            <p className="text-slate-300 max-w-lg text-base leading-relaxed font-light">{t.hero.desc}</p>
            
            <div className="pt-4">
              <button 
                onClick={() => scrollToSection("what-we-offer")} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-orange-600 hover:bg-orange-500 text-white px-9 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-2xl shadow-orange-600/40 inline-flex items-center space-x-3 cursor-pointer"
              >
                <span>{t.hero.cta}</span> 
                <span className="text-xs animate-bounce">↓</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-8 left-8 bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-700 z-30 ${
          isIdle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}>
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-[10px] font-mono tracking-widest uppercase">CINEMATIC PREVIEW MODE</span>
        </div>
      </section>

      {/* SECTION 2: SERVICES (PINNED HORIZONTAL SCROLL) */}
      <div 
        id="what-we-offer" 
        ref={serviceWrapperRef} 
        style={{ height: wrapperHeight }}
        className="relative border-b border-slate-200/80"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 w-full mb-6 shrink-0">
            <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-widest">{t.services.sub}</span>
            <div className="mt-2">
              <TextReveal text={t.services.title} lang={lang} className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight" delayStep={0.02} />
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <div 
              ref={trackRef}
              style={{ 
                transform: `translateX(${translateX}px)`,
                willChange: "transform"
              }}
              className="flex gap-8 px-6 md:px-24 w-max transition-transform duration-100 ease-out"
            >
              {serviceCardsData.map((item, idx) => (
                <FullVideoServiceCard
                  key={idx}
                  idx={idx}
                  service={item.title}
                  desc={item.desc}
                  tags={item.tags}
                  bgImg={item.bg}
                  videoSrc={item.video}
                  lang={lang}
                  onHoverChange={setIsHovered}
                />
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full mt-8 shrink-0">
            <div className="w-full h-[3px] bg-slate-200 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.max(8, progressRatio * 100)}%` }} 
                className="h-full bg-orange-600 transition-all duration-150 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🔒 SECTION 3: SUBSIDIARIES (Pinned Sticky Section) */}
      <section 
        id="subsidiaries" 
        ref={subsidiariesContainerRef}
        className="relative h-[300vh] bg-white text-slate-900 border-y border-slate-200/80"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10">
          
          {/* Header Block */}
          <div className="max-w-4xl mx-auto px-6 text-center space-y-3 z-30 shrink-0 mb-4 pt-8">
            <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-4 py-1.5 rounded-full inline-block">
              OUR GROUP MEMBERS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              {lang === "en" ? "Handle Inter Group Companies" : "บริษัทในเครือ แฮนเดิล อินเตอร์ กรุ๊ป"}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto font-normal">
              {lang === "en" 
                ? "Scroll to explore our specialized logistics subsidiaries floating along our timeline path." 
                : "เลื่อนหน้าจอเพื่อสำรวจเครือข่ายความเชี่ยวชาญของบริษัทในเครือของเรา"}
            </p>
          </div>

          {/* 🎨 Background Curved Line (เส้นโค้งสีเทามินิมอล) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-60">
            <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
              <path
                d="M-100,300 C300,100 600,500 1000,200 C1200,80 1500,400 1600,300"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              <path
                d="M-100,300 C300,100 600,500 1000,200 C1200,80 1500,400 1600,300"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* 🎴 Moving Cards Container */}
          <div className="relative w-full h-[460px] max-w-7xl mx-auto flex items-center justify-center z-20 overflow-hidden">
            {partnerLogos.map((item, index) => (
              <CurvedTimelinePartnerCardLocked
                key={index}
                idx={index}
                name={item.name}
                logoSrc={item.src}
                desc={item.desc}
                link={item.link}
                totalItems={partnerLogos.length}
                scrollYProgress={subsidiariesScrollProgress}
              />
            ))}
          </div>

          {/* Progress Indicator Guide */}
          <div className="absolute bottom-8 z-30 flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></span>
              <span>SCROLL DOWN TO EXPLORE MEMBERS</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: WORLDWIDE */}
      <section id="worldwide" className="min-h-screen flex items-center border-b border-slate-200/80 relative z-10 overflow-hidden bg-slate-900 text-white group cursor-pointer">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80" 
            alt="Global Connectivity Background" 
            className="w-full h-full object-cover opacity-75 brightness-125 contrast-110 scale-105 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:-translate-y-2 transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/30 transition-opacity duration-700 group-hover:opacity-85 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
          <div className="max-w-2xl space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-orange-500/25 border border-orange-500/40 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-orange-500/10">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
              <span className="text-xs font-mono text-orange-200 uppercase tracking-widest font-bold">{t.network.sub}</span>
            </div>

            <div className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
              <TextReveal text={t.network.title} lang={lang} delayStep={0.02} />
            </div>
            
            <p className="text-white text-sm md:text-base leading-relaxed font-normal drop-shadow">
              {t.network.desc}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <span className="text-orange-400 text-lg">🌐</span>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Global Connectivity Map Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: NEWS */}
      <section id="news" className="py-24 relative z-10 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-widest">{t.news.sub}</span>
            <div className="mt-3">
              <TextReveal text={t.news.title} lang={lang} className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" delayStep={0.03} />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((item, i) => (
              <TiltCard key={i}>
                <div 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden cursor-pointer transition-all duration-300 hover:border-orange-500/80 group shadow-lg hover:shadow-2xl h-full flex flex-col justify-between"
                >
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10" />
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">{item.date}</span>
                    <h3 className="font-bold text-base text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                      <TextReveal text={item.title} lang={lang} delayStep={0.02} />
                    </h3>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}