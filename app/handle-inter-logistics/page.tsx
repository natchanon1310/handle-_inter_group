"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
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
// Scroll Card Reveal
// ============================================================

function ScrollCardReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

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

    observer.observe(element);

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
// Main Page
// ============================================================

export default function HandleInterLogisticsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);

  // ============================================================
  // Responsive Detection
  // ============================================================

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    };

    checkDesktop();

    window.addEventListener("resize", checkDesktop);

    return () => {
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  // ============================================================
  // Smooth Scroll-Locking Reference
  // Desktop only
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
  // Scene 1 - Main Title Animation
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

  // ============================================================
  // Scene 2 - Content Reveal
  // ============================================================

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
  // Active Service
  // ============================================================

  const [activeServiceTab, setActiveServiceTab] = useState<number>(0);

  // ============================================================
  // Language
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
    t.interLogistics || dictionary.en.interLogistics || {};

  // ============================================================
  // Sections
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
  // Service Data
  // ============================================================

  const completeEbookServices = useMemo(
    () => [
      {
        id: "ocean-freight",
        tabTitle:
          detailText.s1_tab ||
          "Ocean Freight",
        tag:
          detailText.s1_tag ||
          "CORE SERVICE 01 // SEA FREIGHT",
        title:
          detailText.s1_title ||
          "Ocean Freight Services",
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
          detailText.s2_tab ||
          "Air Freight",
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
          "CORE SERVICE 03 // LCL SERVICE",
        title:
          detailText.s3_title ||
          "LCL Cargo Consolidation",
        subtitle:
          detailText.s3_sub || "",
        desc:
          detailText.s3_desc || "",
        items:
          detailText.s3_items || [],
        icon: "📦",
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
        id: "customs-clearance",
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
  // Detect Active Section
  // ============================================================

  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const scrollPosition =
          window.scrollY + 300;

        for (const section of sections) {
          const el =
            document.getElementById(
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
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [isMounted, sections]);

  // ============================================================
  // Scroll To Section
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
  // Render
  // ============================================================

  return (
    <div className="relative w-full overflow-x-clip bg-slate-100 text-slate-800">
      {/* ======================================================
          SIDE PROGRESS DOTS
      ====================================================== */}

      <div className="fixed right-6 xl:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-6 items-end">
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

      {/* ======================================================
          SECTION 1 : HERO
      ====================================================== */}

      <section
        id="overview"
        className="
          relative
          w-full
          min-h-[100svh]
          lg:min-h-screen
          lg:h-screen
          flex
          items-center
          justify-center
          bg-slate-950
          text-white
          overflow-hidden
          border-b
          border-slate-800
          px-4
          sm:px-6
        "
      >
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/handleinterconhero.jpeg"
            alt="Handle Inter Logistics Hub"
            className="
              w-full
              h-full
              object-cover
              object-center
              opacity-50
              brightness-90
              contrast-110
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        </div>

        {/* Hero Content */}
        <div
          className="
            max-w-6xl
            mx-auto
            px-2
            sm:px-4
            lg:px-6
            text-center
            space-y-5
            sm:space-y-6
            relative
            z-20
            pt-16
            sm:pt-20
            w-full
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <ScrollCardReveal
            direction="up"
            delay={100}
            className="w-full"
          >
            {/* Badge */}
            <div className="inline-block bg-orange-600/90 backdrop-blur-md px-4 sm:px-5 py-1.5 rounded-full shadow-lg mb-2 max-w-full">
              <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest font-mono">
                {isMounted &&
                  (detailText.heroSub ||
                    "HANDLE INTER LOGISTICS")}
              </span>
            </div>

            {/* Hero Title */}
          <h1
  className="
    w-full
    max-w-none
    mx-auto
    flex
    justify-center
    items-center
    text-center
    whitespace-nowrap
    text-[clamp(1rem,6vw,4.5rem)]
    sm:text-[clamp(1.5rem,5vw,4.5rem)]
    font-black
    text-white
    tracking-tight
    leading-[1.1]
    drop-shadow-md
    mt-2
  "
>
  {isMounted &&
    (detailText.heroTitle ||
      "HANDLE INTER LOGISTICS CO. LTD.")}
</h1>

            {/* Divider */}
            <div className="w-14 sm:w-20 h-1 bg-orange-500 mx-auto rounded-full my-4 sm:my-5" />

            {/* Hero Description */}
            <p
              className="
                text-slate-200
                max-w-4xl
                mx-auto
                text-sm
                sm:text-lg
                md:text-2xl
                lg:text-4xl
                leading-relaxed
                font-normal
                px-2
              "
            >
              {isMounted &&
                detailText.heroDesc}
            </p>

            {/* CTA */}
            <div className="pt-5 sm:pt-6">
              <button
                onClick={() =>
                  scrollToSection(
                    "companyprofile"
                  )
                }
                className="
                  bg-orange-600
                  hover:bg-orange-500
                  text-white
                  px-5
                  sm:px-8
                  py-3
                  sm:py-3.5
                  rounded-full
                  text-[10px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  transition-all
                  duration-300
                  hover:scale-105
                  active:scale-95
                  shadow-xl
                  shadow-orange-600/30
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  sm:gap-3
                  cursor-pointer
                  max-w-full
                "
              >
                <span className="break-words">
                  {detailText.exploreBtn ||
                    (lang === "en"
                      ? "EXPLORE DIGITAL BROCHURE"
                      : "เปิดอ่านโบรชัวร์ดิจิทัล")}
                </span>

                <span className="animate-bounce shrink-0">
                  ↓
                </span>
              </button>
            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* ======================================================
          SECTION 2 : COMPANY PROFILE / HEYZINE
      ====================================================== */}

      <section
        id="companyprofile"
        className="
          py-14
          sm:py-20
          md:py-24
          px-3
          sm:px-6
          md:px-8
          bg-[#222327]
          text-white
          relative
          w-full
          flex
          flex-col
          items-center
          justify-center
          min-h-[100svh]
          border-b
          border-neutral-800
        "
      >
        {/* Heading */}
        <div
          className="
            text-center
            w-full
            max-w-3xl
            mx-auto
            space-y-2
            mb-6
            sm:mb-8
            px-2
          "
        >
          <span className="text-[10px] sm:text-[11px] font-bold text-orange-400 uppercase tracking-widest block font-mono">
            Interactive Presentation
          </span>

          <h2
            className="
              text-xl
              sm:text-3xl
              md:text-4xl
              font-black
              tracking-tight
              text-white
              leading-tight
            "
          >
            {detailText.catalogTitle ||
              "Handle Inter Logistics Catalog"}
          </h2>

          <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed max-w-xl mx-auto">
            {detailText.catalogSubtitle ||
              (lang === "en"
                ? "Browse our official digital company brochure below."
                : "คลิกเปิดอ่านโบรชัวร์ดิจิทัลของบริษัทได้จากหน้าต่างด้านล่าง")}
          </p>
        </div>

        {/* Flipbook */}
        <div
          className="
            w-full
            max-w-5xl
            mx-auto
            bg-black/40
            rounded-xl
            sm:rounded-2xl
            overflow-hidden
            shadow-[0_25px_60px_rgba(0,0,0,0.85)]
            border
            border-white/10
            p-1.5
            sm:p-3
            md:p-4
            backdrop-blur-md
          "
        >
          <div
            className="
              relative
              w-full
              h-[58vh]
              min-h-[360px]
              max-h-[760px]
              sm:h-[65vh]
              sm:min-h-[480px]
              rounded-lg
              sm:rounded-xl
              overflow-hidden
            "
          >
            <iframe
              src="https://heyzine.com/flip-book/ef688fa077.html"
              title="Handle Inter Logistics Flipbook"
              className="w-full h-full border-0 rounded-lg sm:rounded-xl"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          SECTION 3 : OUR SERVICE
          Desktop = Sticky Scroll Experience
          Mobile = Normal Responsive Flow
      ====================================================== */}

      <section
        id="Our service"
        ref={lockContainerRef}
        className="
          relative
          w-full
          min-h-screen
          lg:h-[250vh]
          bg-[#FDFBF7]
          text-stone-900
          border-b
          border-stone-200
        "
      >
        {/* Sticky wrapper
            Mobile: normal flow
            Desktop: sticky 100vh
        */}
        <div
          className="
            relative
            lg:sticky
            lg:top-0
            min-h-screen
            lg:h-screen
            w-full
            flex
            flex-col
            items-center
            justify-start
            lg:justify-center
            overflow-hidden
            px-4
            sm:px-6
            lg:px-14
            py-12
            sm:py-16
            lg:py-0
            z-20
          "
        >
          {/* ==================================================
              Background
          ================================================== */}

          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80"
              alt="Atmospheric Background"
              className="
                w-full
                h-full
                object-cover
                opacity-10
                filter
                contrast-125
                brightness-110
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-[#FDFBF7]" />

            <div className="absolute top-1/4 left-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-amber-200/50 rounded-full blur-[100px] sm:blur-[160px]" />

            <div className="absolute bottom-1/4 right-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-orange-100/60 rounded-full blur-[100px] sm:blur-[160px]" />
          </div>

          {/* ==================================================
              SCENE 1 : CENTER TITLE
          ================================================== */}

         <motion.div
  style={{
    opacity: isDesktop ? titleOpacity : 1,
    scale: isDesktop ? titleScale : 1,
  }}
  className="
    relative
    lg:absolute
    lg:left-1/2
    lg:top-1/4
    lg:-translate-x-1/2
    lg:-translate-y-1/2
    w-full
    max-w-none
    mx-auto
    flex
    flex-col
    items-center
    justify-center
    text-center
    space-y-3
    z-10
    pointer-events-none
    shrink-0
  "
>
  <h2
    className="
      w-full
      text-center
      whitespace-nowrap
      text-[clamp(1.15rem,4.8vw,4.5rem)]
      sm:text-[clamp(1.8rem,4.5vw,4.5rem)]
      md:text-[clamp(2.5rem,4vw,4.5rem)]
      lg:text-7xl
      font-black
      tracking-tight
      text-stone-900
      leading-[1.08]
    "
  >
    {lang === "en"
      ? "HANDLE INTER LOGISTICS CO. LTD."
      : "บริษัท แฮนเดิล อินเตอร์ โลจิสติกส์ จํากัด"}
    
              <br />

              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {lang === "en"
                  ? "TEAM WORK"
                  : "การทำงานเป็นทีม"}
              </span>
            </h2>

            <p
              className="
                text-stone-600
                text-xs
                sm:text-sm
                md:text-base
                lg:text-lg
                max-w-xl
                mx-auto
                font-normal
                leading-relaxed
                px-3
              "
            >
              {lang === "en"
                ? "Scroll down to experience our superior one-stop service quality and complete worldwide logistics ecosystem."
                : "เลื่อนลงเพื่อสัมผัสประสบการณ์บริการขนส่งครบวงจรมาตรฐานระดับโลก"}
            </p>

            <div className="pt-2">
              <span className="inline-block bg-stone-900 text-amber-50 font-mono font-bold text-[10px] sm:text-xs md:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg">
                {lang === "en"
                  ? "Scroll Down ↓"
                  : "เลื่อนลงเพื่อดูข้อมูล ↓"}
              </span>
            </div>
          </motion.div>

          {/* ==================================================
              SERVICE CONTENT
          ================================================== */}

          {/* ==================================================
    SERVICE CONTENT
================================================== */}

<div
  className="
    max-w-6xl
    mx-auto
    w-full
    grid
    grid-cols-1
    lg:grid-cols-12
    gap-6
    lg:gap-8
    items-center
    relative
    z-20
    mt-8
    sm:mt-10
    lg:mt-0
    lg:h-[76vh]
    min-h-0
  "
>
  {/* =================================================
      LEFT : SERVICE INFORMATION + TABS
  ================================================= */}

  <motion.div
    style={{
      opacity: isDesktop ? contentOpacity : 1,
      x: isDesktop ? contentX : 0,
    }}
    className="
      lg:col-span-7
      text-left
      flex
      flex-col
      justify-center
      min-h-0
      lg:h-full
      py-0
      lg:py-2
      pr-0
      lg:pr-2
      overflow-visible
    "
  >
    {/* =================================================
        SERVICE CONTENT
    ================================================= */}

    <AnimatePresence mode="wait">
      <motion.div
        key={currentService.id}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -10,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="
          space-y-2
          sm:space-y-2.5
          lg:space-y-2
        "
      >
        {/* Service Tag */}
        <div
          className="
            inline-block
            max-w-full
            font-mono
            text-[9px]
            sm:text-[10px]
            lg:text-xs
            font-bold
            uppercase
            tracking-wider
            text-amber-800
            bg-amber-100/90
            border
            border-amber-300/80
            px-3
            py-1
            rounded-full
            shadow-sm
            break-words
          "
        >
          {currentService.tag}
        </div>

        {/* Title */}
        <div>
          <h3
            className="
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-black
              text-stone-900
              tracking-tight
              leading-[1.05]
              break-words
            "
          >
            {currentService.title}
          </h3>

          <h4
            className="
              text-[10px]
              sm:text-xs
              lg:text-sm
              font-mono
              font-bold
              text-amber-700
              pt-0.5
              break-words
            "
          >
            {currentService.subtitle}
          </h4>
        </div>

        {/* Description */}
        <p
          className="
            text-stone-700
            text-xs
            sm:text-sm
            lg:text-sm
            leading-[1.55]
            font-normal
            max-w-2xl
          "
        >
          {currentService.desc}
        </p>

        {/* =================================================
            SERVICE SCOPE
        ================================================= */}

        {currentService.items &&
          currentService.items.length > 0 && (
            <div className="pt-0">
              <div
                className="
                  bg-[#FAF6EE]/95
                  border
                  border-amber-200/80
                  rounded-2xl
                  p-3
                  sm:p-3.5
                  space-y-1.5
                  backdrop-blur-md
                  shadow-sm
                "
              >
                {/* Scope Title */}
                <h5
                  className="
                    font-bold
                    text-[11px]
                    sm:text-xs
                    lg:text-sm
                    text-stone-900
                    flex
                    items-center
                    space-x-2
                  "
                >
                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-amber-600
                      shadow-[0_0_8px_rgba(217,119,6,0.6)]
                      shrink-0
                    "
                  />

                  <span>
                    {detailText.scopeTitle ||
                      (lang === "en"
                        ? "Service Scope & Capabilities"
                        : "ขอบเขตการให้บริการ")}
                  </span>
                </h5>

                {/* Scope Items */}
                <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                  {currentService.items.map(
                    (
                      item: string,
                      iIdx: number
                    ) => (
                      <div
                        key={iIdx}
                        className="
                          flex
                          items-start
                          space-x-2
                          text-[11px]
                          sm:text-xs
                          lg:text-sm
                          text-stone-700
                        "
                      >
                        <span
                          className="
                            text-amber-700
                            font-bold
                            text-xs
                            mt-0.5
                            shrink-0
                          "
                        >
                          ✓
                        </span>

                        <span
                          className="
                            leading-[1.45]
                            whitespace-normal
                            break-words
                            min-w-0
                          "
                        >
                          {item}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

        {/* =================================================
            INQUIRY BUTTON
        ================================================= */}

        <div className="pt-0.5">
          <button
            onClick={() =>
              scrollToSection("Contact Us")
            }
            className="
              bg-amber-700
              hover:bg-amber-800
              text-amber-50
              font-mono
              text-[10px]
              sm:text-xs
              lg:text-sm
              font-bold
              uppercase
              tracking-wider
              px-5
              sm:px-6
              py-2.5
              rounded-full
              transition-all
              duration-300
              shadow-xl
              shadow-amber-900/20
              hover:scale-105
              active:scale-95
              cursor-pointer
            "
          >
            <span>
              {detailText.inquireBtn ||
                (lang === "en"
                  ? "Inquire Service Now ↗"
                  : "ติดต่อสอบถามบริการ ↗")}
            </span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>

    {/* =================================================
        SERVICE TABS
        ชิดกับเนื้อหาด้านบน
    ================================================= */}

    <div
      className="
        pt-3
        lg:pt-3
        border-t
        border-stone-200
        space-y-1.5
        mt-3
        lg:mt-3
      "
    >
      <span
        className="
          text-[9px]
          sm:text-[10px]
          font-mono
          uppercase
          tracking-widest
          text-stone-500
          font-bold
          block
        "
      >
        {detailText.selectServiceTitle ||
          (lang === "en"
            ? "Select Core Logistics Service :"
            : "เลือกบริการหลัก :")}
      </span>

      <div className="flex flex-wrap gap-1.5">
        {completeEbookServices.map(
          (ch, idx) => (
            <button
              key={ch.id}
              onClick={() =>
                setActiveServiceTab(idx)
              }
              className={`
                px-2.5
                py-1.5
                rounded-lg
                text-[10px]
                sm:text-[11px]
                lg:text-xs
                font-mono
                transition-all
                duration-300
                cursor-pointer
                min-h-[34px]
                ${
                  activeServiceTab === idx
                    ? "bg-stone-900 text-amber-50 font-extrabold shadow-md scale-[1.02]"
                    : "bg-white text-stone-600 hover:bg-amber-100/60 hover:text-stone-900 border border-stone-200"
                }
              `}
            >
              {ch.icon} {ch.tabTitle}
            </button>
          )
        )}
      </div>
    </div>
  </motion.div>

  {/* =================================================
      RIGHT : SERVICE IMAGE
  ================================================= */}

  <div
    className="
      lg:col-span-5
      flex
      items-center
      justify-center
      relative
      w-full
      min-h-0
      lg:h-full
    "
  >
    <motion.div
      style={{
        opacity: isDesktop ? imageOpacity : 1,
        x: isDesktop ? imageX : 0,
        scale: isDesktop ? imageScale : 1,
      }}
      className="
        relative
        w-full
        max-w-[270px]
        sm:max-w-[330px]
        lg:max-w-[390px]
        flex
        items-center
        justify-center
      "
    >
      <div
        className="
          relative
          w-full
          aspect-[4/5]
          max-h-[360px]
          sm:max-h-[420px]
          lg:max-h-[500px]
          flex
          items-center
          justify-center
          group
        "
      >
        {/* Glow */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-tr
            from-amber-300/30
            via-orange-200/30
            to-yellow-200/20
            rounded-full
            blur-2xl
            opacity-60
            pointer-events-none
            group-hover:opacity-100
            transition-opacity
            duration-700
          "
        />

        {/* Image */}
        <div
          className="
            relative
            w-full
            h-full
            rounded-[24px]
            sm:rounded-[28px]
            overflow-hidden
            shadow-[0_20px_50px_rgba(120,53,15,0.14)]
            border
            border-stone-200/90
            group-hover:scale-[1.02]
            transition-transform
            duration-500
          "
        >
          <img
            src={currentService.img}
            alt={currentService.title}
            className="
              w-full
              h-full
              object-cover
              transition-all
              duration-500
            "
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Caption */}
          <div
            className="
              absolute
              bottom-4
              sm:bottom-5
              left-4
              sm:left-5
              right-4
              sm:right-5
              text-left
              space-y-1
            "
          >
            <span
              className="
                text-[8px]
                sm:text-[9px]
                lg:text-[10px]
                font-mono
                text-amber-300
                font-extrabold
                uppercase
                tracking-widest
                block
                drop-shadow-md
                break-words
              "
            >
              {isMounted &&
                (detailText.heroTitle ||
                  "HANDLE INTER LOGISTICS CO. LTD.")}
            </span>

            <h5
              className="
                text-sm
                sm:text-base
                lg:text-lg
                font-black
                text-white
                tracking-tight
                leading-snug
                drop-shadow-lg
                break-words
              "
            >
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

      {/* ======================================================
          SECTION 4 : CONTACT
      ====================================================== */}

      <section
        id="Contact Us"
        className="
          relative
          w-full
          min-h-[100svh]
          bg-[#FDFBF7]
          text-stone-900
          py-16
          sm:py-20
          lg:py-28
          px-4
          sm:px-8
          lg:px-16
          flex
          flex-col
          justify-center
          items-center
          overflow-hidden
          border-t
          border-stone-200
        "
      >
        {/* Background Glow */}
        <div className="absolute top-1/3 left-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-amber-200/40 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

        <div className="absolute bottom-1/4 right-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-orange-100/60 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            flex
            flex-col
            justify-center
            items-center
            relative
            z-10
            space-y-10
            sm:space-y-12
          "
        >
          {/* ==================================================
              CONTACT HEADER
          ================================================== */}

          <ScrollCardReveal direction="up">
            <div className="text-center space-y-4 max-w-3xl mx-auto px-2">
              {/* Badge */}
              <div
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-amber-50/80
                  border
                  border-amber-200/60
                  px-4
                  sm:px-6
                  py-2
                  rounded-full
                  text-[10px]
                  sm:text-xs
                  font-bold
                  text-amber-800
                  font-mono
                  shadow-sm
                  backdrop-blur-md
                  max-w-full
                "
              >
                <i className="fa-solid fa-address-card text-amber-700 shrink-0" />

                <span className="break-words">
                  {detailText.contactBadge ||
                    (lang === "en"
                      ? "Contact Information"
                      : "ข้อมูลติดต่อฝ่ายการตลาดและประสานงาน")}
                </span>
              </div>

              {/* Company Name */}
              <h3
  className="
    w-full
    flex
    items-center
    justify-center
    text-center
    whitespace-nowrap
    font-black
    text-stone-900
    text-[clamp(1rem,4vw,3rem)]
    sm:text-[clamp(1.5rem,3.5vw,3rem)]
    md:text-5xl
    tracking-tight
    leading-tight
  "
>
  {isMounted &&
    (detailText.heroTitle ||
      (lang === "en"
        ? "Handle Inter Logistics Co. Ltd."
        : "บริษัท แฮนเดิล อินเตอร์ โลจิสติกส์ จํากัด"))}
</h3>

              {/* Contact Info */}
              <p
                className="
                  text-[10px]
                  sm:text-xs
                  md:text-sm
                  text-stone-500
                  font-mono
                  max-w-2xl
                  mx-auto
                  leading-relaxed
                  break-words
                "
              >
                Hotline: 0-2393-2300
                (Auto) | Fax:
                0-2393-7307-10 |
                admincenter@handleintergroup.com
              </p>
            </div>
          </ScrollCardReveal>

          {/* ==================================================
              BUSINESS CARD
          ================================================== */}

          <div className="max-w-4xl w-full mx-auto">
            <ScrollCardReveal
              direction="up"
              delay={100}
              className="h-full"
            >
              <div
                className="
                  h-full
                  bg-[#FAF6EE]/90
                  hover:bg-[#FAF6EE]
                  border
                  border-amber-200/70
                  hover:border-amber-400/80
                  rounded-[28px]
                  sm:rounded-tr-[110px]
                  sm:rounded-bl-[110px]
                  sm:rounded-tl-3xl
                  sm:rounded-br-3xl
                  p-5
                  sm:p-8
                  lg:p-12
                  shadow-[0_20px_50px_rgba(217,119,6,0.08)]
                  backdrop-blur-xl
                  relative
                  overflow-hidden
                  transition-all
                  duration-500
                  group
                  hover:-translate-y-1.5
                  flex
                  flex-col
                  justify-between
                "
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-10">
                  {/* =================================================
                      LOGO AREA
                  ================================================= */}

                  <div
                    className="
                      w-full
                      sm:w-5/12
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      space-y-3
                      bg-white/80
                      border
                      border-amber-100
                      rounded-[24px]
                      sm:rounded-tr-[40px]
                      sm:rounded-bl-[40px]
                      sm:rounded-tl-xl
                      sm:rounded-br-xl
                      p-5
                      sm:p-6
                      shadow-sm
                    "
                  >
                    <img
                      src="/images/handle inter logistic.png"
                      alt="Handle Inter Logistics Logo"
                      className="
                        h-14
                        sm:h-20
                        w-auto
                        max-w-[220px]
                        object-contain
                        transition-transform
                        group-hover:scale-105
                      "
                    />

                    <div>
                      <h4
                        className="
                          font-black
                          text-stone-900
                          text-xs
                          sm:text-sm
                          tracking-wider
                          uppercase
                          font-mono
                        "
                      >
                        HANDLE INTER LOGISTICS
                      </h4>

                      <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium tracking-tight mt-1">
                        Freight & Trucking Fleet Solution
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-[1.5px] bg-gradient-to-b from-amber-300 via-amber-400/50 to-transparent rounded-full my-1" />

                  <div className="block sm:hidden w-full h-[1.5px] bg-gradient-to-r from-amber-300 via-amber-400/50 to-transparent rounded-full" />

                  {/* =================================================
                      CONTACT DETAILS
                  ================================================= */}

                  <div
                    className="
                      w-full
                      sm:w-7/12
                      space-y-4
                      text-left
                      flex
                      flex-col
                      justify-center
                      min-w-0
                    "
                  >
                    {/* Name */}
                    <div>
                      <h3
                        className="
                          font-black
                          text-stone-900
                          text-lg
                          sm:text-2xl
                          tracking-tight
                          leading-snug
                          break-words
                        "
                      >
                        {isMounted &&
                          detailText.contact_name}
                      </h3>

                      <p className="text-[10px] sm:text-xs font-bold text-amber-700 tracking-wide mt-1 font-mono break-words">
                        {isMounted &&
                          detailText.contact_position}
                      </p>
                    </div>

                    {/* Contact Items */}
                    <div className="space-y-3 pt-1 sm:pt-2 text-xs sm:text-sm text-stone-600 font-medium">
                      {/* Location */}
                      <div className="flex items-start space-x-3 min-w-0">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-amber-100/80
                            border
                            border-amber-200
                            text-amber-800
                            flex
                            items-center
                            justify-center
                            text-xs
                            shrink-0
                            shadow-sm
                          "
                        >
                          <i className="fa-solid fa-location-dot" />
                        </div>

                        <span className="text-stone-700 leading-relaxed break-words min-w-0 pt-1">
                          {detailText.contactFleetHub ||
                            (lang === "en"
                              ? "Bangkok & ASEAN Logistics Fleet Hub"
                              : "กรุงเทพฯ และศูนย์ฟลีตขนส่งครอบคลุมอาเซียน")}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start space-x-3 min-w-0">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-amber-100/80
                            border
                            border-amber-200
                            text-amber-800
                            flex
                            items-center
                            justify-center
                            text-xs
                            shrink-0
                            shadow-sm
                          "
                        >
                          <i className="fa-solid fa-phone" />
                        </div>

                        <a
                          href={`tel:${
                            isMounted
                              ? detailText.contact_phone
                              : ""
                          }`}
                          className="
                            hover:text-amber-700
                            transition-colors
                            font-mono
                            text-stone-800
                            font-semibold
                            break-all
                            min-w-0
                            pt-1
                          "
                        >
                          {isMounted &&
                            detailText.contact_phone}
                        </a>
                      </div>

                      {/* Email */}
                      <div className="flex items-start space-x-3 min-w-0">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-amber-100/80
                            border
                            border-amber-200
                            text-amber-800
                            flex
                            items-center
                            justify-center
                            text-xs
                            shrink-0
                            shadow-sm
                          "
                        >
                          <i className="fa-solid fa-envelope" />
                        </div>

                        <a
                          href={`mailto:${
                            isMounted
                              ? detailText.contact_email
                              : ""
                          }`}
                          className="
                            hover:text-amber-700
                            transition-colors
                            break-all
                            font-mono
                            text-stone-800
                            font-semibold
                            min-w-0
                            pt-1
                          "
                        >
                          {isMounted &&
                            detailText.contact_email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCardReveal>
          </div>

          {/* ==================================================
              BACK TO ABOUT
          ================================================== */}

          <ScrollCardReveal
            direction="up"
            delay={200}
          >
            <div className="pt-2 sm:pt-6 text-center">
              <Link
                href="/aboutus"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-stone-900
                  hover:bg-amber-800
                  text-amber-50
                  border
                  border-stone-800
                  text-[10px]
                  sm:text-xs
                  font-mono
                  font-bold
                  px-6
                  sm:px-8
                  py-3.5
                  sm:py-4
                  rounded-full
                  shadow-lg
                  transition-all
                  duration-300
                  cursor-pointer
                  hover:scale-105
                  active:scale-95
                  max-w-full
                "
              >
                <i className="fa-solid fa-arrow-left text-[10px]" />

                <span className="break-words">
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