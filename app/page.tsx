"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { dictionary } from "./utils/dictionaries"; // 🌟 Import dictionary แยกมาจากไฟล์ภายนอก

// 🎬 Component ตัวอักษรโผล่มาทีละตัว
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

// 🎬 Component การ์ดแบนเนอร์กลุ่มธุรกิจ
function BusinessGroupVideoBannerCard({
  title,
  subtitle,
  videoSrc,
  tag,
  lang = "en",
  surroundingLogos,
}: {
  title: string;
  subtitle: string;
  videoSrc: string;
  tag: string;
  lang?: "en" | "th";
  centerLogo?: { name: string; src?: string; link?: string };
  surroundingLogos?: Array<{ name: string; src: string; link?: string }>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // ดึงโลโก้สำหรับล้อมรอบ 6 วง
  const surroundingItems = useMemo(() => surroundingLogos || [], [surroundingLogos]);
  const totalLogos = surroundingItems.length;

  return (
    <div 
      className="relative w-full min-h-[380px] md:min-h-[440px] rounded-[32px] overflow-hidden border border-slate-300/80 bg-black text-slate-900 shadow-2xl group transition-all duration-500 hover:border-orange-500 hover:shadow-orange-500/30 flex flex-col md:flex-row items-center justify-between"
      onMouseEnter={() => {
        setIsHovered(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* 🎥 Background Video Player (โชว์วิดีโอสว่างคมชัด 100%) */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
          isHovered ? "scale-105 opacity-100" : "scale-100 opacity-90"
        }`}
      />

      {/* 🌤️ Soft Translucent Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/70 z-10 pointer-events-none" />

      {/* 📝 Content Layout */}
      <div className="relative z-20 w-full h-full p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 my-auto">
        
        {/* 🌟 โครงสร้างวงกลมล้อมรอบ */}
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] shrink-0 flex items-center justify-center">
          
          {/* เส้นออร่าเรืองแสงวงกลมด้านหลัง */}
          <div className="absolute inset-2 rounded-full border border-white/30 animate-pulse pointer-events-none" />

          {/* 🌀 วงกลมโลโก้ล้อมรอบ */}
          {surroundingItems.map((logo, idx) => {
            const radius = 40; // % ระยะห่างรัศมีจากศูนย์กลาง
            const angleDegree = -90 + (idx * (360 / Math.max(1, totalLogos)));
            const angleRad = (angleDegree * Math.PI) / 180;

            const topPercent = 50 + radius * Math.sin(angleRad);
            const leftPercent = 50 + radius * Math.cos(angleRad);

            const circleContent = (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: idx % 2 === 0 ? [0, -5, 0] : [0, 5, 0],
                  x: idx % 3 === 0 ? [0, 3, 0] : [0, -3, 0]
                }}
                transition={{
                  opacity: { duration: 0.4, delay: idx * 0.06 },
                  scale: { duration: 0.4, delay: idx * 0.06 },
                  y: { duration: 3 + (idx % 3), repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 3.5 + (idx % 2), repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.18, zIndex: 50 }}
                style={{
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                }}
                className="absolute w-20 h-20 sm:w-24 sm:h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 backdrop-blur-md border-2 border-white shadow-2xl flex items-center justify-center p-2 transition-colors duration-300 hover:bg-white hover:border-orange-500 cursor-pointer group/circle"
                title={logo.name}
              >
                {logo.src ? (
                  <img src={logo.src} alt={logo.name} className="w-full h-full object-contain rounded-full transition-transform group-hover/circle:scale-105" />
                ) : (
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 font-mono text-center leading-tight uppercase px-1">
                    {logo.name}
                  </span>
                )}
              </motion.div>
            );

            return logo.link ? (
              <Link href={logo.link} key={idx}>
                {circleContent}
              </Link>
            ) : (
              <div key={idx}>{circleContent}</div>
            );
          })}

        </div>

        {/* 📄 ฝั่งขวา: ข้อความกลุ่มธุรกิจ */}
        <div className="flex-1 space-y-4 text-left">
          <div className="flex items-center space-x-3">
            <span className="bg-orange-600 text-white font-mono text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md">
              {tag}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md group-hover:text-orange-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed max-w-xl drop-shadow">
              {subtitle}
            </p>
          </div>

          <div className="pt-4">
            <button className="bg-white/20 hover:bg-orange-600 text-white border border-white/40 hover:border-orange-600 px-6 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 shadow-lg backdrop-blur-md cursor-pointer">
              <span>{lang === "th" ? "สำรวจกลุ่มธุรกิจ" : "EXPLORE DIVISION"}</span>
              <span>↗</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// 🎬 Component การ์ดบริษัทในเครือ (Curved Timeline - สีเทาโปร่งแสง)
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
    ["250%", "-270%"]
  );

  const yVal = idx % 2 === 0 ? [40, -60, 30] : [-40, 60, -20];
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
        <div className="bg-slate-900/75 backdrop-blur-xl rounded-[32px] border border-white/20 p-7 sm:p-8 md:p-9 shadow-2xl shadow-black/60 w-[290px] sm:w-[350px] md:w-[380px] flex flex-col justify-between transition-all duration-300 hover:shadow-orange-500/30 hover:border-orange-500 hover:scale-105 cursor-pointer select-none group">
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-3xl md:text-4xl font-black font-mono text-orange-400 tracking-tighter">
              '{String(idx + 1).padStart(2, "0")}
            </span>
            <span className="bg-orange-500/20 border border-orange-500/30 text-[10px] font-mono text-orange-300 px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
              SUBSIDIARY
            </span>
          </div>

          <div className="my-2 py-2 flex items-center justify-start min-h-[85px] bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <img
              src={logoSrc}
              alt={name}
              className="h-14 md:h-18 w-auto max-w-[90%] object-contain drop-shadow-md transition-all duration-300 group-hover:scale-105 origin-left"
            />
          </div>

          <div className="space-y-2 text-left mb-2">
            <h3 className="text-lg md:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-orange-400 transition-colors">
              {name}
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal line-clamp-2">
              {desc}
            </p>
          </div>

          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              EXPLORE HUB
            </span>
            <span className="bg-orange-600 group-hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-1.5 shadow-lg shadow-orange-600/30">
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

  // State สำหรับ News Slider การ์ด YouTube
  const [currentNewsPageIndex, setCurrentNewsIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Ref & State สำหรับ Pinned Service Slider (หัวข้อที่ 3)
  const serviceWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState("2500px");
  const [progressRatio, setProgressRatio] = useState(0);

  // Ref & Scroll Engine สำหรับ Worldwide Section (หัวข้อที่ 5)
  const worldwideWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: worldwideScrollProgress } = useScroll({
    target: worldwideWrapperRef,
    offset: ["start end", "end start"],
  });
  const worldwideX = useTransform(worldwideScrollProgress, [0, 1], ["-40%", "40%"]);

  // State & Ref สำหรับ Hero Section
  const [heroBlur, setHeroBlur] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroTranslateY, setHeroTranslateY] = useState(0);

  const [isIdle, setIsIdle] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔒 Ref & Scroll Engine สำหรับ Subsidiaries Section (ตรึงล็อกหน้าจอ)
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
    { id: "business-groups", label: lang === "en" ? "Business Groups" : "กลุ่มธุรกิจ" },
    { id: "what-we-offer", label: lang === "en" ? "Services" : "บริการ" },
    { id: "subsidiaries", label: lang === "en" ? "Subsidiaries" : "บริษัทในเครือ" },
    { id: "worldwide", label: lang === "en" ? "Network" : "เครือข่าย" },
    { id: "news", label: lang === "en" ? "Update" : "ข่าวสาร" },
  ], [lang]);

  // 📹 ข้อมูลแบนเนอร์วิดีโอ 3 กลุ่มธุรกิจ (สลับสองภาษาผ่าน Dictionary + มี 6 โลโก้ล้อมรอบ)
  const businessGroupBanners = [
    {
      title: t.businessGroups.freightTitle.replace(/^[0-9.]+\s*/, ""), // ตัดเลข 1. ด้านหน้าออก
      subtitle: t.businessGroups.freightSub,
      videoSrc: "/images/handle fright.mp4",
      tag: "FREIGHT GROUP",
      logos: [
        { name: "H.I.T. INTERCON", src: "/images/1725e41.png", link: "/H-I-T-INTERCON" },
        { name: "CSL CONSOL LINK", src: "/images/consol-link.png", link: "/console-link" },
        { name: "HANDLE EXPRESS", src: "/images/handleinter express.png", link: "/" },
        { name: "HANDLE LOGISTICS", src: "/images/handle inter logistic.png", link: "/" },
        { name: "ALL INTER GLOBAL", src: "/images/all inter global.png", link: "/" },
        { name: "HANDLE inter CONSOLIDATION", src: "/images/handle inter con.png", link: "/handle-inter-consolidation" }
      ]
    },
    {
      title: t.businessGroups.shippingTitle.replace(/^[0-9.]+\s*/, ""), // ตัดเลข 2. ด้านหน้าออก
      subtitle: t.businessGroups.shippingSub,
      videoSrc: "/images/ship.mp4",
      tag: "SHIPPING GROUP",
      logos: [
        { name: "APS SHIPPING", src: "/images/aps.png", link: "siam-liners" },
        { name: "SIAM LINERS", src: "/images/siam liner.png", link: "siam-liners" },
      
      ]
    },
    {
      title: t.businessGroups.tradingTitle.replace(/^[0-9.]+\s*/, ""), // ตัดเลข 3. ด้านหน้าออก
      subtitle: t.businessGroups.tradingSub,
      videoSrc: "/images/total trading.mp4",
      tag: "TRADING GROUP",
      logos: [
        { name: "/2 SUPPLLY", src: "/images/2usubply.png", link: "#" },
        { name: "ATE TOOLS", src: "/images/ate.png", link: "#" },
        { name: "APS", src: "/images/aps.png", link: "#" },
        { name: "ALL SUPLY", src: "/images/all suply.png", link: "#" },
       
        
      ]
    }
  ];

  const serviceCardsData = [
    {
      title: lang === "en" ? "Sea Freight" : "ขนส่งทางทะเล",
      desc: lang === "en" ? "Comprehensive ocean freight solutions with international container tracking." : "บริการขนส่งสินค้าทางเรือครอบคลุมทั่วโลก ปลอดภัย พร้อมระบบติดตาม",
      tags: ["SEA", "CONTAINER", "INTERNATIONAL"],
      bg: "/images/shipcard.png",
      video: "images/shipcard.mp4"
    },
    {
      title: lang === "en" ? "Air Freight" : "ขนส่งทางอากาศ",
      desc: lang === "en" ? "Express air cargo services for time-critical international deliveries." : "จัดส่งสินค้ารวดเร็วทันใจทางเครื่องบิน ตอบโจทย์ทุกเวลาเร่งด่วน",
      tags: ["AIR", "EXPRESS", "CARGO"],
      bg: "/images/cardair.png",
      video: "images/aircard.mp4"
    },
    {
      title: lang === "en" ? "Land Transport" : "ขนส่งทางบก",
      desc: lang === "en" ? "Cross-border and domestic trucking network with maximum safety." : "เครือข่ายรถบรรทุกขนส่งภายในประเทศและข้ามแดนอย่างมีประสิทธิภาพ",
      tags: ["TRUCK", "DOMESTIC", "CROSS-BORDER"],
      bg: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
      video: "images/containnercard.mp4"
    },
    {
      title: lang === "en" ? "Warehousing" : "คลังสินค้า",
      desc: lang === "en" ? "Modern warehouse management with real-time inventory control." : "ระบบจัดเก็บและบริหารคลังสินค้าอัจฉริยะ ตรวจสอบได้แบบเรียลไทม์",
      tags: ["STORAGE", "LOGISTICS", "SMART"],
      bg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      video: "images/inventorycard.mp4"
    },
    {
      title: lang === "en" ? "Customs Clearance" : "พิธีการศุลกากร",
      desc: lang === "en" ? "Seamless import-export documentation by certified specialists." : "จัดการเอกสารนำเข้า-ส่งออกอย่างถูกต้องรวดเร็ว โดยผู้เชี่ยวชาญ",
      tags: ["CUSTOMS", "EXPORT", "IMPORT"],
      bg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      video: "images/customscard.mp4"
    },
    {
      title: lang === "en" ? "Project Cargo" : "สินค้าโครงการ",
      desc: lang === "en" ? "Specialized heavy-lift and oversized cargo handling." : "การดูแลขนส่งเครื่องจักรขนาดใหญ่และสินค้าโครงการพิเศษครบวงจร",
      tags: ["PROJECT", "HEAVY", "SPECIAL"],
      bg: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      video: "images/projectcard.mp4"
    }
  ];

  const partnerLogos = [
    { name: "H.I.T. INTERCON", src: "/images/1725e41.png", desc: "Total Ocean & Air Freight Solutions with international network connectivity.", link: "/H-I-T-INTERCON" },
    { name: "HANDLE INTER CONSOLIDATION", src: "/images/handle inter con.png", desc: "Expert LCL Consolidation Hub & Container Warehouse Facility.", link: "/handle-inter-consolidation" },
    { name: "HANDLE INTER LOGISTICS", src: "/images/handle inter logistic.png", desc: "Comprehensive Logistics Management & Domestic Trucking Fleet.", link: "/handle-inter-logistics" },
    { name: "CONSOLE LINK", src: "/images/consol-link.png", desc: "Digital Freight & Trade Connectivity Solutions for Modern Logistics.", link: "/console-link" },
    { name: "SIAM LINERS", src: "/images/siam liner.png", desc: "NVOCC Liner & Vessel Schedules across Southeast Asia paths.", link: "/siam-liners" },
  ];

  const youtubeNewsSlides = [
    {
      category: "HANDLE INTER GROUP",
      num: "01",
      title: lang === "en" ? "Handle Inter Group Official Corporate Overview" : "แนะนำบริษัท แฮนเดิล อินเตอร์ กรุ๊ป จำกัด",
      desc: lang === "en" 
        ? "Discover our 30+ years journey of delivering world-class total logistics and international supply chain solutions." 
        : "ทำความรู้จัก แฮนเดิล อินเตอร์ กรุ๊ป ผู้ให้บริการโลจิสติกส์ครบวงจรชั้นนำของไทย พร้อมเครือข่ายระดับโลก",
      youtubeId: "9DqG0ji2Ufo",
      tag: "OVERVIEW"
    },
    {
      category: "EXECUTIVE TEAM",
      num: "02",
      title: lang === "en" ? "Management Vision & Executive Leadership" : "HANDLE ทีมงานผู้บริหาร",
      desc: lang === "en" 
        ? "Experienced management teams dedicated to delivering seamless import & export consultation with high standards." 
        : "ทีมผู้บริหารบริษัทในเครือ แฮนเดิล อินเตอร์กรุ๊ป ที่มีความเชี่ยวชาญ พร้อมให้คำปรึกษาและเลือกสรรโซลูชันที่มีประสิทธิภาพสูงสุด",
      youtubeId: "Ebx_vXGqKDM",
      tag: "MANAGEMENT"
    },
    {
      category: "INTERNATIONAL LOGISTICS",
      num: "03",
      title: lang === "en" ? "Worldwide Shipping & Supply Chain Network" : "ระบบการจัดการโลจิสติกส์ระหว่างประเทศ",
      desc: lang === "en" 
        ? "Connecting strategic international trade routes with precise ocean, air, and land transportation solutions." 
        : "เชื่อมต่อทุกเส้นทางการค้าสำคัญทั่วโลก ขนส่งปลอดภัยด้วยมาตรฐานระดับสากล",
      youtubeId: "5s8dQ-3IDec",
      tag: "NETWORK"
    },
    {
      category: "SERVICES HUB",
      num: "04",
      title: lang === "en" ? "Total Integrated Freight Forwarding Services" : "บริการรับจัดการขนส่งสินค้าระหว่างประเทศ",
      desc: lang === "en" 
        ? "End-to-end cargo logistics handling including customs brokerage, warehousing, and door-to-door delivery." 
        : "บริการรับจัดการขนส่งสินค้าระหว่างประเทศแบบครอบคลุม พิธีการศุลกากร และระบบคลังสินค้าอัจฉริยะ",
      youtubeId: "uH8ld90yKU8",
      tag: "FREIGHT"
    },
    {
      category: "CONSOLIDATION",
      num: "05",
      title: lang === "en" ? "LCL Cargo Consolidation & Warehouse Operations" : "ศูนย์รวบรวมตู้สินค้า คอนโซลิเดชั่น",
      desc: lang === "en" 
        ? "Optimized LCL consolidation routes for SMEs with fixed weekly vessel sailing frequencies." 
        : "บริการรวบรวมสินค้าไม่เต็มตู้ (LCL) สำหรับธุรกิจ SMEs พร้อมตารางเรือออกตรงเวลาประจำสัปดาห์",
      youtubeId: "65UXKVDA_aA",
      tag: "CONSOLE"
    },
    {
      category: "FLEET & TRUCKING",
      num: "06",
      title: lang === "en" ? "Cross-Border & Domestic Trucking Logistics" : "ระบบการขนส่งทางบกและฟลีตรถบรรทุก",
      desc: lang === "en" 
        ? "Modern fleet operations supporting domestic distribution and cross-border transport across ASEAN." 
        : "ฟลีตรถบรรทุกและหัวลากคอนเทนเนอร์ รองรับการขนส่งภายในประเทศและข้ามแดนอย่างปลอดภัย",
      youtubeId: "9VciOx5jz-g",
      tag: "TRANSPORT"
    },
    {
      category: "HANDLE QUE SYSTEM",
      num: "07",
      title: lang === "en" ? "Handle QUE Container Smart Queue Management" : "Handle QUE ระบบจองคิวรับส่งสินค้า",
      desc: lang === "en" 
        ? "Innovative digital queue management platform optimizing container handling and reducing wait times." 
        : "นวัตกรรมระบบจองคิวการเข้ารับและส่งตู้สินค้าของ แฮนเดิล อินเตอร์ กรุ๊ป เพื่อความรวดเร็วและแม่นยำ",
      youtubeId: "cJils0Svzeo",
      tag: "INNOVATION"
    },
    {
      category: "OPERATIONS",
      num: "08",
      title: lang === "en" ? "High-Performance Logistics Standards" : "มาตรฐานการปฏิบัติงานและบริการระดับมืออาชีพ",
      desc: lang === "en" 
        ? "Excellence in operational handling, continuous human resource development, and customer-first care." 
        : "ยกระดับคุณภาพบริการ ความมุ่งมั่น และความใส่ใจในทุกขั้นตอนการขนส่งของลูกค้า",
      youtubeId: "hg82QdVCpU4",
      tag: "STANDARDS"
    }
  ];

  // 🌟 คำนวณการจัดกลุ่มการ์ดสำหรับหน้าละ 3 ใบ (สำหรับสไลเดอร์ในหัวข้อข่าวสาร)
  const itemsPerPage = 3;
  const newsPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < youtubeNewsSlides.length; i += itemsPerPage) {
      pages.push(youtubeNewsSlides.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [youtubeNewsSlides]);

  const handleNextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsPages.length);
  };

  const handlePrevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsPages.length) % newsPages.length);
  };

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

          // 2. Pinned Horizontal Scroll การ์ดบริการ (หัวข้อที่ 3)
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

  // 🔄 ระบบ Auto Play สำหรับ YouTube News Slider
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsPages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, newsPages.length]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setVisitedSections((prev) => ({ ...prev, [id]: true }));
  };

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
            src="/images/toppage.mp4"
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
                onClick={() => scrollToSection("business-groups")} 
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

      {/* 🌟 NEW SECTION: BUSINESS GROUPS (หัวข้อที่ 2) */}
      <section 
        id="business-groups" 
        className="py-24 bg-gradient-to-b from-sky-100/60 via-blue-50/50 to-slate-100/80 text-slate-900 border-b border-sky-200/60 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-orange-500 text-white px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest">
                {t.businessGroups.sub}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              {t.businessGroups.title}
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl font-normal leading-relaxed">
              {t.businessGroups.desc}
            </p>
          </div>

          {/* 🎴 3 Business Video Banner Cards Stack */}
          <div className="flex flex-col gap-8">
            {businessGroupBanners.map((banner, idx) => (
              <BusinessGroupVideoBannerCard
                key={idx}
                title={banner.title}
                subtitle={banner.subtitle}
                videoSrc={banner.videoSrc}
                tag={banner.tag}
                lang={lang}
                surroundingLogos={banner.logos}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: SERVICES (PINNED HORIZONTAL SCROLL) */}
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

      {/* 🔒 SECTION: SUBSIDIARIES (Pinned Sticky Section - ปรับภาพพื้นหลังเรือใบพอดีสเกลหน้าจอ 100%) */}
      <section 
        id="subsidiaries" 
        ref={subsidiariesContainerRef}
        className="relative h-[450vh] w-full bg-slate-950 text-white border-y border-slate-200/80"
      >
        {/* 🔒 Sticky Locked Viewport Container */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center overflow-hidden z-20 py-10">
          
          {/* 🖼️ Background Image Cover (ปรับสเกลภาพเรือใบให้พอดีหน้าจอ w-full h-full object-cover 100%) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden w-full h-full">
            <img 
              src="/images/shiip.png" 
              alt="Subsidiaries Sailing Ship Background" 
              className="w-full h-full object-cover opacity-100 brightness-120 contrast-105 scale-150"
            />
            {/* Overlay ช่วยให้อ่านข้อความและมองเห็นการ์ดชัดขึ้น */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/70 z-10" />
          </div>

          {/* Header Block */}
          <div className="max-w-4xl mx-auto px-6 text-center space-y-3 z-30 shrink-0 pt-2">
            <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-widest bg-slate-900/80 border border-orange-500/40 px-4 py-1.5 rounded-full inline-block backdrop-blur-md shadow-md">
              OUR GROUP MEMBERS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              {lang === "en" ? "Handle Inter Group Companies" : "บริษัทในเครือ แฮนเดิล อินเตอร์ กรุ๊ป"}
            </h2>
            <p className="text-slate-200 text-xs md:text-sm max-w-xl mx-auto font-normal drop-shadow">
              {lang === "en" 
                ? "Scroll to explore our specialized logistics subsidiaries floating along our timeline path." 
                : "เลื่อนหน้าจอเพื่อสำรวจเครือข่ายความเชี่ยวชาญของบริษัทในเครือของเรา"}
            </p>
          </div>

          {/* 🎨 Background Curved Line */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-40">
            <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
              <path
                d="M-100,300 C300,100 600,500 1000,200 C1200,80 1500,400 1600,300"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              <path
                d="M-100,300 C300,100 600,500 1000,200 C1200,80 1500,400 1600,300"
                stroke="#fdba74"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* 🎴 Moving Cards Container */}
          <div className="relative w-full h-[420px] sm:h-[450px] max-w-7xl mx-auto flex items-center justify-center z-20 overflow-hidden my-auto">
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
          <div className="z-30 flex flex-col items-center space-y-3 shrink-0 pb-2">
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
              <span>SCROLL DOWN TO EXPLORE MEMBERS</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: WORLDWIDE (หัวข้อที่ 4: แบ็คกราวด์มืด + การ์ดสีเทาโปร่งแสง + เลื่อนจากซ้ายไปขวา) */}
      <section 
        id="worldwide" 
        ref={worldwideWrapperRef}
        className="min-h-screen flex items-center border-b border-slate-200/80 relative z-10 overflow-hidden bg-slate-950 text-white group cursor-pointer py-24"
      >
        {/* 🖤 Translucent Overlay Background (นำแบ็คกราวด์ดีไซน์มืดแบบหัวข้อที่ 5 มาใส่) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80" 
            alt="International Connectivity Background" 
            className="w-full h-full object-cover opacity-60 brightness-90 contrast-110 scale-105 transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
          {/* 🎴 Motion Container เลื่อนจากซ้ายไปขวา (Left to Right Motion) */}
          <motion.div 
            style={{ x: worldwideX }}
            className="max-w-2xl space-y-6 text-left bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[36px] shadow-2xl shadow-black/50"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-500/25 border border-orange-500/40 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-orange-500/10">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
              <span className="text-xs font-mono text-orange-200 uppercase tracking-widest font-bold">{t.network.sub}</span>
            </div>

            <div className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
              <TextReveal text={t.network.title} lang={lang} delayStep={0.02} />
            </div>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal drop-shadow">
              {t.network.desc}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <span className="text-orange-400 text-lg">🌐</span>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  International Connectivity Map Active
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 SECTION 5: NEWS SLIDER (หัวข้อที่ 5) */}
     
      <section 
        id="news" 
        className="min-h-screen py-24 flex flex-col justify-center items-center relative z-10 bg-slate-50 text-slate-900 overflow-hidden border-t border-slate-200/80"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="max-w-7xl mx-auto px-6 w-full space-y-12 my-auto">
          
          {/* Header Row: Title & Navigation Control Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-3 text-left">
              <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-widest bg-orange-100 border border-orange-200 px-4 py-1.5 rounded-full inline-block shadow-sm">
                {t.news.sub}
              </span>
              <div className="mt-2">
                <TextReveal 
                  text={t.news.title} 
                  lang={lang} 
                  className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight" 
                  delayStep={0.03} 
                />
              </div>
            </div>

            {/* 🎛️ Navigation Arrow Control Buttons (ปุ่มเลื่อนการ์ดซ้าย-ขวา) */}
            <div className="flex items-center space-x-3 self-start md:self-auto">
              <button
                onClick={handlePrevNews}
                className="w-12 h-12 rounded-full bg-white hover:bg-orange-500 border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-white flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md hover:shadow-orange-500/30 hover:scale-105 active:scale-95 cursor-pointer"
                title="Previous Slide"
              >
                ←
              </button>
              <button
                onClick={handleNextNews}
                className="w-12 h-12 rounded-full bg-white hover:bg-orange-500 border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-white flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md hover:shadow-orange-500/30 hover:scale-105 active:scale-95 cursor-pointer"
                title="Next Slide"
              >
                →
              </button>
            </div>
          </div>

          {/* 🖼️ Catalog Video Gallery Grid Container (การ์ดสไตล์สว่าง คมชัด) */}
          <div className="relative min-h-[440px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNewsPageIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {newsPages[currentNewsPageIndex]?.map((slide, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col justify-between transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/15 hover:-translate-y-1.5 cursor-pointer"
                  >
                    {/* YouTube Video Container */}
                    <div className="relative w-full aspect-video bg-black overflow-hidden border-b border-slate-100">
                      <iframe
                        src={`https://www.youtube.com/embed/${slide.youtubeId}?rel=0`}
                        title={slide.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-white/20 text-orange-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {slide.category}
                      </div>
                    </div>

                    {/* Details Content */}
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-3 text-left bg-white">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono text-orange-600 font-bold">
                          <span>{slide.tag}</span>
                          <span>{slide.num}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {slide.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed font-normal line-clamp-2">
                          {slide.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center space-x-1.5 text-red-500 font-bold">
                          <span>▶</span>
                          <span>OFFICIAL VIDEO</span>
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform text-slate-900 group-hover:text-orange-600 font-bold">
                          PLAY ↗
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 🎛️ Navigation Pagination Dots */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            {newsPages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentNewsIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentNewsPageIndex === dotIdx
                    ? "w-8 h-2.5 bg-orange-600 shadow-md shadow-orange-600/30"
                    : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                title={`Go to page ${dotIdx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

