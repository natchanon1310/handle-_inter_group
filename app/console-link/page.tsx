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

// 🎬 Scroll Reveal
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
      className={`
        transition-all
        duration-1000
        ease-[cubic-bezier(0.16,1,0.3,1)]
        transform-gpu
        ${getTransformStyle()}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default function ConsoleLinkPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState<number>(0);

  // =========================================================
  // DESKTOP DETECTION
  // =========================================================
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

  // =========================================================
  // LANGUAGE
  // =========================================================
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

  // =========================================================
  // DICTIONARY
  // =========================================================
  const t = dictionary[lang] || dictionary.en;

  const subsidiaries =
    t.subsidiaries || dictionary.en.subsidiaries || [];

  const detailText =
    t.consoleLink || dictionary.en.consoleLink || {};

  // =========================================================
  // SECTION LIST
  // =========================================================
  const sections = useMemo(
    () => [
      {
        id: "overview",
        label: lang === "en" ? "Overview" : "ภาพรวม",
      },
      {
        id: "companyprofile",
        label: lang === "en" ? "Company Profile" : "เอกสารบริษัท",
      },
      {
        id: "Our service",
        label: lang === "en" ? "Capabilities" : "ขีดความสามารถ",
      },
      {
        id: "Contact Us",
        label: lang === "en" ? "Contact Us" : "ติดต่อเรา",
      },
    ],
    [lang]
  );

  // =========================================================
  // SECTION 3 SCROLL LOCK
  // =========================================================
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

  // =========================================================
  // SERVICES
  // =========================================================
  const completeEbookServices = useMemo(
    () => [
      {
        id: "ocean-freight",
        tabTitle:
          detailText.s1_title ||
          (lang === "en"
            ? "Ocean Freight Solutions"
            : "ขนส่งสินค้าทางทะเล"),

        tag: "CORE SERVICE 01 // SEA FREIGHT",

        title:
          detailText.s1_title ||
          (lang === "en"
            ? "Ocean Freight Solutions"
            : "ขนส่งสินค้าทางทะเล"),

        subtitle:
          lang === "en"
            ? "Comprehensive Maritime Logistics"
            : "มุ่งมั่นบริการ รองรับทุกความต้องด้านการจัดการขนส่งอย่างครบวงจร",

        desc: detailText.s1_desc || "",

        items: [
          detailText.s1_sub1 ||
            (lang === "en"
              ? "Full Container Load (FCL) Services"
              : "บริการจัดการขนส่งสินค้าแบบเต็มตู้คอนเทนเนอร์ (Full Container Load: FCL)"),

          detailText.s1_sub2 ||
            (lang === "en"
              ? "Less Than Container Load (LCL) Services"
              : "บริการจัดการขนส่งสินค้าแบบไม่เต็มตู้คอนเทนเนอร์ (Less Than Container Load: LCL)"),
        ],

        icon: "🚢",
        img: "/images/shipcard.png",
      },

      {
        id: "air-freight",
        tabTitle:
          detailText.s2_title ||
          (lang === "en"
            ? "Air Freight Services"
            : "ขนส่งสินค้าทางอากาศ"),

        tag: "CORE SERVICE 02 // AIR FREIGHT",

        title:
          detailText.s2_title ||
          (lang === "en"
            ? "Air Freight Services"
            : "ขนส่งสินค้าทางอากาศ"),

        subtitle:
          lang === "en"
            ? "Systematic Global Airfreight Solutions"
            : "ทีมงานที่พร้อมด้วยความมุ่งมั่นที่จะให้บริการอย่างเป็นระบบ",

        desc: detailText.s2_desc || "",

        items: [
          detailText.s2_sub1 ||
            (lang === "en"
              ? "Door to Door Transport Services (DDU / DDP / FCA / Ex-work) etc.,"
              : "บริการขนส่งสินค้าแบบถึงมือผู้รับ Door to door (DDU/DDP/FCA/Ex-work) etc.,"),
        ],

        icon: "✈️",
        img: "/images/cardair.png",
      },

      {
        id: "lcl-consolidation",
        tabTitle:
          detailText.s3_title ||
          (lang === "en"
            ? "LCL Cargo Consolidation"
            : "ขนส่งสินค้าแบบไม่เต็มตู้คอนเทรนเนอร์"),

        tag: "CORE SERVICE 03 // LCL SERVICE",

        title:
          detailText.s3_title ||
          (lang === "en"
            ? "LCL Cargo Consolidation"
            : "ขนส่งสินค้าแบบไม่เต็มตู้คอนเทรนเนอร์"),

        subtitle:
          lang === "en"
            ? "Strategic Freight Consolidation for SMEs"
            : "ด้วยความมุ่งมั่นคำนึงถึงทุกความต้องการของลูกค้า",

        desc: detailText.s3_desc || "",

        items: [
          lang === "en"
            ? "Dedicated consolidation and packing management"
            : "การบริการรวบรวมสินค้า และนำมาบริหารวางแผนการจัดวางสินค้า",

          lang === "en"
            ? "Weekly scheduled on-time distribution to Intra-Asia"
            : "กระจายสินค้าไปยังปลายทางอย่างมีประสิทธิภาพในทุกสัปดาห์ (Intra-Asia)",
        ],

        icon: "📦",

        img:
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      },

      {
        id: "trucking-fleet",
        tabTitle:
          detailText.s5_title ||
          (lang === "en"
            ? "Land Transportation"
            : "ขนส่งสินค้าทางรถ"),

        tag: "CORE SERVICE 04 // LAND TRANSPORT",

        title:
          detailText.s5_title ||
          (lang === "en"
            ? "Land Transportation"
            : "ขนส่งสินค้าทางรถ"),

        subtitle:
          detailText.s5_subTitle ||
          (lang === "en"
            ? "Professional Trucking & Transport Fleet"
            : "ทุกความมุ่งมั่น คือทุกการบริการเพื่อรองรับทุกความต้องการของการขนส่ง"),

        desc: detailText.s5_desc || "",

        items: [
          detailText.s5_t1 ||
            (lang === "en"
              ? "4-Wheel High Roof Trucks"
              : "4 ล้อหลังคาสูง"),

          detailText.s5_t2 ||
            (lang === "en"
              ? "6-Wheel Side-Opening Trucks"
              : "6 ล้อเปิดข้าง"),

          detailText.s5_t3 ||
            (lang === "en"
              ? "10-Wheel & Heavy Duty Trucks"
              : "10 ล้อขึ้นไป"),

          detailText.s5_h1 ||
            (lang === "en"
              ? "20 FT Container Trailers"
              : "รถหัวลาก 20 ฟุต"),

          detailText.s5_h2 ||
            (lang === "en"
              ? "40 FT Container Trailers"
              : "รถหัวลาก 40 ฟุต"),
        ],

        icon: "🚛",

        img:
          "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      },

      {
        id: "customs-clearance",
        tabTitle:
          detailText.s4_title ||
          (lang === "en"
            ? "Customs Clearance Services"
            : "ดำเนินการพิธีการศุลกากร"),

        tag: "CORE SERVICE 05 // CUSTOMS CLEARANCE",

        title:
          detailText.s4_title ||
          (lang === "en"
            ? "Customs Clearance Services"
            : "ดำเนินการพิธีการศุลกากร"),

        subtitle:
          lang === "en"
            ? "Committed Border Crossing Brokerage"
            : "การบริการของการเดินพิธีการผ่านแดนเป็นอีกหนึ่งบริการที่มุ่งมั่น",

        desc: detailText.s4_desc || "",

        items: [
          detailText.s4_sub1 ||
            (lang === "en"
              ? "Inbound & Outbound Sea Customs Brokerage"
              : "บริการดำเนินพิธีการทางเรือ ทั้งขาเข้า-ขาออก"),

          detailText.s4_sub2 ||
            (lang === "en"
              ? "Inbound & Outbound Air Customs Brokerage"
              : "บริการดำเนินพิธีการทางอากาศ ทั้งขาเข้า-ขาออก"),

          detailText.s4_sub3 ||
            (lang === "en"
              ? "Certificate of Origin (C/O) Issuance"
              : "บริการออกหนังสือรับรองถิ่นกำเนิดสินค้า (Certificate of Origin)"),

          detailText.s4_sub4 ||
            (lang === "en"
              ? "Blue Corner Tax Refund / Article 19 Bis / BOI"
              : "บริการขอคืนภาษีอากรสำหรับผู้ส่งออก (มุมน้ำเงิน) /มาตรา 19 ทวี/บีโอไอ"),
        ],

        icon: "📑",

        img:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    [detailText, lang]
  );

  const currentService =
    completeEbookServices[activeServiceTab];

  // =========================================================
  // ACTIVE SECTION
  // =========================================================
  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + 300;

        for (const section of sections) {
          const el = document.getElementById(section.id);

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

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMounted, sections]);

  // =========================================================
  // SCROLL TO SECTION
  // =========================================================
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =========================================================
  // RETURN
  // =========================================================
  return (
    <div className="relative w-full overflow-x-clip bg-slate-100 text-slate-800">

      {/* =====================================================
          SIDE PROGRESS DOTS
      ====================================================== */}
      <div className="
        fixed
        right-5
        xl:right-8
        top-1/2
        -translate-y-1/2
        z-40
        hidden
        lg:flex
        flex-col
        space-y-5
        xl:space-y-6
        items-end
      ">
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
              className="
                group
                flex
                items-center
                space-x-3
                xl:space-x-4
                focus:outline-none
                cursor-pointer
              "
            >
              <span
                className={`
                  text-[10px]
                  xl:text-[11px]
                  font-bold
                  uppercase
                  tracking-widest
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "text-orange-600 translate-x-0 opacity-100"
                      : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
                  }
                `}
              >
                {section.label}
              </span>

              <div className="
                relative
                w-7
                xl:w-8
                h-8
                flex
                items-center
                justify-end
              ">
                <span
                  className={`
                    absolute
                    transition-all
                    duration-300
                    rounded-full
                    ${
                      isActive
                        ? "w-7 xl:w-8 h-[3px] bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.8)]"
                        : "w-4 h-[1.5px] bg-gray-300 group-hover:bg-orange-400 group-hover:w-6"
                    }
                  `}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================
          SECTION 1 : HERO
      ====================================================== */}
      <section
        id="overview"
        className="
          relative
          w-full
          min-h-[100svh]
          h-[100svh]
          flex
          items-center
          justify-center
          bg-slate-950
          text-white
          overflow-hidden
          border-b
          border-slate-800
        "
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/images/consolelinghero.jpeg"
            alt="Console Link Logistics Hub"
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

          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950
            via-slate-950/70
            to-transparent
            z-10
          " />
        </div>

        <div className="
          relative
          z-20
          w-full
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          lg:px-10
          pt-16
          sm:pt-20
          lg:pt-20
          flex
          flex-col
          items-center
          justify-center
          text-center
        ">
          <ScrollCardReveal
            direction="up"
            delay={100}
            className="w-full"
          >
            <div className="
              w-full
              flex
              flex-col
              items-center
              justify-center
              text-center
            ">

              {/* Badge */}
              <div className="
                inline-flex
                items-center
                justify-center
                bg-orange-600/90
                backdrop-blur-md
                px-4
                sm:px-5
                py-1.5
                rounded-full
                shadow-lg
                mb-3
                max-w-full
              ">
                <span className="
                  text-[9px]
                  sm:text-xs
                  font-bold
                  text-white
                  uppercase
                  tracking-[0.12em]
                  sm:tracking-widest
                  font-mono
                  whitespace-nowrap
                ">
                  {isMounted &&
                    (detailText.heroSub ||
                      "CONSOLE LINK")}
                </span>
              </div>

              {/* Hero Title */}
              <h1
                className="
                  w-full
                  max-w-none
                  mx-auto
                  flex
                  items-center
                  justify-center
                  text-center
                  whitespace-nowrap
                  font-black
                  text-white
                  tracking-tight
                  leading-[1.05]
                  drop-shadow-md
                  mt-2
                  text-[clamp(0.9rem,5.8vw,4.5rem)]
                  sm:text-[clamp(1.4rem,4.8vw,4.5rem)]
                  md:text-[clamp(2rem,4.5vw,4.5rem)]
                  lg:text-7xl
                "
              >
                {isMounted &&
                  (subsidiaries[4]?.name ||
                    detailText.heroTitle ||
                    "CONSOLE LINK CO., LTD.")}
              </h1>

              <div className="
                w-14
                sm:w-20
                h-1
                bg-orange-500
                mx-auto
                rounded-full
                my-4
              " />

              {/* Hero Description */}
              <p
                className="
                  w-full
                  max-w-2xl
                  mx-auto
                  text-slate-200
                  text-xs
                  sm:text-sm
                  md:text-base
                  leading-relaxed
                  font-normal
                  text-center
                  px-2
                "
              >
                {isMounted && detailText.heroDesc}
              </p>

              {/* CTA */}
              <div className="
                pt-6
                sm:pt-8
                flex
                flex-wrap
                gap-3
                sm:gap-4
                justify-center
              ">
                <button
                  onClick={() =>
                    scrollToSection("companyprofile")
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
                    tracking-wider
                    sm:tracking-widest
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
                  "
                >
                  <span>
                    {lang === "en"
                      ? "EXPLORE DIGITAL BROCHURE"
                      : "เปิดอ่านโบรชัวร์ดิจิทัล"}
                  </span>

                  <span className="animate-bounce">
                    ↓
                  </span>
                </button>
              </div>

            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* =====================================================
          SECTION 2 : FLIPBOOK
      ====================================================== */}
      <section
        id="companyprofile"
        className="
          py-12
          sm:py-16
          md:py-20
          lg:py-24
          px-3
          sm:px-6
          lg:px-8
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
        <div className="
          text-center
          w-full
          max-w-3xl
          mx-auto
          space-y-2
          mb-6
          sm:mb-8
          px-2
        ">
          <span className="
            text-[9px]
            sm:text-[11px]
            font-bold
            text-orange-400
            uppercase
            tracking-[0.12em]
            sm:tracking-widest
            block
            font-mono
          ">
            Interactive Presentation
          </span>

          <h2 className="
            text-xl
            sm:text-3xl
            md:text-4xl
            font-black
            tracking-tight
            text-white
            leading-tight
          ">
            {lang === "en"
              ? "Console Link Flipbook Catalog"
              : "เอกสารแนะนำบริษัท คอนโซล ลิงค์ จำกัด"}
          </h2>

          <p className="
            text-[11px]
            sm:text-xs
            md:text-sm
            text-neutral-400
            leading-relaxed
          ">
            {lang === "en"
              ? "Browse our official digital company brochure below."
              : "คลิกเปิดอ่านโบรชัวร์ดิจิทัลของบริษัทได้จากหน้าต่างด้านล่าง"}
          </p>
        </div>

        <div className="
          w-full
          max-w-6xl
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
        ">
          <div className="
            relative
            w-full
            h-[420px]
            sm:h-[520px]
            md:h-[620px]
            lg:h-[700px]
            rounded-lg
            sm:rounded-xl
            overflow-hidden
          ">
            <iframe
              src="https://heyzine.com/flip-book/d55fb7b2e8.html"
              title="Console Link Flipbook Catalog"
              className="
                w-full
                h-full
                border-0
                rounded-lg
                sm:rounded-xl
              "
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 3 : SERVICES
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
        <div className="
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
        ">

          {/* Background */}
          <div className="
            absolute
            inset-0
            z-0
            overflow-hidden
            pointer-events-none
          ">
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

            <div className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#FDFBF7]
              via-[#FDFBF7]/80
              to-[#FDFBF7]
            " />

            <div className="
              absolute
              top-1/4
              left-1/4
              w-[250px]
              sm:w-[400px]
              lg:w-[500px]
              h-[250px]
              sm:h-[400px]
              lg:h-[500px]
              bg-amber-200/50
              rounded-full
              blur-[100px]
              sm:blur-[140px]
              lg:blur-[160px]
            " />

            <div className="
              absolute
              bottom-1/4
              right-1/4
              w-[250px]
              sm:w-[400px]
              lg:w-[500px]
              h-[250px]
              sm:h-[400px]
              lg:h-[500px]
              bg-orange-100/60
              rounded-full
              blur-[100px]
              sm:blur-[140px]
              lg:blur-[160px]
            " />
          </div>

          {/* Scene 1 Title */}
          <motion.div
            style={{
              opacity: isDesktop
                ? titleOpacity
                : 1,
              scale: isDesktop
                ? titleScale
                : 1,
            }}
            className="
              relative
              lg:absolute
              lg:left-1/2
              lg:top-1/4
              lg:-translate-x-1/2
              lg:-translate-y-1/2
              w-full
              max-w-5xl
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
            <h1 className="
              w-full
              text-center
              font-black
              tracking-tight
              text-stone-900
              leading-[1.05]
              text-[clamp(1.7rem,7vw,4.5rem)]
              sm:text-[clamp(2.5rem,6vw,4.5rem)]
              md:text-6xl
              lg:text-7xl
            ">
              {lang === "en"
                ? "Console Link"
                : "บริษัท คอนโซล ลิงค์ จำกัด"}

              <br />

              <span className="
                bg-gradient-to-r
                from-amber-700
                via-orange-600
                to-amber-600
                bg-clip-text
                text-transparent
              ">
                {lang === "en"
                  ? "WORLD WILD NETWORK"
                  : "ความมุ่งมั่น....สู้เป้าหมาย"}
              </span>
            </h1>

            <p className="
              text-stone-600
              text-xs
              sm:text-sm
              md:text-base
              lg:text-lg
              max-w-xl
              mx-auto
              font-normal
              leading-relaxed
              px-2
            ">
              {lang === "en"
                ? "Scroll down to experience our superior one-stop service quality and complete worldwide logistics ecosystem."
                : "เลื่อนลงเพื่อสัมผัสประสบการณ์บริการขนส่งครบวงจรมาตรฐานระดับโลก"}
            </p>

            <div className="pt-2">
              <span className="
                inline-block
                bg-stone-900
                text-amber-50
                font-mono
                font-bold
                text-[10px]
                sm:text-xs
                md:text-sm
                px-5
                sm:px-6
                py-2
                sm:py-2.5
                rounded-full
                shadow-lg
              ">
                {lang === "en"
                  ? "Scroll Down ↓"
                  : "เลื่อนลงเพื่อดูข้อมูล ↓"}
              </span>
            </div>
          </motion.div>

          {/* =================================================
              SERVICE GRID
          ================================================= */}
          <div className="
            max-w-6xl
            mx-auto
            w-full
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-8
            lg:gap-10
            items-center
            relative
            z-20
            mt-10
            sm:mt-12
            lg:mt-0
            lg:h-[76vh]
          ">

            {/* LEFT CONTENT */}
            <motion.div
              style={{
                opacity: isDesktop
                  ? contentOpacity
                  : 1,

                x: isDesktop
                  ? contentX
                  : 0,
              }}
              className="
                lg:col-span-7
                w-full
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
                  className="
                    space-y-2.5
                    sm:space-y-3
                  "
                >

                  {/* Service Tag */}
                  <div className="
                    inline-block
                    font-mono
                    text-[9px]
                    sm:text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-amber-800
                    bg-amber-100/90
                    border
                    border-amber-300/80
                    px-3
                    sm:px-3.5
                    py-1
                    rounded-full
                    shadow-sm
                    max-w-full
                  ">
                    {currentService.tag}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="
                      text-2xl
                      sm:text-3xl
                      lg:text-4xl
                      font-black
                      text-stone-900
                      tracking-tight
                      leading-[1.05]
                    ">
                      {currentService.title}
                    </h3>

                    <h4 className="
                      text-[10px]
                      sm:text-sm
                      font-mono
                      font-bold
                      text-amber-700
                      pt-1
                      leading-relaxed
                    ">
                      {currentService.subtitle}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="
                    text-stone-700
                    text-xs
                    sm:text-sm
                    md:text-base
                    leading-[1.6]
                    font-normal
                    max-w-2xl
                  ">
                    {currentService.desc}
                  </p>

                  {/* Scope */}
                  {currentService.items &&
                    currentService.items.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="
                          bg-[#FAF6EE]/95
                          border
                          border-amber-200/80
                          rounded-xl
                          sm:rounded-2xl
                          p-3
                          sm:p-4
                          space-y-2
                          backdrop-blur-md
                          shadow-sm
                        ">
                          <h5 className="
                            font-bold
                            text-xs
                            sm:text-sm
                            text-stone-900
                            flex
                            items-center
                            gap-2
                          ">
                            <span className="
                              w-2
                              h-2
                              rounded-full
                              bg-amber-600
                              shadow-[0_0_8px_rgba(217,119,6,0.6)]
                              shrink-0
                            " />

                            <span>
                              {lang === "en"
                                ? "Service Scope & Capabilities"
                                : "ขอบเขตการให้บริการ"}
                            </span>
                          </h5>

                          <div className="
                            grid
                            grid-cols-1
                            gap-1.5
                            pt-0.5
                          ">
                            {currentService.items.map(
                              (item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="
                                    flex
                                    items-start
                                    gap-2
                                    text-[11px]
                                    sm:text-sm
                                    text-stone-700
                                  "
                                >
                                  <span className="
                                    text-amber-700
                                    font-bold
                                    text-xs
                                    mt-0.5
                                    shrink-0
                                  ">
                                    ✓
                                  </span>

                                  <span className="
                                    leading-relaxed
                                    whitespace-normal
                                    break-words
                                  ">
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
                  <div className="pt-2">
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
                        md:text-sm
                        font-bold
                        uppercase
                        tracking-wider
                        px-5
                        sm:px-7
                        py-2.5
                        sm:py-3
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
                        {lang === "en"
                          ? "Inquire Service Now ↗"
                          : "ติดต่อสอบถามบริการ ↗"}
                      </span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* SERVICE TABS */}
              <div className="
                pt-3
                border-t
                border-stone-200
                space-y-2
                mt-3
              ">
                <span className="
                  text-[9px]
                  sm:text-[10px]
                  font-mono
                  uppercase
                  tracking-widest
                  text-stone-500
                  font-bold
                  block
                ">
                  {lang === "en"
                    ? "Select Core Logistics Service :"
                    : "เลือกบริการหลัก :"}
                </span>

                <div className="
                  flex
                  flex-wrap
                  gap-1.5
                  sm:gap-2
                ">
                  {completeEbookServices.map(
                    (ch, idx) => (
                      <button
                        key={ch.id}
                        onClick={() =>
                          setActiveServiceTab(idx)
                        }
                        className={`
                          px-2.5
                          sm:px-3
                          py-1.5
                          rounded-lg
                          sm:rounded-xl
                          text-[10px]
                          sm:text-xs
                          font-mono
                          transition-all
                          duration-300
                          cursor-pointer
                          leading-tight
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

            {/* RIGHT IMAGE */}
            <div className="
              lg:col-span-5
              w-full
              flex
              items-center
              justify-center
              relative
              mt-6
              lg:mt-0
            ">
              <motion.div
                style={{
                  opacity: isDesktop
                    ? imageOpacity
                    : 1,

                  x: isDesktop
                    ? imageX
                    : 0,

                  scale: isDesktop
                    ? imageScale
                    : 1,
                }}
                className="
                  relative
                  w-full
                  max-w-[270px]
                  sm:max-w-[340px]
                  lg:max-w-[390px]
                  flex
                  items-center
                  justify-center
                "
              >
                <div className="
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
                ">

                  <div className="
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
                  " />

                  <div className="
                    relative
                    w-full
                    h-full
                    rounded-[25px]
                    sm:rounded-[32px]
                    overflow-hidden
                    shadow-[0_20px_50px_rgba(120,53,15,0.14)]
                    border
                    border-stone-200/90
                    group-hover:scale-[1.02]
                    transition-transform
                    duration-500
                  ">
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

                    <div className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/80
                      via-black/20
                      to-transparent
                    " />

                    <div className="
                      absolute
                      bottom-4
                      sm:bottom-5
                      left-4
                      sm:left-5
                      right-4
                      sm:right-5
                      text-left
                      space-y-1
                    ">
                      <span className="
                        text-[8px]
                        sm:text-[10px]
                        font-mono
                        text-amber-300
                        font-extrabold
                        uppercase
                        tracking-widest
                        block
                        drop-shadow-md
                      ">
                        {isMounted &&
                          (subsidiaries[4]?.name ||
                            detailText.heroTitle ||
                            "CONSOLE LINK CO., LTD.")}
                      </span>

                      <h5 className="
                        text-sm
                        sm:text-lg
                        font-black
                        text-white
                        tracking-tight
                        leading-snug
                        drop-shadow-lg
                      ">
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

      {/* =====================================================
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
        {/* Glow */}
        <div className="
          absolute
          top-1/3
          left-1/4
          w-[250px]
          sm:w-[400px]
          lg:w-[500px]
          h-[250px]
          sm:h-[400px]
          lg:h-[500px]
          bg-amber-200/40
          rounded-full
          blur-[100px]
          sm:blur-[130px]
          lg:blur-[140px]
          pointer-events-none
        " />

        <div className="
          absolute
          bottom-1/4
          right-1/4
          w-[250px]
          sm:w-[400px]
          lg:w-[500px]
          h-[250px]
          sm:h-[400px]
          lg:h-[500px]
          bg-orange-100/60
          rounded-full
          blur-[110px]
          sm:blur-[140px]
          lg:blur-[150px]
          pointer-events-none
        " />

        <div className="
          w-full
          max-w-7xl
          mx-auto
          flex
          flex-col
          justify-center
          items-center
          relative
          z-10
          space-y-8
          sm:space-y-10
          lg:space-y-12
        ">

          {/* Header */}
          <ScrollCardReveal direction="up">
            <div className="
              text-center
              space-y-4
              w-full
              max-w-3xl
              mx-auto
            ">
              <div className="
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
                text-[9px]
                sm:text-xs
                font-bold
                text-amber-800
                font-mono
                shadow-sm
                backdrop-blur-md
                max-w-full
              ">
                <i className="fa-solid fa-address-card text-amber-700" />

                <span>
                  {lang === "en"
                    ? "Corporate Communication Directory"
                    : "ข้อมูลติดต่อประสานงานส่วนกลางและฝ่ายการตลาด"}
                </span>
              </div>

              <h3
                className="
                  w-full
                  text-center
                  whitespace-nowrap
                  font-black
                  text-stone-900
                  text-[clamp(1rem,5vw,3rem)]
                  sm:text-[clamp(1.5rem,4vw,3rem)]
                  md:text-5xl
                  tracking-tight
                  leading-tight
                "
              >
                {isMounted &&
                  (subsidiaries[4]?.name ||
                    detailText.heroTitle ||
                    (lang === "en"
                      ? "Console Link Co., Ltd."
                      : "บริษัท คอนโซล ลิงค์ จำกัด"))}
              </h3>

              <p className="
                text-[10px]
                sm:text-xs
                md:text-sm
                text-stone-500
                font-mono
                max-w-2xl
                mx-auto
                leading-relaxed
              ">
                Hotline: 0-2393-2300 (Auto) | Fax:
                0-2393-7307-10 | admincenter@handleintergroup.com
              </p>
            </div>
          </ScrollCardReveal>

          {/* CONTACT CARD */}
          <div className="max-w-4xl w-full mx-auto">
            <ScrollCardReveal
              direction="up"
              delay={100}
              className="h-full"
            >
              <div className="
                w-full
                bg-[#FAF6EE]/90
                hover:bg-[#FAF6EE]
                border
                border-amber-200/70
                hover:border-amber-400/80
                rounded-[35px]
                sm:rounded-tr-[80px]
                sm:rounded-bl-[80px]
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
              ">

                <div className="
                  flex
                  flex-col
                  md:flex-row
                  items-center
                  md:items-stretch
                  gap-6
                  sm:gap-8
                  lg:gap-10
                ">

                  {/* LOGO */}
                  <div className="
                    w-full
                    md:w-5/12
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    space-y-3
                    bg-white/80
                    border
                    border-amber-100
                    rounded-[30px]
                    sm:rounded-tr-[40px]
                    sm:rounded-bl-[40px]
                    sm:rounded-tl-xl
                    sm:rounded-br-xl
                    p-5
                    sm:p-6
                    shadow-sm
                  ">
                    <img
                      src="/images/consol-link.png"
                      alt="Console Link Logo"
                      className="
                        h-14
                        sm:h-20
                        w-auto
                        max-w-[80%]
                        object-contain
                        transition-transform
                        group-hover:scale-105
                      "
                    />

                    <div>
                      <h4 className="
                        font-black
                        text-stone-900
                        text-sm
                        tracking-wider
                        uppercase
                        font-mono
                      ">
                        CONSOLE LINK
                      </h4>

                      <p className="
                        text-[9px]
                        sm:text-[10px]
                        text-stone-500
                        font-medium
                        tracking-tight
                      ">
                        Freight & Consolidation Service
                      </p>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="
                    hidden
                    md:block
                    w-[1.5px]
                    bg-gradient-to-b
                    from-amber-300
                    via-amber-400/50
                    to-transparent
                    rounded-full
                    my-1
                  " />

                  <div className="
                    block
                    md:hidden
                    w-full
                    h-[1.5px]
                    bg-gradient-to-r
                    from-amber-300
                    via-amber-400/50
                    to-transparent
                    rounded-full
                  " />

                  {/* CONTACT INFO */}
                  <div className="
                    w-full
                    md:w-7/12
                    space-y-4
                    text-left
                    flex
                    flex-col
                    justify-center
                  ">
                    <div>
                      <h3 className="
                        font-black
                        text-stone-900
                        text-lg
                        sm:text-2xl
                        tracking-tight
                        leading-snug
                      ">
                        {isMounted &&
                          detailText.contact_name}
                      </h3>

                      <p className="
                        text-[10px]
                        sm:text-xs
                        font-bold
                        text-amber-700
                        tracking-wide
                        mt-1
                        font-mono
                      ">
                        {isMounted &&
                          detailText.contact_position}
                      </p>
                    </div>

                    <div className="
                      space-y-3
                      pt-2
                      text-xs
                      sm:text-sm
                      text-stone-600
                      font-medium
                    ">

                      {/* LOCATION */}
                      <div className="
                        flex
                        items-center
                        gap-3
                      ">
                        <div className="
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
                        ">
                          <i className="fa-solid fa-location-dot" />
                        </div>

                        <span className="text-stone-700">
                          Bangkok & Worldwide Hub
                        </span>
                      </div>

                      {/* PHONE */}
                      <div className="
                        flex
                        items-center
                        gap-3
                      ">
                        <div className="
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
                        ">
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
                          "
                        >
                          {isMounted &&
                            detailText.contact_phone}
                        </a>
                      </div>

                      {/* EMAIL */}
                      <div className="
                        flex
                        items-start
                        gap-3
                      ">
                        <div className="
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
                        ">
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
                            text-xs
                            sm:text-sm
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

          {/* BACK BUTTON */}
          <ScrollCardReveal
            direction="up"
            delay={200}
          >
            <div className="
              pt-2
              sm:pt-4
              text-center
            ">
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
                  py-3
                  sm:py-4
                  rounded-full
                  shadow-lg
                  transition-all
                  duration-300
                  cursor-pointer
                  hover:scale-105
                  active:scale-95
                "
              >
                <i className="
                  fa-solid
                  fa-arrow-left
                  text-[9px]
                " />

                <span>
                  {lang === "en"
                    ? "Back to About Us"
                    : "กลับสู่หน้าเกี่ยวกับเรา"}
                </span>
              </Link>
            </div>
          </ScrollCardReveal>

        </div>
      </section>
    </div>
  );
}