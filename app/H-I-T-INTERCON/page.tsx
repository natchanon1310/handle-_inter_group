"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { dictionary } from "../utils/dictionaries";

// ============================================================
// 🎬 Scroll Reveal Component
// ============================================================

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
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransformStyle = () => {
    if (isVisible) {
      return "translate-x-0 translate-y-0 opacity-100 scale-100";
    }

    if (direction === "left") {
      return "-translate-x-16 opacity-0 scale-95";
    }

    if (direction === "right") {
      return "translate-x-16 opacity-0 scale-95";
    }

    return "translate-y-12 opacity-0 scale-95";
  };

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform-gpu transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================
// 🏢 H.I.T. INTERCON PAGE
// ============================================================

export default function HitInterconPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);

  // ============================================================
  // 🎥 Smooth Scroll-Locking Reference
  // ============================================================

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

  // ============================================================
  // 🌟 Scroll Animation
  // ============================================================

  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.25],
    [1, 0.6, 0]
  );

  const titleScale = useTransform(
    smoothProgress,
    [0, 0.25],
    [1, 0.95]
  );

  const contentX = useTransform(
    smoothProgress,
    [0.2, 0.55],
    [-60, 0]
  );

  const contentOpacity = useTransform(
    smoothProgress,
    [0.2, 0.5],
    [0, 1]
  );

  const imageX = useTransform(
    smoothProgress,
    [0.2, 0.55],
    [60, 0]
  );

  const imageOpacity = useTransform(
    smoothProgress,
    [0.2, 0.5],
    [0, 1]
  );

  const imageScale = useTransform(
    smoothProgress,
    [0.2, 0.55],
    [0.95, 1]
  );

  // ============================================================
  // 🎛️ Active Service
  // ============================================================

  const [activeServiceTab, setActiveServiceTab] = useState<number>(0);

  // ============================================================
  // 🌐 Language
  // ============================================================

  useEffect(() => {
    setIsMounted(true);

    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";

      if (savedLang === "en" || savedLang === "th") {
        setLang(savedLang);
      } else {
        setLang("en");
      }
    };

    checkLang();

    window.addEventListener("langChange", checkLang);

    return () => {
      window.removeEventListener("langChange", checkLang);
    };
  }, []);

  const t = dictionary[lang] || dictionary.en;

  const detailText =
    t.hitIntercon || dictionary.en.hitIntercon || {};

  // ============================================================
  // 📍 Sections
  // ============================================================

  const sections = useMemo(
    () => [
      {
        id: "overview",
        label: lang === "en" ? "Overview" : "ภาพรวม",
      },
      {
        id: "companyprofile",
        label:
          lang === "en"
            ? "Company Profile"
            : "เอกสารบริษัท",
      },
      {
        id: "Our service",
        label:
          lang === "en"
            ? "Capabilities"
            : "ขีดความสามารถ",
      },
      {
        id: "Contact Us",
        label:
          lang === "en"
            ? "Contact Us"
            : "ติดต่อเรา",
      },
    ],
    [lang]
  );

  // ============================================================
  // 📦 Services
  // ============================================================

  const completeEbookServices = useMemo(
    () => [
      {
        id: "ocean-freight",
        tabTitle:
          detailText.s1_tab || "Ocean Freight",
        tag:
          detailText.s1_tag ||
          "CORE SERVICE 01 // SEA FREIGHT",
        title:
          detailText.s1_title ||
          "Ocean Freight Solutions",
        subtitle:
          detailText.s1_sub || "",
        desc:
          detailText.s1_desc || "",
        items:
          detailText.s1_items || [],
        icon: "🚢",
        img: "/images/shipcard.png",
      },

      {
        id: "air-freight",
        tabTitle:
          detailText.s2_tab || "Air Freight",
        tag:
          detailText.s2_tag ||
          "CORE SERVICE 02 // AIR FREIGHT",
        title:
          detailText.s2_title ||
          "Air Freight Services",
        subtitle:
          detailText.s2_sub || "",
        desc:
          detailText.s2_desc || "",
        items:
          detailText.s2_items || [],
        icon: "✈️",
        img: "/images/cardair.png",
      },

      {
        id: "lcl-consolidation",
        tabTitle:
          detailText.s3_tab ||
          "LCL Consolidation",
        tag:
          detailText.s3_tag ||
          "CORE SERVICE 03 // LCL CONSOLIDATION",
        title:
          detailText.s3_title ||
          "LCL Cargo Consolidation",
        subtitle:
          detailText.s3_sub || "",
        desc:
          detailText.s3_desc || "",
        items:
          detailText.s3_items || [],
        icon: "🏢",
        img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      },

      {
        id: "trucking-fleet",
        tabTitle:
          detailText.s4_tab ||
          "Land Transport",
        tag:
          detailText.s4_tag ||
          "CORE SERVICE 04 // LAND TRANSPORT",
        title:
          detailText.s4_title ||
          "Land Transportation",
        subtitle:
          detailText.s4_sub || "",
        desc:
          detailText.s4_desc || "",
        items:
          detailText.s4_items || [],
        icon: "🚛",
        img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      },

      {
        id: "customs-brokerage",
        tabTitle:
          detailText.s5_tab ||
          "Customs Clearance",
        tag:
          detailText.s5_tag ||
          "CORE SERVICE 05 // CUSTOMS CLEARANCE",
        title:
          detailText.s5_title ||
          "Customs Clearance & Brokerage",
        subtitle:
          detailText.s5_sub || "",
        desc:
          detailText.s5_desc || "",
        items:
          detailText.s5_items || [],
        icon: "📑",
        img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    [detailText]
  );

  const currentService =
    completeEbookServices[activeServiceTab];

  // ============================================================
  // 📜 Scroll Tracking
  // ============================================================

  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition =
            window.scrollY + 300;

          for (const section of sections) {
            const el = document.getElementById(
              section.id
            );

            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;

              if (
                scrollPosition >= top &&
                scrollPosition < top + height
              ) {
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

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [isMounted, sections]);

  // ============================================================
  // 🔗 Scroll To Section
  // ============================================================

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // ============================================================
  // 🎨 Render
  // ============================================================

  return (
    <div className="relative w-full overflow-clip bg-slate-100 text-slate-800">

      {/* ====================================================== */}
      {/* SIDE PROGRESS DOTS                                     */}
      {/* ====================================================== */}

      <div className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-5 lg:space-y-6 items-end">
        {sections.map((section) => {
          const isActive =
            isMounted &&
            activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() =>
                scrollToSection(section.id)
              }
              className="group flex items-center space-x-3 lg:space-x-4 focus:outline-none cursor-pointer"
            >
              <span
                className={`text-[10px] lg:text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "text-orange-600 translate-x-0 opacity-100"
                    : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
                }`}
              >
                {section.label}
              </span>

              <div className="relative w-6 lg:w-8 h-8 flex items-center justify-end">
                <span
                  className={`absolute transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-6 lg:w-8 h-[3px] bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.8)]"
                      : "w-3 lg:w-4 h-[1.5px] bg-gray-300 group-hover:bg-orange-400 group-hover:w-5 lg:group-hover:w-6"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ====================================================== */}
      {/* SECTION 1 — HERO                                      */}
      {/* ====================================================== */}

      <section
        id="overview"
        className="relative w-full min-h-[100svh] h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden border-b border-slate-800"
      >
        {/* Hero Background */}

        <div className="absolute inset-0 z-0">
          <img
            src="/images/hithero.jpeg"
            alt="HIT Intercon Logistics Hub"
            className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        </div>

        {/* Hero Content */}

        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 text-center space-y-5 sm:space-y-6 relative z-20 pt-16 sm:pt-20 flex flex-col items-center justify-center">
          <ScrollCardReveal
            direction="up"
            delay={100}
            className="w-full"
          >
            <div className="inline-block bg-orange-600/90 backdrop-blur-md px-4 sm:px-5 py-1.5 rounded-full shadow-lg mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest font-mono">
                {isMounted &&
                  (detailText.heroSub ||
                    "H.I.T. INTERCON")}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md mt-2 px-2 break-words">
              {isMounted &&
                (detailText.heroTitle ||
                  "H.I.T. INTERCON CO., LTD.")}
            </h1>

            <div className="w-16 sm:w-20 h-1 bg-orange-500 mx-auto rounded-full my-4" />

            <p className="text-slate-200 w-full max-w-3xl mx-auto text-base sm:text-lg md:text-2xl lg:text-4xl leading-relaxed font-normal px-2">
              {isMounted &&
                detailText.heroDesc}
            </p>

            <div className="pt-4 sm:pt-6 flex flex-wrap gap-3 sm:gap-4 justify-center px-2">
              <button
                onClick={() =>
                  scrollToSection(
                    "companyprofile"
                  )
                }
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-600/30 inline-flex items-center space-x-3 cursor-pointer text-center"
              >
                <span>
                  {detailText.exploreBtn ||
                    (lang === "en"
                      ? "EXPLORE DIGITAL BROCHURE"
                      : "เปิดอ่านโบรชัวร์ดิจิทัล")}
                </span>

                <span className="animate-bounce">
                  ↓
                </span>
              </button>
            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SECTION 2 — HEYZINE FLIPBOOK                         */}
      {/* ====================================================== */}

      <section
        id="companyprofile"
        className="py-14 sm:py-16 md:py-24 px-3 sm:px-6 md:px-8 bg-[#222327] text-white relative w-full flex flex-col items-center justify-center min-h-screen border-b border-neutral-800"
      >
        <div className="text-center w-full max-w-2xl mx-auto space-y-2 mb-6 sm:mb-8 px-2">
          <span className="text-[10px] sm:text-[11px] font-bold text-orange-400 uppercase tracking-widest block font-mono">
            Interactive Presentation
          </span>

          <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {detailText.catalogTitle ||
              "H.I.T. Intercon Flipbook Catalog"}
          </h2>

          <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
            {detailText.catalogSubtitle ||
              (lang === "en"
                ? "Browse our official digital company brochure below."
                : "คลิกเปิดอ่านโบรชัวร์ดิจิทัลของบริษัทได้จากหน้าต่างด้านล่าง")}
          </p>
        </div>

        {/* Flipbook */}

        <div className="w-full max-w-5xl mx-auto bg-black/40 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/10 p-1.5 sm:p-3 md:p-4 backdrop-blur-md">
          <div className="relative w-full h-[420px] sm:h-[560px] md:h-[680px] lg:h-[700px] rounded-lg sm:rounded-xl overflow-hidden">
            <iframe
              src="https://heyzine.com/flip-book/8f31c9cb40.html"
              title="H.I.T. Intercon Flipbook"
              className="w-full h-full border-0 rounded-xl"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SECTION 3 — SERVICES                                  */}
      {/* ====================================================== */}

      <section
        id="Our service"
        ref={lockContainerRef}
        className="relative w-full h-[220vh] sm:h-[250vh] bg-[#FDFBF7] text-stone-900 border-b border-stone-200"
      >
        <div className="sticky top-0 h-[100svh] min-h-[620px] w-full flex items-center justify-center overflow-hidden px-4 sm:px-8 lg:px-14 z-20">

          {/* Background Atmosphere */}

          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80"
              alt="Atmospheric Background"
              className="w-full h-full object-cover opacity-10 filter contrast-125 brightness-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-[#FDFBF7]" />

            <div className="absolute top-1/4 left-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-amber-200/50 rounded-full blur-[100px] sm:blur-[130px] lg:blur-[160px]" />

            <div className="absolute bottom-1/4 right-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-orange-100/60 rounded-full blur-[100px] sm:blur-[130px] lg:blur-[160px]" />
          </div>

          {/* ================================================== */}
          {/* SCENE 1 — CENTER TITLE                            */}
          {/* ================================================== */}

          <motion.div
            style={{
              opacity: titleOpacity,
              scale: titleScale,
            }}
            className="absolute inset-x-4 sm:inset-x-6 top-[22%] sm:top-1/4 -translate-y-1/2 text-center w-auto max-w-4xl mx-auto space-y-3 z-10 pointer-events-none px-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-stone-900 leading-[1.08]">
              {lang === "en"
                ? "The Experienced,"
                : "มากมายประสบการณ์,"}{" "}
              <br />

              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {lang === "en"
                  ? "H.I.T. Intercon Co. Ltd.."
                  : "บริษัท เอช.ไอ.ที. อินเตอร์คอน จำกัด"}
              </span>
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm md:text-lg max-w-xl mx-auto font-normal leading-relaxed px-2">
              {lang === "en"
                ? "Scroll down to experience our superior one-stop service quality and complete worldwide logistics ecosystem."
                : "เลื่อนลงเพื่อสัมผัสประสบการณ์บริการขนส่งครบวงจรมาตรฐานระดับโลก"}
            </p>

            <div className="pt-2">
              <span className="inline-block bg-stone-900 text-amber-50 font-mono font-bold text-[10px] sm:text-xs md:text-sm px-5 sm:px-6 py-2.5 rounded-full shadow-lg">
                {lang === "en"
                  ? "Scroll Down ↓"
                  : "เลื่อนลงเพื่อดูข้อมูล ↓"}
              </span>
            </div>
          </motion.div>

          {/* ================================================== */}
          {/* SCENE 2 — CONTENT                                 */}
          {/* ================================================== */}

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center relative z-20 h-[88vh] lg:h-[84vh] overflow-hidden">

            {/* ================================================= */}
            {/* LEFT — SERVICE CONTENT                           */}
            {/* ================================================= */}

           <motion.div
  style={{
    opacity: contentOpacity,
    x: contentX,
  }}
  className="lg:col-span-7 text-left flex flex-col justify-center min-h-0 py-2 lg:py-4 pr-0 lg:pr-6"
>
  <div className="w-full max-w-2xl mx-auto lg:mx-0">

    {/* SERVICE CONTENT */}
    <AnimatePresence mode="wait">
      <motion.div
        key={currentService.id}
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -12,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="space-y-3"
      >

        {/* Service Tag */}
        <div className="inline-block max-w-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-300/80 px-3 sm:px-3.5 py-1 rounded-full shadow-sm break-words">
          {currentService.tag}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.6rem] font-black text-stone-900 tracking-tight leading-[1.1] break-words">
            {currentService.title}
          </h3>

          <h4 className="text-[10px] sm:text-xs md:text-sm font-mono font-bold text-amber-700 pt-1 break-words">
            {currentService.subtitle}
          </h4>
        </div>

        {/* Description */}
        <p className="text-stone-700 text-xs sm:text-sm md:text-[15px] leading-relaxed font-normal break-words max-w-xl">
          {currentService.desc}
        </p>

        {/* Service Scope */}
        {currentService.items.length > 0 && (
          <div className="pt-1">
            <div className="bg-[#FAF6EE]/95 border border-amber-200/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-sm">

              <h5 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)] shrink-0" />

                <span>
                  {detailText.scopeTitle ||
                    (lang === "en"
                      ? "Service Scope & Capabilities"
                      : "ขอบเขตการให้บริการ")}
                </span>
              </h5>

              <div className="grid grid-cols-1 gap-1.5">
                {currentService.items.map(
                  (item: string, iIdx: number) => (
                    <div
                      key={iIdx}
                      className="flex items-start gap-2 text-[11px] sm:text-xs md:text-sm text-stone-700 min-w-0"
                    >
                      <span className="text-amber-700 font-bold text-xs mt-0.5 shrink-0">
                        ✓
                      </span>

                      <span className="leading-relaxed whitespace-normal break-words min-w-0">
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>

            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pt-1">
          <button
            onClick={() => scrollToSection("Contact Us")}
            className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider px-5 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-xl shadow-amber-900/20 hover:scale-105 cursor-pointer active:scale-95"
          >
            {detailText.inquireBtn ||
              (lang === "en"
                ? "Inquire Service Now ↗"
                : "ติดต่อสอบถามบริการ ↗")}
          </button>
        </div>

      </motion.div>
    </AnimatePresence>

    {/* SERVICE TABS */}
    <div className="mt-5 sm:mt-6 pt-3 border-t border-stone-200">

      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-2">
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
                ? "bg-stone-900 text-amber-50 font-extrabold shadow-md scale-105"
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

            {/* ================================================= */}
            {/* RIGHT — SERVICE IMAGE                            */}
            {/* ================================================= */}

            <div className="lg:col-span-5 flex items-center justify-center relative h-full min-h-0">
              <motion.div
                style={{
                  opacity: imageOpacity,
                  x: imageX,
                  scale: imageScale,
                }}
                className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[440px] flex items-center justify-center"
              >
                <div className="relative w-full aspect-[4/5] max-h-[320px] sm:max-h-[400px] md:max-h-[500px] flex items-center justify-center group">

                  {/* Glow */}

                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/30 via-orange-200/30 to-yellow-200/20 rounded-full blur-2xl opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Image */}

                  <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(120,53,15,0.14)] border border-stone-200/90 group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={currentService.img}
                      alt={currentService.title}
                      className="w-full h-full object-cover transition-all duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-left space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-mono text-amber-300 font-extrabold uppercase tracking-widest block drop-shadow-md break-words">
                        {isMounted &&
                          (detailText.heroTitle ||
                            "H.I.T. INTERCON CO., LTD.")}
                      </span>

                      <h5 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-snug drop-shadow-lg break-words">
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

      {/* ====================================================== */}
      {/* SECTION 4 — CONTACT                                  */}
      {/* ====================================================== */}

      <section
        id="Contact Us"
        className="relative w-full min-h-screen bg-[#FDFBF7] text-stone-900 py-16 sm:py-20 lg:py-28 px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col justify-center items-center overflow-hidden border-t border-stone-200"
      >
        {/* Background Glow */}

        <div className="absolute top-1/3 left-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-amber-200/40 rounded-full blur-[90px] sm:blur-[120px] lg:blur-[140px] pointer-events-none" />

        <div className="absolute bottom-1/4 right-1/4 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-orange-100/60 rounded-full blur-[90px] sm:blur-[120px] lg:blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">

          {/* ================================================= */}
          {/* CONTACT HEADER                                   */}
          {/* ================================================= */}

          <ScrollCardReveal direction="up">
            <div className="text-center space-y-4 w-full max-w-3xl mx-auto px-2">

              <div className="inline-flex items-center space-x-2 bg-amber-50/80 border border-amber-200/60 px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold text-amber-800 font-mono shadow-sm backdrop-blur-md max-w-full">
                <i className="fa-solid fa-address-card text-amber-700 shrink-0" />

                <span>
                  {detailText.contactBadge ||
                    (lang === "en"
                      ? "Contact Information"
                      : "ข้อมูลติดต่อฝ่ายการตลาดและประสานงาน")}
                </span>
              </div>

              <h3 className="font-black text-stone-900 text-2xl sm:text-3xl md:text-5xl tracking-tight leading-tight break-words">
                {isMounted &&
                  (detailText.heroTitle ||
                    (lang === "en"
                      ? "H.I.T. Intercon Co., Ltd."
                      : "บริษัท เอช.ไอ.ที. อินเตอร์คอน จำกัด"))}
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm text-stone-500 font-mono max-w-2xl mx-auto leading-relaxed break-words">
                Hotline: 0-2393-2300 (Auto) |
                Fax: 0-2393-7307-10 |
                admincenter@handleintergroup.com
              </p>
            </div>
          </ScrollCardReveal>

          {/* ================================================= */}
          {/* CONTACT CARDS                                    */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 w-full max-w-6xl mx-auto">

            {/* ================================================= */}
            {/* BUSINESS CARD 1                                 */}
            {/* ================================================= */}

            <ScrollCardReveal
              direction="left"
              delay={100}
              className="h-full"
            >
              <div className="h-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-amber-200/70 hover:border-amber-400/80 rounded-tr-[50px] sm:rounded-tr-[80px] lg:rounded-tr-[110px] rounded-bl-[50px] sm:rounded-bl-[80px] lg:rounded-bl-[110px] rounded-tl-3xl rounded-br-3xl p-5 sm:p-7 lg:p-10 shadow-[0_20px_50px_rgba(217,119,6,0.08)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:-translate-y-1.5 flex flex-col justify-between">

                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-6 lg:gap-8">

                  {/* Logo */}

                  <div className="w-full sm:w-5/12 flex flex-col items-center justify-center text-center space-y-3 bg-white/80 border border-amber-100 rounded-tr-[30px] sm:rounded-tr-[40px] rounded-bl-[30px] sm:rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-4 sm:p-5 shadow-sm">

                    <img
                      src="/images/1725e41.png"
                      alt="Handle Inter Group Logo"
                      className="h-14 sm:h-16 lg:h-20 w-auto max-w-[180px] object-contain transition-transform group-hover:scale-105"
                    />

                    <div>
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm tracking-wider uppercase font-mono">
                        H.I.T. INTERCON
                      </h4>

                      <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium tracking-tight">
                        Total Logistics Solution
                      </p>
                    </div>
                  </div>

                  {/* Divider */}

                  <div className="hidden sm:block w-[1.5px] bg-gradient-to-b from-amber-300 via-amber-400/50 to-transparent rounded-full my-1" />

                  <div className="block sm:hidden w-full h-[1.5px] bg-gradient-to-r from-amber-300 via-amber-400/50 to-transparent rounded-full" />

                  {/* Contact */}

                  <div className="w-full sm:w-7/12 min-w-0 space-y-4 text-left flex flex-col justify-center">

                    <div>
                      <h3 className="font-black text-stone-900 text-lg sm:text-xl lg:text-2xl tracking-tight leading-snug break-words">
                        {isMounted &&
                          detailText.c1_name}
                      </h3>

                      <p className="text-[10px] sm:text-xs font-bold text-amber-700 tracking-wide mt-1 font-mono break-words">
                        {isMounted &&
                          detailText.c1_pos}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600 font-medium">

                      {/* Location */}

                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-location-dot" />
                        </div>

                        <span className="line-clamp-2 text-stone-700 min-w-0 break-words">
                          {detailText.contactHeadOffice ||
                            "Bangkok & Worldwide Hub"}
                        </span>
                      </div>

                      {/* Phone */}

                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-phone" />
                        </div>

                        <a
                          href={`tel:${
                            isMounted
                              ? detailText.c1_phone
                              : ""
                          }`}
                          className="hover:text-amber-700 transition-colors font-mono text-stone-800 font-semibold break-words min-w-0"
                        >
                          {isMounted &&
                            detailText.c1_phone}
                        </a>
                      </div>

                      {/* Email */}

                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-envelope" />
                        </div>

                        <a
                          href={`mailto:${
                            isMounted
                              ? detailText.c1_mail
                              : ""
                          }`}
                          className="hover:text-amber-700 transition-colors line-clamp-2 min-w-0 break-all font-mono text-stone-800 font-semibold"
                        >
                          {isMounted &&
                            detailText.c1_mail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCardReveal>

            {/* ================================================= */}
            {/* BUSINESS CARD 2                                 */}
            {/* ================================================= */}

            <ScrollCardReveal
              direction="right"
              delay={200}
              className="h-full"
            >
              <div className="h-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-amber-200/70 hover:border-amber-400/80 rounded-tr-[50px] sm:rounded-tr-[80px] lg:rounded-tr-[110px] rounded-bl-[50px] sm:rounded-bl-[80px] lg:rounded-bl-[110px] rounded-tl-3xl rounded-br-3xl p-5 sm:p-7 lg:p-10 shadow-[0_20px_50px_rgba(217,119,6,0.08)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:-translate-y-1.5 flex flex-col justify-between">

                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-6 lg:gap-8">

                  {/* Logo */}

                  <div className="w-full sm:w-5/12 flex flex-col items-center justify-center text-center space-y-3 bg-white/80 border border-amber-100 rounded-tr-[30px] sm:rounded-tr-[40px] rounded-bl-[30px] sm:rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-4 sm:p-5 shadow-sm">

                    <img
                      src="/images/1725e41.png"
                      alt="Handle Inter Group Logo"
                      className="h-14 sm:h-16 lg:h-20 w-auto max-w-[180px] object-contain transition-transform group-hover:scale-105"
                    />

                    <div>
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm tracking-wider uppercase font-mono">
                        H.I.T. INTERCON
                      </h4>

                      <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium tracking-tight">
                        Total Logistics Solution
                      </p>
                    </div>
                  </div>

                  {/* Divider */}

                  <div className="hidden sm:block w-[1.5px] bg-gradient-to-b from-amber-300 via-amber-400/50 to-transparent rounded-full my-1" />

                  <div className="block sm:hidden w-full h-[1.5px] bg-gradient-to-r from-amber-300 via-amber-400/50 to-transparent rounded-full" />

                  {/* Contact */}

                  <div className="w-full sm:w-7/12 min-w-0 space-y-4 text-left flex flex-col justify-center">

                    <div>
                      <h3 className="font-black text-stone-900 text-lg sm:text-xl lg:text-2xl tracking-tight leading-snug break-words">
                        {isMounted &&
                          detailText.c2_name}
                      </h3>

                      <p className="text-[10px] sm:text-xs font-bold text-amber-700 tracking-wide mt-1 font-mono break-words">
                        {isMounted &&
                          detailText.c2_pos}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600 font-medium">

                      {/* Location */}

                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-location-dot" />
                        </div>

                        <span className="line-clamp-2 text-stone-700 min-w-0 break-words">
                          {detailText.contactHeadOffice ||
                            "Bangkok & Worldwide Hub"}
                        </span>
                      </div>

                      {/* Phone */}

                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-phone" />
                        </div>

                        <a
                          href={`tel:${
                            isMounted
                              ? detailText.c2_phone
                              : ""
                          }`}
                          className="hover:text-amber-700 transition-colors font-mono text-stone-800 font-semibold break-words min-w-0"
                        >
                          {isMounted &&
                            detailText.c2_phone}
                        </a>
                      </div>

                      {/* Email */}

                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-envelope" />
                        </div>

                        <a
                          href={`mailto:${
                            isMounted
                              ? detailText.c2_mail
                              : ""
                          }`}
                          className="hover:text-amber-700 transition-colors line-clamp-2 min-w-0 break-all font-mono text-stone-800 font-semibold"
                        >
                          {isMounted &&
                            detailText.c2_mail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCardReveal>
          </div>

          {/* ================================================= */}
          {/* BACK TO ABOUT                                     */}
          {/* ================================================= */}

          <ScrollCardReveal
            direction="up"
            delay={300}
          >
            <div className="pt-2 sm:pt-4 lg:pt-6 text-center">
              <Link
                href="/aboutus"
                className="inline-flex items-center justify-center space-x-2 bg-stone-900 hover:bg-amber-800 text-amber-50 border border-stone-800 text-[10px] sm:text-xs font-mono font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <i className="fa-solid fa-arrow-left text-[10px] mr-1" />

                <span>
                  {detailText.backAboutBtn ||
                    (lang === "en"
                      ? "Back to About Us"
                      : "กลับสู่หน้าเกี่ยวกับเรา")}
                </span>
              </Link>
            </div>
          </ScrollCardReveal>
        </div>
      </section>
    </div>
  );
}