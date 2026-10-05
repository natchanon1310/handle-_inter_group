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

export default function HandleInterConsolidationPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // 🌟 Phase 2: แอนิเมชัน Smooth Split Reveal
  const contentX = useTransform(smoothProgress, [0.2, 0.55], [-60, 0]);
  const contentOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);

  const imageX = useTransform(smoothProgress, [0.2, 0.55], [60, 0]);
  const imageOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);
  const imageScale = useTransform(smoothProgress, [0.2, 0.55], [0.95, 1]);

  // Selected Service Chapter (Section 3)
  const [activeServiceTab, setActiveServiceTab] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";
      if (savedLang) {
        setLang(savedLang);
      } else {
        setLang("en");
      }
    };
    checkLang();
    window.addEventListener("langChange", checkLang);
    return () => window.removeEventListener("langChange", checkLang);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const t = dictionary[lang] || dictionary.en;
  const detailText = t.consolidation || dictionary.en.consolidation || {};

  const sections = useMemo(
    () => [
      { id: "overview", label: lang === "en" ? "Overview" : "ภาพรวม" },
      { id: "companyprofile", label: lang === "en" ? "Company Profile" : "เอกสารบริษัท" },
      { id: "Our service", label: lang === "en" ? "Capabilities" : "ขีดความสามารถ" },
      { id: "Contact Us", label: lang === "en" ? "Contact Us" : "ติดต่อเรา" },
    ],
    [lang]
  );

  // 📦 ดึงข้อมูลบริการ 4 ด้านจาก dictionary
  const completeEbookServices = useMemo(
    () => [
      {
        id: "ocean-freight",
        tabTitle: detailText.s1_tab || "Ocean Freight",
        tag: detailText.s1_tag || "CORE SERVICE 01 // SEA FREIGHT",
        title: detailText.s1_title || "Ocean Freight Solutions",
        subtitle: detailText.s1_sub || "",
        desc: detailText.s1_desc || "",
        items: detailText.s1_items || [],
        icon: "🚢",
        img: "/images/shipcard.png",
      },
      {
        id: "air-freight",
        tabTitle: detailText.s2_tab || "Air Freight",
        tag: detailText.s2_tag || "CORE SERVICE 02 // AIR FREIGHT",
        title: detailText.s2_title || "Air Freight Services",
        subtitle: detailText.s2_sub || "",
        desc: detailText.s2_desc || "",
        items: detailText.s2_items || [],
        icon: "✈️",
        img: "/images/cardair.png",
      },
      {
        id: "trucking-packing",
        tabTitle: detailText.s3_tab || "Packing & Transport",
        tag: detailText.s3_tag || "CORE SERVICE 03 // PACKING & TRANSPORT",
        title: detailText.s3_title || "Trucking & Packing Services",
        subtitle: detailText.s3_sub || "",
        desc: detailText.s3_desc || "",
        items: detailText.s3_items || [],
        icon: "📦",
        img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: "customs-clearance",
        tabTitle: detailText.s4_tab || "Customs Clearance",
        tag: detailText.s4_tag || "CORE SERVICE 04 // CUSTOMS CLEARANCE",
        title: detailText.s4_title || "Customs Clearance Services",
        subtitle: detailText.s4_sub || "",
        desc: detailText.s4_desc || "",
        items: detailText.s4_items || [],
        icon: "📑",
        img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    [detailText]
  );

  const currentService = completeEbookServices[activeServiceTab];

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
                    ? "text-orange-600 translate-x-0 opacity-100"
                    : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
                }`}
              >
                {section.label}
              </span>
              <div className="relative w-8 h-8 flex items-center justify-end">
                <span
                  className={`absolute transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-8 h-[3px] bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.8)]"
                      : "w-4 h-[1.5px] bg-gray-300 group-hover:bg-orange-400 group-hover:w-6"
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
        className="relative w-full min-h-[100svh] h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden border-b border-slate-800"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/images/handleinterlogistichere.jpeg"
            alt="Handle Inter Consolidation Background"
            className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        </div>

        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 text-center space-y-5 sm:space-y-6 relative z-20 pt-16 sm:pt-20 flex flex-col items-center justify-center">
          <ScrollCardReveal direction="up" delay={100}>
            <div className="inline-block bg-orange-600/90 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                {isMounted && (detailText.heroSub || "HANDLE INTER CONSOLIDATION")}
              </span>
            </div>
            <h1 className="w-full max-w-none whitespace-nowrap text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md mt-2">
  {isMounted &&
    (detailText.heroTitle || "HANDLE INTER CONSOLIDATION CO., LTD.")}
</h1>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full my-4" />
            <p className="text-slate-200 w-full max-w-3xl mx-auto text-sm sm:text-base md:text-2xl lg:text-4xl leading-relaxed font-normal px-2">
              {isMounted && detailText.heroDesc}
            </p>

            <div className="pt-6">
              <button
                onClick={() => scrollToSection("companyprofile")}
                className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-600/30 inline-flex items-center space-x-3 cursor-pointer"
              >
                <span>{detailText.exploreBtn || (lang === "en" ? "EXPLORE DIGITAL BROCHURE" : "เปิดอ่านโบรชัวร์ดิจิทัล")}</span>
                <span className="animate-bounce">↓</span>
              </button>
            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* 🎯 SECTION 2: HEYZINE FLIPBOOK VIEWER */}
      <section
        id="companyprofile"
        className="py-12 sm:py-16 md:py-24 px-3 sm:px-6 md:px-8 bg-[#222327]  text-white relative w-full flex flex-col items-center justify-center min-h-screen border-b border-neutral-800"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block font-mono">
            Interactive Presentation
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {detailText.catalogTitle || "Handle Inter Consolidation Catalog"}
          </h2>
          <p className="text-xs text-neutral-400">
            {detailText.catalogSubtitle || (lang === "en" ? "Browse our official digital company brochure below." : "คลิกเปิดอ่านโบรชัวร์ดิจิทัลของบริษัทได้จากหน้าต่างด้านล่าง")}
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto bg-black/40 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/10 p-2 sm:p-4 backdrop-blur-md">
          <div className="relative w-full h-[400px] sm:h-[520px] md:h-[620px] lg:h-[700px] rounded-xl overflow-hidden">
            <iframe
              src="https://heyzine.com/flip-book/a37ef833fa.html"
              title="Handle Inter Consolidation Flipbook"
              className="w-full h-full border-0 rounded-xl"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* 🎯 SECTION 3: SMOOTH SPLIT REVEAL */}
      <section
        id="Our service"
        ref={lockContainerRef}
        className="relative w-full min-h-screen lg:h-[250vh] bg-[#FDFBF7] text-stone-900 border-b border-stone-200"
      >
        <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-14 py-14 sm:py-16 lg:py-0 z-20">
          
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80"
              alt="Atmospheric Background"
              className="w-full h-full object-cover opacity-10 filter contrast-125 brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-[#FDFBF7]" />
            <div className="absolute top-1/4 left-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-amber-200/50 rounded-full blur-[100px] lg:blur-[160px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-orange-100/60 rounded-full blur-[100px] lg:blur-[160px]" />
          </div>

         <motion.div
  style={{ opacity: titleOpacity, scale: titleScale }}
  className="hidden lg:block absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-3rem)] text-center space-y-3 z-10 pointer-events-none"
>
  <h2 className="w-full text-center font-black tracking-tight text-stone-900 leading-[1.08]">
    <span className="block whitespace-nowrap text-[clamp(1.2rem,6vw,4.5rem)]">
      HANDLE INTER CONSOLIDATION CO. LTD.
    </span>

    <span className="block mt-2 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-4xl text-transparent sm:text-6xl md:text-7xl">
      {lang === "en" ? "PROFESSIONAL" : "มืออาชีพ"}
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

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center relative z-20 h-auto lg:h-[84vh] py-4 lg:py-0">
            
            <motion.div
              style={{
                opacity: isMobile ? 1 : contentOpacity,
                x: isMobile ? 0 : contentX,
              }}
              className="lg:col-span-7 text-left flex flex-col justify-center min-h-0 w-full"
            >
              <div className="w-full max-w-2xl mx-auto lg:mx-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentService.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    <div className="inline-block max-w-full font-mono text-[9px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-300/80 px-3 sm:px-3.5 py-1 rounded-full shadow-sm break-words">
                      {currentService.tag}
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black text-stone-900 tracking-tight leading-[1.1] break-words">
                        {currentService.title}
                      </h3>
                      <h4 className="text-[10px] sm:text-xs md:text-sm font-mono font-bold text-amber-700 pt-1 break-words">
                        {currentService.subtitle}
                      </h4>
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm md:text-[15px] leading-relaxed font-normal break-words max-w-xl">
                      {currentService.desc}
                    </p>

                    {currentService.items && currentService.items.length > 0 && (
                      <div className="pt-1">
                        <div className="bg-[#FAF6EE]/95 border border-amber-200/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-sm">
                          <h5 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)] shrink-0" />
                            <span>
                              {detailText.scopeTitle ||
                                (lang === "en"
                                  ? "Service Scope & Capabilities"
                                  : "ขอบเขตการให้บริการ")}
                            </span>
                          </h5>
                          <div className="grid grid-cols-1 gap-1.5">
                            {currentService.items.map((item: string, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="flex items-start gap-2 text-[11px] sm:text-xs md:text-sm text-stone-700 min-w-0"
                              >
                                <span className="text-amber-700 font-bold shrink-0">✓</span>
                                <span className="leading-relaxed whitespace-normal break-words min-w-0">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        onClick={() => scrollToSection("Contact Us")}
                        className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-amber-50 font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider px-5 sm:px-7 py-3 rounded-full transition-all duration-300 shadow-xl shadow-amber-900/20 hover:scale-105 cursor-pointer active:scale-95"
                      >
                        {detailText.inquireBtn ||
                          (lang === "en"
                            ? "Inquire Service Now ↗"
                            : "ติดต่อสอบถามบริการ ↗")}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 sm:mt-7 pt-4 border-t border-stone-200">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-2.5">
                    {detailText.selectServiceTitle ||
                      (lang === "en"
                        ? "Select Core Logistics Service :"
                        : "เลือกบริการหลัก :")}
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {completeEbookServices.map((ch, idx) => (
                      <button
                        key={ch.id}
                        onClick={() => setActiveServiceTab(idx)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono transition-all duration-300 cursor-pointer ${
                          activeServiceTab === idx
                            ? "bg-stone-900 text-amber-50 font-extrabold shadow-md"
                            : "bg-white text-stone-600 hover:bg-amber-100/60 hover:text-stone-900 border border-stone-200"
                        }`}
                      >
                        {ch.icon} {ch.tabTitle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-5 flex items-center justify-center relative w-full">
              <motion.div
                style={{
                  opacity: isMobile ? 1 : imageOpacity,
                  x: isMobile ? 0 : imageX,
                  scale: isMobile ? 1 : imageScale,
                }}
                className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[390px] lg:max-w-[410px] flex items-center justify-center"
              >
                <div className="relative w-full aspect-[4/5] max-h-[360px] sm:max-h-[420px] md:max-h-[480px] lg:max-h-[520px] flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/30 via-orange-200/30 to-yellow-200/20 rounded-full blur-2xl opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-full h-full rounded-[24px] sm:rounded-[30px] lg:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(120,53,15,0.14)] border border-stone-200/90 group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={currentService.img}
                      alt={currentService.title}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-left space-y-1">
                      <span className="text-[8px] sm:text-[10px] font-mono text-amber-300 font-extrabold uppercase tracking-widest block drop-shadow-md break-words">
                        {isMounted && (detailText.heroTitle || "HANDLE INTER CONSOLIDATION CO., LTD.")}
                      </span>
                      <h5 className="text-sm sm:text-base lg:text-lg font-black text-white tracking-tight leading-snug drop-shadow-lg break-words">
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

      {/* 🎯 SECTION 4: EXCLUSIVE CONTACT CARDS */}
      <section
        id="Contact Us"
        className="relative w-full min-h-screen bg-[#FDFBF7] text-stone-900 py-14 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-16 flex flex-col justify-center items-center overflow-hidden border-t border-stone-200"
      >
        <div className="absolute top-1/3 left-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-amber-200/40 rounded-full blur-[100px] lg:blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-orange-100/60 rounded-full blur-[100px] lg:blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
          
          <ScrollCardReveal direction="up">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-amber-50/80 border border-amber-200/60 px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold text-amber-800 font-mono shadow-sm backdrop-blur-md">
                <i className="fa-solid fa-address-card text-amber-700"></i>
                <span>{detailText.contactBadge || (lang === "en" ? "Contact Information" : "ข้อมูลติดต่อฝ่ายการตลาดและประสานงาน")}</span>
              </div>
              
              <h3 className="font-black text-stone-900 text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight break-words">
                {isMounted && (detailText.heroTitle || (lang === "en" ? "Handle Inter Consolidation Co., Ltd." : "บริษัท แฮนเดิล อินเตอร์ คอนโซลลิเดชั่น จำกัด"))}
              </h3>
              
              <p className="text-xs sm:text-sm text-stone-500 font-mono max-w-2xl mx-auto">
                Hotline: 0-2393-2300 (Auto) | Fax: 0-2393-7307-10 | admincenter@handleintergroup.com
              </p>
            </div>
          </ScrollCardReveal>

          {/* 🎴 Business Card */}
          <div className="max-w-4xl w-full mx-auto">
            <ScrollCardReveal direction="up" delay={100} className="h-full">
              <div className="h-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-amber-200/70 hover:border-amber-400/80 rounded-[32px] sm:rounded-tr-[90px] sm:rounded-bl-[90px] sm:rounded-tl-3xl sm:rounded-br-3xl p-5 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(217,119,6,0.08)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:-translate-y-1.5 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-8">
                  
                  <div className="w-full sm:w-5/12 flex flex-col items-center justify-center text-center space-y-3 bg-white/80 border border-amber-100 rounded-3xl sm:rounded-tr-[40px] sm:rounded-bl-[40px] sm:rounded-tl-xl sm:rounded-br-xl p-5 shadow-sm">
                    <img
                      src="/images/handle inter con.png"
                      alt="Handle Inter Consolidation Logo"
                      className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <div>
                      <h4 className="font-black text-stone-900 text-sm tracking-wider uppercase font-mono">
                        HANDLE INTER CONSOL
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium tracking-tight">
                        Console & LCL Cargo Hub
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block w-[1.5px] bg-gradient-to-b from-amber-300 via-amber-400/50 to-transparent rounded-full my-1" />
                  <div className="block sm:hidden w-full h-[1.5px] bg-gradient-to-r from-amber-300 via-amber-400/50 to-transparent rounded-full" />

                  <div className="w-full sm:w-7/12 min-w-0 space-y-4 text-left flex flex-col justify-center">
                    <div>
                      <h3 className="font-black text-stone-900 text-lg sm:text-xl md:text-2xl tracking-tight leading-snug break-words">
                        {isMounted && detailText.contact_name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 tracking-wide mt-1 font-mono">
                        {isMounted && detailText.contact_position}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600 font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <span className="line-clamp-2 text-stone-700 break-words">
                          {detailText.contactHub || (lang === "en" ? "Bangkok & Worldwide Hub" : "กรุงเทพฯ และศูนย์กลางการรวมตู้สินค้าระดับโลก")}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-phone"></i>
                        </div>
                        <a
                          href={`tel:${isMounted ? detailText.contact_phone : ""}`}
                          className="hover:text-amber-700 transition-colors font-mono text-stone-800 font-semibold break-all text-xs sm:text-sm"
                        >
                          {isMounted && detailText.contact_phone}
                        </a>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-envelope"></i>
                        </div>
                        <a
                          href={`mailto:${isMounted ? detailText.contact_email : ""}`}
                          className="hover:text-amber-700 transition-colors break-all font-mono text-stone-800 font-semibold text-xs sm:text-sm"
                        >
                          {isMounted && detailText.contact_email}
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollCardReveal>
          </div>

          <ScrollCardReveal direction="up" delay={200}>
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