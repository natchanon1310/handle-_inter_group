"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { dictionary } from "../utils/dictionaries";

// 🎬 Component จัดการ ScrollReveal พื้นฐาน
function ScrollCardReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const getTransformStyle = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100 scale-100";
    if (direction === "left") return "-translate-x-16 opacity-0 scale-95";
    if (direction === "right") return "translate-x-16 opacity-0 scale-95";
    return "translate-y-12 opacity-0 scale-95";
  };

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
}

export default function SiamLinersPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);

  // 📖 E-Book Flipbook State (Section 2)
  const [currentStep, setCurrentStep] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // 🎥 Smooth Scroll-Locking Reference (Section 3)
  const lockContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lockContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  // 🌟 Phase 1: หัวข้อหลักตรงกลาง ค่อยๆ จางหายไปเมื่อเริ่มเลื่อน
  const titleOpacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 0.6, 0]);
  const titleScale = useTransform(smoothProgress, [0, 0.25], [1, 0.95]);

  // 🌟 Phase 2: แอนิเมชัน "ค่อยๆ แยกออกจากกันอย่างนุ่มนวล" (Smooth Split Reveal)
  // ฝั่งซ้าย (Content) ค่อยๆ เลื่อนแยกไปทางซ้าย
  const contentX = useTransform(smoothProgress, [0.2, 0.55], [-60, 0]);
  const contentOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);

  // ฝั่งขวา (Image) ค่อยๆ เลื่อนแยกไปทางขวา
  const imageX = useTransform(smoothProgress, [0.2, 0.55], [60, 0]);
  const imageOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);
  const imageScale = useTransform(smoothProgress, [0.2, 0.55], [0.95, 1]);

  // Selected Service Chapter (Section 3)
  const [activeServiceTab, setActiveServiceTab] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("langChange", checkLang);
    return () => window.removeEventListener("langChange", checkLang);
  }, []);

  const t = dictionary[lang] || dictionary.en;
  const detailText = t.siamLiners || {};

  const sections = useMemo(
    () => [
      { id: "overview", label: lang === "en" ? "Overview" : "ภาพรวม" },
      { id: "companyprofile", label: lang === "en" ? "Company Profile" : "เอกสารบริษัท" },
      { id: "Our service", label: lang === "en" ? "Capabilities" : "ขีดความสามารถ" },
      { id: "schedule", label: lang === "en" ? "Schedule" : "ตารางเรือ" },
      { id: "Contact Us", label: lang === "en" ? "Contact Us" : "ติดต่อเรา" },
    ],
    [lang]
  );

  // 🚢 ข้อมูลตารางเรือนำเข้า
  const scheduleData = [
    { vessel: "SINAR BROMO", voy: "058N", closing: "5-Sep", closeDay: "MON", closeTime: "17:30", etd1stL: "7-Sep", etd1stDay: "WED", closingLch: "6-Sep", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "7-Sep", etdLchDay: "WED", etaHph: "11-Sep" },
    { vessel: "MARE FRIO", voy: "208N", closing: "12-Sep", closeDay: "MON", closeTime: "17:30", etd1stL: "14-Sep", etd1stDay: "WED", closingLch: "13-Sep", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "14-Sep", etdLchDay: "WED", etaHph: "18-Sep" },
    { vessel: "SINAR BROMO", voy: "059N", closing: "19-Sep", closeDay: "MON", closeTime: "17:30", etd1stL: "21-Sep", etd1stDay: "WED", closingLch: "20-Sep", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "21-Sep", etdLchDay: "WED", etaHph: "25-Sep" },
    { vessel: "MARE FRIO", voy: "209N", closing: "26-Sep", closeDay: "MON", closeTime: "17:30", etd1stL: "28-Sep", etd1stDay: "WED", closingLch: "27-Sep", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "28-Sep", etdLchDay: "WED", etaHph: "2-Oct" },
    { vessel: "SINAR BROMO", voy: "060N", closing: "3-Oct", closeDay: "MON", closeTime: "17:30", etd1stL: "5-Oct", etd1stDay: "WED", closingLch: "4-Oct", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "5-Oct", etdLchDay: "WED", etaHph: "9-Oct" },
    { vessel: "MARE FRIO", voy: "210N", closing: "10-Oct", closeDay: "MON", closeTime: "17:30", etd1stL: "12-Oct", etd1stDay: "WED", closingLch: "11-Oct", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "12-Oct", etdLchDay: "WED", etaHph: "16-Oct" },
    { vessel: "SINAR BROMO", voy: "061N", closing: "17-Oct", closeDay: "MON", closeTime: "17:30", etd1stL: "19-Oct", etd1stDay: "WED", closingLch: "18-Oct", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "19-Oct", etdLchDay: "WED", etaHph: "23-Oct" },
    { vessel: "MARE FRIO", voy: "211N", closing: "24-Oct", closeDay: "MON", closeTime: "17:30", etd1stL: "26-Oct", etd1stDay: "WED", closingLch: "25-Oct", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "26-Oct", etdLchDay: "WED", etaHph: "30-Oct" },
    { vessel: "SINAR BROMO", voy: "062N", closing: "31-Oct", closeDay: "MON", closeTime: "17:30", etd1stL: "2-Nov", etd1stDay: "WED", closingLch: "1-Nov", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "2-Nov", etdLchDay: "WED", etaHph: "6-Nov" },
    { vessel: "MARE FRIO", voy: "212N", closing: "7-Nov", closeDay: "MON", closeTime: "17:30", etd1stL: "9-Nov", etd1stDay: "WED", closingLch: "8-Nov", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "9-Nov", etdLchDay: "WED", etaHph: "13-Nov" },
    { vessel: "SINAR BROMO", voy: "063N", closing: "14-Nov", closeDay: "MON", closeTime: "17:30", etd1stL: "16-Nov", etd1stDay: "WED", closingLch: "15-Nov", closeLchDay: "MON", closeLchTime: "9:00", etdLch: "16-Nov", etdLchDay: "WED", etaHph: "20-Nov" },
  ];

  // 📦 ข้อมูลบริการ Siam Liners ดึงค่าจาก dictionary ครบ 100%
  const completeEbookServices = useMemo(
    () => [
      {
        id: "nvocc-liner",
        tabTitle: detailText.s1_tab || (lang === "en" ? "NVOCC Line" : "สายเรือ (NVOCC)"),
        tag: detailText.s1_tag || "CORE SERVICE 01 // NVOCC OPERATOR",
        title: detailText.s1_title || (lang === "en" ? "NVOCC Carrier Services" : "สายเรือ (NVOCC)"),
        subtitle: detailText.s1_sub || "",
        desc: detailText.s1_desc || "",
        items: detailText.s1_items || [],
        icon: "🚢",
        img: "/images/shipcard.png",
      },
      {
        id: "specialized-operations",
        tabTitle: detailText.s2_tab || (lang === "en" ? "Specialized Operations" : "ปฏิบัติการเฉพาะเจาะจง"),
        tag: detailText.s2_tag || "CORE SERVICE 02 // SPECIALIZED OPERATIONS",
        title: detailText.s2_title || (lang === "en" ? "Specialized Operations" : "ปฏิบัติการเฉพาะเจาะจง"),
        subtitle: detailText.s2_sub || "",
        desc: detailText.s2_desc || "",
        items: detailText.s2_items || [],
        icon: "📦",
        img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    [detailText, lang]
  );

  const currentService = completeEbookServices[activeServiceTab];

  // ควบคุม Flipbook (Section 2)
  const goToNext = () => {
    if (isFlipping || currentStep >= 2) return;
    setIsFlipping(true);
    setFlipDirection("next");
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => setIsFlipping(false), 700);
  };

  const goToPrev = () => {
    if (isFlipping || currentStep <= 0) return;
    setIsFlipping(true);
    setFlipDirection("prev");
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => setIsFlipping(false), 700);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 2) {
          setIsPlaying(false);
          return 2;
        }
        setFlipDirection("next");
        return prev + 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 300;
          for (const section of sections) {
            const el = document.getElementById(section.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section.id);
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
  }, [isMounted, sections]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full overflow-clip bg-slate-100 text-slate-800">
      {/* Side Progress Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-6 items-end">
        {sections.map((section) => {
          const isActive = isMounted && activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group flex items-center space-x-4 focus:outline-none cursor-pointer"
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "text-cyan-600 translate-x-0 opacity-100"
                    : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
                }`}
              >
                {section.label}
              </span>
              <div className="relative w-8 h-8 flex items-center justify-end">
                <span
                  className={`absolute transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-8 h-[3px] bg-cyan-600 shadow-[0_0_12px_rgba(8,145,178,0.8)]"
                      : "w-4 h-[1.5px] bg-gray-300 group-hover:bg-cyan-500 group-hover:w-6"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* 🎯 SECTION 1: HERO HEADER */}
      <section
        id="overview"
        className="relative w-full min-h-screen h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden border-b border-slate-800"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80"
            alt="Siam Liners Background"
            className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-20 pt-20 w-full flex flex-col items-center justify-center">
          <ScrollCardReveal direction="up" delay={100}>
            <div className="inline-block bg-cyan-600/90 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                {isMounted && (detailText.heroSub || "SIAM LINERS (NVOCC)")}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-md mt-2">
              {isMounted && (detailText.heroTitle || "บริษัท สยามไลน์เนอร์ จำกัด")}
            </h1>
            <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full my-4 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-normal">
              {isMounted && detailText.heroDesc}
            </p>

            <div className="pt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => scrollToSection("companyprofile")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl shadow-cyan-600/30 inline-flex items-center space-x-3 cursor-pointer"
              >
                <span>{detailText.exploreBtn || (lang === "en" ? "EXPLORE DIGITAL BROCHURE" : "เปิดอ่านโบรชัวร์ดิจิทัล")}</span>
                <span className="animate-bounce">↓</span>
              </button>
            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* 🎯 SECTION 2: REALISTIC FLIPBOOK VIEWER */}
         // <section
        //   id="companyprofile"
        //   className="py-20 md:py-28 px-4 sm:px-8 bg-[#222327] text-white relative w-full flex flex-col items-center justify-center min-h-screen border-b border-neutral-800"
        // >
        //   <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        //     <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">
        //       Interactive Presentation
        //     </span>
        //     <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
        //       {detailText.catalogTitle || (lang === "en" ? "Siam Liners Flipbook Catalog" : "เอกสารแนะนำบริษัท สยามไลน์เนอร์ จำกัด")}
        //     </h2>
        //     <p className="text-xs text-neutral-400">
        //       {detailText.catalogSubtitle || (lang === "en" ? "Click the arrows to flip pages or use controls below." : "คลิกลูกศรด้านข้างหรือแถบควบคุมด้านล่างเพื่อเปิดพลิกหน้าเอกสาร")}
        //     </p>
        //   </div>

        //   {/* FLIPBOOK VIEWER WRAPPER */}
        //   <div className="w-full max-w-5xl relative flex items-center justify-center my-auto">
        //     <button
        //       onClick={goToPrev}
        //       disabled={currentStep === 0 || isFlipping}
        //       className={`absolute left-0 sm:-left-6 lg:-left-12 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-cyan-600 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer border border-white/20 shadow-2xl ${
        //         currentStep === 0 ? "opacity-20 cursor-not-allowed" : "hover:scale-110 active:scale-95"
        //       }`}
        //       title="Previous Page"
        //     >
        //       <span className="text-lg font-bold">‹</span>
        //     </button>

        //     <div
        //       className={`w-full transition-all duration-500 perspective-2000 flex items-center justify-center ${
        //         isZoomed ? "scale-105 sm:scale-110" : "scale-100"
        //       }`}
        //     >
        //       <div className="relative w-full max-w-[860px] min-h-[480px] sm:min-h-[560px] md:min-h-[600px] flex items-center justify-center">
        //         <AnimatePresence mode="wait">
        //           {/* STEP 0: FRONT COVER */}
        //           {currentStep === 0 && (
        //             <motion.div
        //               key="cover"
        //               initial={{ rotateY: flipDirection === "next" ? -80 : 80, opacity: 0, scale: 0.95 }}
        //               animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        //               exit={{ rotateY: -80, opacity: 0, scale: 0.95 }}
        //               transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        //               style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
        //               className="w-full max-w-[420px] h-[540px] sm:h-[580px] bg-[#0c1e38] rounded-r-2xl rounded-l-md shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-r-4 border-b-4 border-slate-700/60 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white"
        //             >
        //               <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none z-20" />
        //               <div className="relative z-10 space-y-4 text-left">
        //                 <div className="bg-white px-3 py-1 rounded-md inline-block shadow-md">
        //                   <div className="text-cyan-900 font-black text-xl tracking-wider flex items-center space-x-1">
        //                     <span>{detailText.coverBadge || "SIAM LINERS"}</span>
        //                     <span className="text-xs">🚢</span>
        //                   </div>
        //                   <div className="text-[8px] font-mono font-bold text-slate-700 tracking-tight">{detailText.coverSubBadge || "NVOCC & SHIPPING OPERATOR"}</div>
        //                 </div>

        //                 <div className="pt-2">
        //                   <h3 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
        //                     {detailText.coverTitle1 || "THE"}
        //                   </h3>
        //                   <h3 className="text-2xl sm:text-3xl font-extralight text-cyan-300 leading-tight tracking-wider">
        //                     {detailText.coverTitle2 || "EXPERIENCED"}
        //                   </h3>
        //                 </div>
        //               </div>

        //               <div className="relative z-10 my-auto py-2">
        //                 <div className="relative w-full h-52 sm:h-56 rounded-xl overflow-hidden shadow-2xl border border-white/20">
        //                   <img
        //                     src="https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80"
        //                     alt="Cargo Ocean Ship"
        //                     className="w-full h-full object-cover"
        //                   />
        //                   <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e38]/80 via-transparent to-transparent" />
        //                   <div className="absolute bottom-3 left-3 text-left">
        //                     <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
        //                       {detailText.coverSub || "NVOCC & CONTAINER SOLUTIONS"}
        //                     </span>
        //                   </div>
        //                 </div>
        //               </div>

        //               <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-300">
        //                 <span>www.handleintergroup.com</span>
        //                 <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded border border-white/20">
        //                   <span>ISO 9001</span>
        //                   <span>•</span>
        //                   <span>TIFFA</span>
        //                 </div>
        //               </div>
        //             </motion.div>
        //           )}

        //           {/* STEP 1: 2-PAGE SPREAD */}
        //           {currentStep === 1 && (
        //             <motion.div
        //               key="spread"
        //               initial={{ rotateY: flipDirection === "next" ? 70 : -70, opacity: 0 }}
        //               animate={{ rotateY: 0, opacity: 1 }}
        //               exit={{ rotateY: flipDirection === "next" ? -70 : 70, opacity: 0 }}
        //               transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        //               style={{ transformStyle: "preserve-3d" }}
        //               className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#f8fafc] text-slate-900 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-slate-300 relative overflow-hidden min-h-[540px] sm:min-h-[580px]"
        //             >
        //               <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/25 via-black/5 to-black/25 pointer-events-none z-30" />

        //               <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between text-left border-b md:border-b-0 md:border-r border-slate-200 relative bg-gradient-to-b from-white to-slate-50">
        //                 <div className="space-y-4">
        //                   <span className="text-2xl sm:text-3xl font-black text-[#1e3a8a] tracking-tight block">
        //                     {detailText.insidePageTitle || (lang === "en" ? "NVOCC Carrier Line" : "สายเรือ (NVOCC)")}
        //                   </span>
        //                   <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal pt-1">
        //                     {detailText.insidePageDesc || ""}
        //                   </p>
        //                 </div>

        //                 <div className="mt-4 w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-slate-200 shadow-md relative">
        //                   <img
        //                     src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
        //                     alt="NVOCC Vessel"
        //                     className="w-full h-full object-cover"
        //                   />
        //                 </div>

        //                 <div className="pt-3 flex justify-between items-center text-[10px] font-mono text-slate-400">
        //                   <span>SIAM LINERS (NVOCC)</span>
        //                   <span>01</span>
        //                 </div>
        //               </div>

        //               <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between text-left relative bg-gradient-to-b from-white to-slate-50">
        //                 <div className="space-y-4">
        //                   <span className="text-xl sm:text-2xl font-black text-[#1e3a8a] tracking-tight block border-b border-slate-200 pb-2">
        //                     {detailText.insideServiceHead || (lang === "en" ? "SPECIALIZED OPERATIONS" : "ปฏิบัติการเฉพาะเจาะจง")}
        //                   </span>

        //                   <div className="space-y-1">
        //                     <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center">
        //                       <span className="w-2 h-2 rounded-full bg-blue-900 mr-2 shrink-0" />
        //                       {detailText.s1_title || (lang === "en" ? "NVOCC Carrier Services" : "สายเรือ (NVOCC)")}
        //                     </h4>
        //                     <p className="text-[11px] sm:text-xs text-slate-600 pl-4 leading-relaxed font-light">
        //                       {detailText.s1_desc || ""}
        //                     </p>
        //                   </div>

        //                   <div className="space-y-1">
        //                     <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center">
        //                       <span className="w-2 h-2 rounded-full bg-blue-900 mr-2 shrink-0" />
        //                       {detailText.s2_title || (lang === "en" ? "Specialized Operations" : "ปฏิบัติการเฉพาะเจาะจง")}
        //                     </h4>
        //                     <p className="text-[11px] sm:text-xs text-slate-600 pl-4 leading-relaxed font-light">
        //                       {detailText.s2_desc || ""}
        //                     </p>
        //                   </div>

        //                   <div className="space-y-1">
        //                     <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center">
        //                       <span className="w-2 h-2 rounded-full bg-blue-900 mr-2 shrink-0" />
        //                       {lang === "en" ? "24-Hour Active Support" : "บุคลากรประสานงานตลอด 24 ชั่วโมง"}
        //                     </h4>
        //                     <p className="text-[11px] sm:text-xs text-slate-600 pl-4 leading-relaxed font-light">
        //                       {lang === "en" ? "Round-the-clock coordination and tracking team providing 24/7 live updates." : "พร้อมด้วยบุคลากรที่เชี่ยวชาญให้คำปรึกษา และความพร้อมด้านเทคโนโลยีการสื่อสาร"}
        //                     </p>
        //                   </div>
        //                 </div>

        //                 <div className="pt-3 flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-100">
        //                   <span>02</span>
        //                   <span>EXCELLENCE IN MOTION</span>
        //                 </div>
        //               </div>
        //             </motion.div>
        //           )}

        //           {/* STEP 2: BACK COVER */}
        //           {currentStep === 2 && (
        //             <motion.div
        //               key="backcover"
        //               initial={{ rotateY: flipDirection === "next" ? 80 : -80, opacity: 0, scale: 0.95 }}
        //               animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        //               exit={{ rotateY: 80, opacity: 0, scale: 0.95 }}
        //               transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        //               style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
        //               className="w-full max-w-[420px] h-[540px] sm:h-[580px] bg-gradient-to-b from-[#0a192f] via-[#0d223f] to-[#081326] rounded-l-2xl rounded-r-md shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-l-4 border-b-4 border-slate-700/60 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white"
        //             >
        //               <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/80 via-black/30 to-transparent pointer-events-none z-20" />
        //               <div className="text-center relative z-10 space-y-1">
        //                 <h3 className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase font-sans">
        //                   {detailText.backCoverTitle || "WORLDWIDE NETWORK"}
        //                 </h3>
        //               </div>

        //               <div className="relative z-10 my-auto py-2 flex items-center justify-center">
        //                 <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
        //                   <img
        //                     src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
        //                     alt="Worldwide Logistics Network"
        //                     className="w-full h-full object-cover opacity-85"
        //                   />
        //                   <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
        //                   <div className="absolute inset-0 flex items-center justify-center">
        //                     <span className="text-5xl filter drop-shadow-2xl">🌐</span>
        //                   </div>
        //                 </div>
        //               </div>

        //               <div className="relative z-10 text-left space-y-2 pt-3 border-t border-white/15 text-[10px] font-mono text-slate-300">
        //                 <div className="font-bold text-white text-xs">{isMounted && (detailText.heroTitle || "Siam Liners Co., Ltd.")}</div>
        //                 <p className="text-[9px] text-slate-400 leading-tight">
        //                   1 Handle Inter Group Building, Bangna-Trad Soi 17, Bangkok 10260 Thailand
        //                 </p>
        //                 <div className="flex justify-between items-center pt-1 text-[9px] text-cyan-300">
        //                   <span>Tel: +66 (0) 2393 2300 (Auto)</span>
        //                   <span>www.handleintergroup.com</span>
        //                 </div>
        //               </div>
        //             </motion.div>
        //           )}
        //         </AnimatePresence>
        //       </div>
        //     </div>

        //     <button
        //       onClick={goToNext}
        //       disabled={currentStep === 2 || isFlipping}
        //       className={`absolute right-0 sm:-right-6 lg:-right-12 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-cyan-600 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer border border-white/20 shadow-2xl ${
        //         currentStep === 2 ? "opacity-20 cursor-not-allowed" : "hover:scale-110 active:scale-95"
        //       }`}
        //       title="Next Page"
        //     >
        //       <span className="text-lg font-bold">›</span>
        //     </button>
        //   </div>

        //   {/* BOTTOM CONTROL TOOLBAR */}
        //   <div className="bg-black/70 border border-white/15 rounded-full px-5 py-2.5 flex items-center space-x-4 sm:space-x-6 text-white text-xs font-mono backdrop-blur-xl shadow-2xl z-20 mt-6">
        //     <button
        //       disabled={currentStep === 0}
        //       onClick={() => {
        //         setFlipDirection("prev");
        //         setCurrentStep(0);
        //       }}
        //       className="hover:text-cyan-400 disabled:opacity-30 cursor-pointer transition-colors"
        //     >
        //       |‹
        //     </button>
        //     <button
        //       disabled={currentStep === 0}
        //       onClick={goToPrev}
        //       className="hover:text-cyan-400 disabled:opacity-30 cursor-pointer transition-colors text-sm"
        //     >
        //       ‹
        //     </button>
        //     <span className="text-neutral-300 font-bold px-2">
        //       {currentStep === 0 ? "1 / 4 (Cover)" : currentStep === 1 ? "2-3 / 4 (Inside)" : "4 / 4 (Back)"}
        //     </span>
        //     <button
        //       onClick={() => setIsPlaying(!isPlaying)}
        //       className={`cursor-pointer transition-colors px-2 py-0.5 rounded-full ${
        //         isPlaying ? "bg-cyan-600 text-white" : "hover:text-cyan-400"
        //       }`}
        //     >
        //       {isPlaying ? "❚❚" : "▶"}
        //     </button>
        //     <button
        //       disabled={currentStep === 2}
        //       onClick={goToNext}
        //       className="hover:text-cyan-400 disabled:opacity-30 cursor-pointer transition-colors text-sm"
        //     >
        //       ›
        //     </button>
        //     <button
        //       disabled={currentStep === 2}
        //       onClick={() => {
        //         setFlipDirection("next");
        //         setCurrentStep(2);
        //       }}
        //       className="hover:text-cyan-400 disabled:opacity-30 cursor-pointer transition-colors"
        //     >
        //       ›|
        //     </button>
        //     <span className="w-[1px] h-4 bg-white/20" />
        //     <button
        //       onClick={() => setIsZoomed(!isZoomed)}
        //       className="hover:text-orange-400 cursor-pointer transition-colors"
        //     >
        //       {isZoomed ? "🔍-" : "🔍+"}
        //     </button>
        //   </div>
        // </section>

      //🎯 SECTION 3: SMOOTH SPLIT REVEAL (ค่อยๆ แยกออกจากกันอย่างนุ่มนวล) */}
     // <section
        id="Our service"
        ref={lockContainerRef}
        className="relative w-full h-[250vh] bg-[#FDFBF7] text-stone-900 border-b border-stone-200"
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-8 lg:px-14 z-20">
          
          {/* Background Atmosphere */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80"
              alt="Atmospheric Background"
              className="w-full h-full object-cover opacity-10 filter contrast-125 brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-[#FDFBF7]" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-200/50 rounded-full blur-[160px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[160px]" />
          </div>

          {/* 📍 SCENE 1: INITIAL CENTER TITLE */}
          <motion.div
            style={{ opacity: titleOpacity, scale: titleScale }}
            className="absolute inset-x-6 top-1/4 -translate-y-1/2 text-center max-w-4xl mx-auto space-y-3 z-10 pointer-events-none"
          >
            {/* <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.3em] text-amber-800 bg-amber-100/80 border border-amber-300/60 px-4 py-1.5 rounded-full inline-block backdrop-blur-md shadow-sm">
              {lang === "en" ? "Total Logistics Experience" : "บริการโลจิสติกส์ครบวงจร"}
            </span> */}

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-900 leading-[1.08]">
              {lang === "en" ? "Siam liner," : "สยามไลน์เนอร์"} <br />
              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {lang === "en" ? "Import and export shipping schedules." : "ตารางเรือ นำเข้า และ ส่งออก"}
              </span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
              {lang === "en"
                ? "Scroll down to experience our superior one-stop service quality and complete worldwide logistics ecosystem."
                : "เลื่อนลงเพื่อสัมผัสประสบการณ์บริการขนส่งครบวงจรมาตรฐานระดับโลก"}
            </p>

            <div className="pt-2">
              <span className="inline-block bg-stone-900 text-amber-50 font-mono font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg">
                {lang === "en" ? "Scroll Down ↓" : "เลื่อนลงเพื่อดูข้อมูล ↓"}
              </span>
            </div>
          </motion.div>

          {/* 📍 SCENE 2: REVEAL CONTENT + SMOOTH SPLIT */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-20 h-[84vh]">
            
            {/* 👈 ฝั่งซ้าย: ข้อมูลเนื้อหาบริการ (ค่อยๆ แยกออกไปทางซ้ายแบบ Smooth) */}
            <motion.div
              style={{ opacity: contentOpacity, x: contentX }}
              className="lg:col-span-7 text-left flex flex-col justify-between h-full py-2 pr-2 overflow-y-auto"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentService.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <div className="inline-block font-mono text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-300/80 px-3.5 py-1 rounded-full shadow-sm">
                    {currentService.tag}
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                      {currentService.title}
                    </h3>
                    <h4 className="text-xs sm:text-sm font-mono font-bold text-amber-700 pt-0.5">
                      {currentService.subtitle}
                    </h4>
                  </div>

                  {/* ข้อความบรรยายเต็ม */}
                  <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                    {currentService.desc}
                  </p>

                  {/* รายการบริการย่อยทั้งหมด */}
                  {currentService.items && currentService.items.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="bg-[#FAF6EE]/95 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2 backdrop-blur-md shadow-sm">
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
                          <span>{detailText.scopeTitle || (lang === "en" ? "Service Capabilities" : "จุดเด่นและการให้บริการ")}</span>
                        </h5>
                        <div className="grid grid-cols-1 gap-2 pt-0.5">
                          {currentService.items.map((item: string, iIdx: number) => (
                            <div key={iIdx} className="flex items-start space-x-2 text-xs sm:text-sm text-stone-700">
                              <span className="text-amber-700 font-bold text-xs mt-0.5">✓</span>
                              <span className="leading-relaxed whitespace-normal break-words">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => scrollToSection("schedule")}
                      className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-3 rounded-full transition-all duration-300 shadow-xl shadow-amber-900/20 hover:scale-105 cursor-pointer active:scale-95"
                    >
                      <span>{detailText.vesselBtn || (lang === "en" ? "View Vessel Schedule ↗" : "ดูตารางการเดินเรือ ↗")}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 🎛️ Interactive Service Switcher Tabs */}
              <div className="pt-3 border-t border-stone-200 space-y-1.5 mt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block">
                  {detailText.selectServiceTitle || (lang === "en" ? "Select Core Logistics Service :" : "เลือกบริการหลัก :")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {completeEbookServices.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => setActiveServiceTab(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 cursor-pointer ${
                        activeServiceTab === idx
                          ? "bg-stone-900 text-amber-50 font-extrabold shadow-md scale-105"
                          : "bg-white text-stone-600 hover:bg-amber-100/60 hover:text-stone-900 border border-stone-200"
                      }`}
                    >
                      {ch.icon} {ch.tabTitle}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 👉 ฝั่งขวา: รูปภาพประกอบ (ค่อยๆ แยกออกไปทางขวาแบบ Smooth) */}
            <div className="lg:col-span-5 flex items-center justify-center relative h-full">
              <motion.div
                style={{
                  opacity: imageOpacity,
                  x: imageX,
                  scale: imageScale,
                }}
                className="relative w-full max-w-[380px] sm:max-w-[440px] flex items-center justify-center"
              >
                <div className="relative w-full aspect-[4/5] max-h-[460px] sm:max-h-[500px] flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/30 via-orange-200/30 to-yellow-200/20 rounded-full blur-2xl opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(120,53,15,0.14)] border border-stone-200/90 group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={currentService.img}
                      alt={currentService.title}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-5 left-5 right-5 text-left space-y-1">
                      <span className="text-[10px] font-mono text-amber-300 font-extrabold uppercase tracking-widest block drop-shadow-md">
                        {isMounted && (detailText.heroTitle || "SIAM LINERS CO., LTD.")}
                      </span>
                      <h5 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug drop-shadow-lg">
                        {currentService.title}
                      </h5>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* 🎯 SECTION 4: IMPORT VESSEL SCHEDULE TABLE */}
      <section id="schedule" className="py-24 px-6 max-w-7xl mx-auto relative w-full bg-[#111827] text-slate-100 rounded-[36px] shadow-2xl my-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">
            LIVE IMPORT SCHEDULE
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            {isMounted && (detailText.scheduleTitle || "ตารางเรือนำเข้า (Import Vessel Schedule)")}
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            {isMounted && (detailText.scheduleSubtitle || "ตารางการออกเดินเรือประจำสัปดาห์สำหรับสินค้าขาเข้า")}
          </p>
        </div>

        {/* Table Frame Container */}
        <ScrollCardReveal direction="up">
          <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-cyan-950/80 text-cyan-300 font-mono text-[11px] uppercase border-b border-cyan-800/50">
                    <th className="p-3.5 font-bold">VESSEL NAME</th>
                    <th className="p-3.5 font-bold">VOY</th>
                    <th className="p-3.5 font-bold">CLOSING DATE</th>
                    <th className="p-3.5 font-bold text-center">TIME</th>
                    <th className="p-3.5 font-bold">ETD 1STL</th>
                    <th className="p-3.5 font-bold">DATE</th>
                    <th className="p-3.5 font-bold">CLOSING DATE</th>
                    <th className="p-3.5 font-bold text-center">TIME</th>
                    <th className="p-3.5 font-bold">ETD LCH</th>
                    <th className="p-3.5 font-bold">DATE</th>
                    <th className="p-3.5 font-bold text-cyan-400 bg-cyan-900/30">ETA HPH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {scheduleData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-800/50 transition-colors duration-150 group"
                    >
                      <td className="p-3.5 font-bold text-red-400 whitespace-nowrap group-hover:text-cyan-300">
                        {row.vessel}
                      </td>
                      <td className="p-3.5 font-bold text-white">{row.voy}</td>
                      <td className="p-3.5 whitespace-nowrap">{row.closing} <span className="text-slate-500">({row.closeDay})</span></td>
                      <td className="p-3.5 text-center text-slate-400">{row.closeTime}</td>
                      <td className="p-3.5 whitespace-nowrap">{row.etd1stL}</td>
                      <td className="p-3.5 text-slate-400">{row.etd1stDay}</td>
                      <td className="p-3.5 whitespace-nowrap">{row.closingLch} <span className="text-slate-500">({row.closeLchDay})</span></td>
                      <td className="p-3.5 text-center text-slate-400">{row.closeLchTime}</td>
                      <td className="p-3.5 whitespace-nowrap">{row.etdLch}</td>
                      <td className="p-3.5 text-slate-400">{row.etdLchDay}</td>
                      <td className="p-3.5 font-bold text-cyan-300 bg-cyan-950/30 whitespace-nowrap">
                        {row.etaHph}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 px-2 flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-900 mt-2">
              <span>{isMounted && (detailText.scheduleNote || "* Schedules are subject to change based on weather and port congestion.")}</span>
              <span className="text-cyan-400 font-bold">{isMounted && (detailText.scheduleMatrixLabel || "Siam Liners Vessel Matrix")}</span>
            </div>
          </div>
        </ScrollCardReveal>
      </section>

      {/* 🎯 SECTION 5: EXCLUSIVE CONTACT CARDS */}
      <section
        id="Contact Us"
        className="relative w-full min-h-screen bg-[#FDFBF7] text-stone-900 py-20 lg:py-28 px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-center overflow-hidden border-t border-stone-200"
      >
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center relative z-10 space-y-12">
          
          {/* Header Title */}
          <ScrollCardReveal direction="up">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-amber-50/80 border border-amber-200/60 px-6 py-2 rounded-full text-xs font-bold text-amber-800 font-mono shadow-sm backdrop-blur-md">
                <i className="fa-solid fa-headset text-amber-700"></i>
                <span>{detailText.contactBadge || (lang === "en" ? "Direct Contact Directory" : "ติดต่อเรา — บริษัท สยามไลน์เนอร์ จำกัด")}</span>
              </div>
              
              <h3 className="font-black text-stone-900 text-3xl sm:text-5xl tracking-tight">
                {isMounted && (detailText.contactTitle || "บริษัท สยามไลน์เนอร์ จำกัด")}
              </h3>
              
              <p className="text-xs sm:text-sm text-stone-500 font-mono max-w-2xl mx-auto">
                Center Hotline: <span className="text-amber-800 font-bold">{isMounted && detailText.centerPhone}</span> | admincenter@handleintergroup.com
              </p>
            </div>
          </ScrollCardReveal>

          {/* 🎴 Soft Cream Asymmetrical Arch Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
            
            {/* 🎴 Sales Department Card */}
            <ScrollCardReveal direction="left" delay={100} className="h-full">
              <div className="h-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-amber-200/70 hover:border-amber-400/80 rounded-tr-[70px] sm:rounded-tr-[110px] rounded-bl-[70px] sm:rounded-bl-[110px] rounded-tl-3xl rounded-br-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(217,119,6,0.08)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-xl shadow-sm">
                      <i className="fa-solid fa-briefcase"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-stone-900 text-lg sm:text-xl">
                        {isMounted && detailText.salesDept}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono">{isMounted && detailText.salesSub}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-mono text-left">
                    {isMounted && detailText.salesContacts?.map((contact: { name: string; phone: string }, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/80 p-3.5 rounded-xl border border-amber-100 shadow-sm">
                        <span className="text-stone-800 font-bold">{contact.name}</span>
                        <a href={`tel:${contact.phone}`} className="text-amber-800 font-bold hover:underline">
                          <i className="fa-solid fa-phone text-[10px] mr-1.5"></i>
                          {contact.phone}
                        </a>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-amber-200/60 mt-3">
                      <span className="text-[10px] text-stone-500 uppercase block mb-1">Sales Email:</span>
                      <a href={`mailto:${isMounted ? detailText.salesEmail : ""}`} className="text-stone-900 hover:text-amber-700 font-bold text-xs underline decoration-amber-500/40">
                        {isMounted && detailText.salesEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCardReveal>

            {/* 🎴 CS (Customer Service) Department Card */}
            <ScrollCardReveal direction="right" delay={200} className="h-full">
              <div className="h-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-amber-200/70 hover:border-amber-400/80 rounded-tr-[70px] sm:rounded-tr-[110px] rounded-bl-[70px] sm:rounded-bl-[110px] rounded-tl-3xl rounded-br-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(217,119,6,0.08)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-xl shadow-sm">
                      <i className="fa-solid fa-users-gear"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-stone-900 text-lg sm:text-xl">
                        {isMounted && detailText.csDept}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono">{isMounted && detailText.csSub}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-mono text-left">
                    {isMounted && detailText.csContacts?.map((contact: { name: string; phone: string }, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/80 p-3.5 rounded-xl border border-amber-100 shadow-sm">
                        <span className="text-stone-800 font-bold">{contact.name}</span>
                        <a href={`tel:${contact.phone}`} className="text-amber-800 font-bold hover:underline">
                          <i className="fa-solid fa-phone text-[10px] mr-1.5"></i>
                          {contact.phone}
                        </a>
                      </div>
                    ))}

                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-amber-200/60 mt-3">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase block">Export Email:</span>
                        <a href={`mailto:${isMounted ? detailText.exportEmail : ""}`} className="text-stone-900 hover:text-amber-700 font-bold text-xs truncate block">
                          {isMounted && detailText.exportEmail}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase block">Import Email:</span>
                        <a href={`mailto:${isMounted ? detailText.importEmail : ""}`} className="text-stone-900 hover:text-amber-700 font-bold text-xs truncate block">
                          {isMounted && detailText.importEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCardReveal>

          </div>

          {/* ปุ่ม Back to About Us */}
          <ScrollCardReveal direction="up" delay={300}>
            <div className="pt-6 text-center">
              <Link
                href="/aboutus"
                className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-amber-800 text-amber-50 border border-stone-800 text-xs font-mono font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <i className="fa-solid fa-arrow-left text-[10px] mr-1"></i>
                <span>{detailText.backAboutBtn || (lang === "en" ? "Back to About Us" : "กลับสู่หน้าเกี่ยวกับเรา")}</span>
              </Link>
            </div>
          </ScrollCardReveal>

        </div>
      </section>
    </div>
  );
}