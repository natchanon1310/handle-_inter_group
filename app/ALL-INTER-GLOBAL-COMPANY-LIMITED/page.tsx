"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

/* =========================================================
   COMPANY DATA
========================================================= */

const companyData = {
  companyName: "ALL INTER GLOBAL",
  affiliation: "MEMBER OF HANDLE INTER GROUP",
  tagline: "Active Logistics World in Your Hand",

  overview:
    "ALL INTER GLOBAL has built extensive experience since 2003 as a member of Handle Inter Group. We offer solutions to all your logistics needs by connecting every service from import to export for all destinations worldwide. Everything is made simpler and readily accessible in the palm of your hand.",

  statistics: [
    {
      title: "Group Annual Turnover",
      value: "Over US$30 million",
    },
    {
      title: "Workforce",
      value: "348 employees",
    },
    {
      title: "Global Presence",
      value:
        "Worldwide Network (North America, South America, Europe, Africa, Asia, Australia)",
    },
  ],

  leadership: [
    {
      position: "Managing Director",
      name: "Mr. Somchai Rungborvonwong",
      quote:
        "It is my goal to establish a steady path of growth and stability for Handle Inter Group and our associates, as well as to be the total logistics solution that can address all our clients' needs efficiently.",
    },
    {
      position: "Director",
      name: "Mr. Ochist Ananthanaslip",
      quote:
        "I believe that the dedication of our staff is what made our success possible. We start from connecting our services with the clients' goals.",
    },
  ],

  coreStrengths: [
    {
      number: "1",
      title: "Professional",
      description: "Experienced standards across all operations.",
    },
    {
      number: "2",
      title: "Experience",
      description:
        "Proven track record in international logistics since 2003.",
    },
    {
      number: "3",
      title: "World Wide Network",
      description:
        "Global logistics connectivity spanning six continents.",
    },
    {
      number: "4",
      title: "Total Logistics Solution",
      description:
        "End-to-end integration covering all transport and supply chain requirements.",
    },
    {
      number: "5",
      title: "Teamwork",
      description:
        "Dedicated personnel working collaboratively for optimal client outcomes.",
    },
  ],

  responsibilities: [
    {
      title: "Clients",
      description:
        "Delivering high-quality services through deep experience and expertise, guided by honesty and integrity.",
    },
    {
      title: "Employees",
      description:
        "Providing continuous skill development to achieve higher quality and efficiency within a safe work environment.",
    },
    {
      title: "Partners",
      description:
        "Protecting each party's interests under mutual agreements backed by transparent financial policies.",
    },
    {
      title: "Allies",
      description:
        "Ensuring integrity throughout every operational, coordination, and financial process while fostering long-term relationships without taking undue advantage.",
    },
  ],

  services: [
    {
      number: "1",
      title: "Export-Import Consolidator (Sea / Air)",
      description:
        "Comprehensive maritime and airfreight consolidation connecting global trade routes efficiently.",
      icon: "🚢",
      img: "/images/cardair.png",
    },
    {
      number: "2",
      title: "Freezone Warehouse",
      description:
        "Secure and flexible bonded/freezone storage solutions streamlining international inventory distribution.",
      icon: "🏭",
      img: "/images/freezzone.jpeg",
    },
    {
      number: "3",
      title: "Customs Clearance & Cross Border",
      description:
        "Committed brokerage services ensuring swift compliance, clearance, and seamless border crossings.",
      icon: "📑",
      img: "/images/Customs.jpeg",
    },
    {
      number: "4",
      title: "Project Cargo & Trucking Inland",
      description:
        "Specialized freight management for oversized heavy-lift consignments supported by an extensive domestic trucking fleet.",
      icon: "🚛",
      img: "/images/projectimage.png",
    },
    {
      number: "5",
      title: "Packing & Move",
      description:
        "Industrial-grade packing, crating, and reliable relocation solutions designed for delicate and high-value cargo.",
      icon: "📦",
      img: "/images/pack.jpeg",
    },
  ],

  milestones: [
    {
      year: "2003",
      description: "Foundation of H.I.T Intercon",
    },
    {
      year: "2004",
      description: "Establishment of Handle Inter Logistics",
    },
    {
      year: "2005",
      description: "Launch of Handle Inter Consolidation",
    },
    {
      year: "2007",
      description: "Consol Link",
    },
    {
      year: "2008",
      description: "Siam Liner",
    },
    {
      year: "2009",
      description: "Alpine Shipping (Thailand)",
    },
    {
      year: "2013",
      description: "Siam Warehousing",
    },
    {
      year: "2018",
      description: "ISO 9001:2015 Certification",
    },
    {
      year: "2021",
      description:
        "All Inter Global Company Limited / PKT E-Commerce",
    },
  ],

  locations: [
    {
      number: "01",
      title: "Head Office",
      building: "Handle Inter Group Building",
      address:
        "1 Soi Bangna-Trad 21 (Yaek 9-11), Bangnaneua, Bangna, Bangkok, Thailand",
      phone: "+66 2 393 2300",
    },
    {
      number: "02",
      title: "Airport Office",
      building: "Building AO4, 4th Floor, Room 24",
      address:
        "Free Trade Zone, Suvarnabhumi International Airport, 999 Moo 7, Racha Thewa, Bang Phli, Samut Prakan, Thailand",
      phone: "+66 2 132 1888",
    },
  ],
};

/* =========================================================
   SCROLL CARD REVEAL
========================================================= */

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
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
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
      return "-translate-x-12 sm:-translate-x-16 opacity-0 scale-[0.97]";
    }

    if (direction === "right") {
      return "translate-x-12 sm:translate-x-16 opacity-0 scale-[0.97]";
    }

    return "translate-y-10 sm:translate-y-12 opacity-0 scale-[0.97]";
  };

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transform-gpu transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ConsoleLinkPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState(0);

  /* =======================================================
     TRUE DESKTOP SERVICE SCROLL LOCK
  ======================================================= */

  /* =======================================================
     TRUE DESKTOP SERVICE SCROLL LOCK
     SMOOTH / CINEMATIC VERSION
  ======================================================= */

  const lockContainerRef = useRef<HTMLDivElement>(null);

  /*
   * 0 = beginning of Services
   * 1 = end of Services
   */
  const serviceProgress = useMotionValue(0);

  /*
   * Softer spring for cinematic movement.
   *
   * Lower stiffness
   * Higher mass
   * Smooth damping
   */
  const smoothProgress = useSpring(serviceProgress, {
    stiffness: 85,
    damping: 27,
    mass: 0.38,
    restDelta: 0.0005,
  });

  /*
   * TRUE lock state
   */
  const serviceLockedRef = useRef(false);

  /*
   * Current target progress.
   * This is kept in ref so wheel events don't wait for React.
   */
  const serviceProgressRef = useRef(0);

  /*
   * Prevent multiple unlock calls.
   */
 const unlockingRef = useRef(false);

/*
 * ป้องกันไม่ให้ wheel event เดิม
 * ทำให้ Services lock กลับเข้ามาอีกครั้ง
 * ระหว่างกำลัง transition ไป Section ถัดไป
 */
const serviceTransitioningRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);

  const wheelFrameRef =
    useRef<number | null>(null);

  /* =======================================================
     SERVICE PROGRESS HELPERS
  ======================================================= */

  const setServiceProgress = (value: number) => {
    const next = Math.max(
      0,
      Math.min(1, value)
    );

    serviceProgressRef.current = next;

    serviceProgress.set(next);
  };

  /* =======================================================
     LOCK SERVICES
  ======================================================= */

  const lockServices = (
    startProgress: number
  ) => {
    const section =
      lockContainerRef.current;

    if (!section) return;

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    /*
     * Immediately align the viewport to
     * the beginning of Section 6.
     *
     * Do NOT use smooth scrolling here.
     */
    window.scrollTo({
      top: sectionTop,
      behavior: "auto",
    });

    /*
     * Clear any old wheel movement.
     */
    wheelAccumulatorRef.current = 0;

    /*
     * Start progress.
     */
    setServiceProgress(startProgress);

    /*
     * Lock browser page scrolling.
     */
    serviceLockedRef.current = true;

    unlockingRef.current = false;

    setActiveSection("Our service");
  };

  /* =======================================================
     UNLOCK SERVICES
  ======================================================= */

/* =======================================================
   UNLOCK SERVICES
   → เมื่อ Scroll Services จบ ให้ไป Contact Us
======================================================= */

const unlockServices = (
  direction: "down" | "up"
) => {
  if (unlockingRef.current) return;

  unlockingRef.current = true;
  serviceTransitioningRef.current = true;

  wheelAccumulatorRef.current = 0;

  /*
   * ============================================
   * SCROLL DOWN
   * Services → Contact Us
   * ============================================
   */

  if (direction === "down") {
    /*
     * จบ animation ของ Services
     */
    setServiceProgress(1);

    /*
     * ปลด lock ทันที
     */
    serviceLockedRef.current = false;

    /*
     * หา Section ถัดไป
     */
    const nextSection =
      document.getElementById("Contact Us");

    if (nextSection) {
      const targetTop =
        nextSection.getBoundingClientRect().top +
        window.scrollY;

      /*
       * รอให้ browser จบ wheel event
       * ก่อนเลื่อนไป Section ถัดไป
       */
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.scrollTo({
            top: targetTop,
            behavior: "smooth",
          });
        });
      });
    }

    /*
     * ป้องกันการ lock กลับเข้า Services
     * ระหว่าง transition
     */
    window.setTimeout(() => {
      serviceTransitioningRef.current = false;
      unlockingRef.current = false;
    }, 700);

    return;
  }

  /*
   * ============================================
   * SCROLL UP
   * Services → Responsibilities
   * ============================================
   */

  setServiceProgress(0);

  serviceLockedRef.current = false;

  const previousSection =
    document.getElementById(
      "responsibilities"
    );

  if (previousSection) {
    const targetTop =
      previousSection.getBoundingClientRect().top +
      window.scrollY;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      });
    });
  }

  window.setTimeout(() => {
    serviceTransitioningRef.current = false;
    unlockingRef.current = false;
  }, 700);
};

  /* =======================================================
     DESKTOP WHEEL LOCK
     ======================================================= */

  useEffect(() => {
    if (!isMounted) return;

    const isDesktop = () =>
      window.innerWidth >= 1024;

    /* =====================================================
       GET SECTION POSITION
    ===================================================== */

    const getSectionState = () => {
      const section =
        lockContainerRef.current;

      if (!section) return null;

      const rect =
        section.getBoundingClientRect();

      /*
       * Slightly larger tolerance prevents
       * jitter when browser reports fractional pixels.
       */
      const tolerance = 12;

      const atTop =
        Math.abs(rect.top) <= tolerance;

      const atBottom =
        Math.abs(
          rect.bottom -
            window.innerHeight
        ) <= tolerance;

      return {
        section,
        rect,
        atTop,
        atBottom,
      };
    };

    /* =====================================================
       NORMALIZE WHEEL DELTA
       Supports:
       - Trackpad
       - Mouse wheel
       - Line based wheel
       - Page based wheel
    ===================================================== */

    const normalizeWheelDelta = (
      event: WheelEvent
    ) => {
      let delta = event.deltaY;

      /*
       * DOM_DELTA_LINE
       */
      if (
        event.deltaMode ===
        WheelEvent.DOM_DELTA_LINE
      ) {
        delta *= 16;
      }

      /*
       * DOM_DELTA_PAGE
       */
      if (
        event.deltaMode ===
        WheelEvent.DOM_DELTA_PAGE
      ) {
        delta *= window.innerHeight;
      }

      /*
       * Prevent a single huge wheel event
       * from jumping through the entire section.
       */
      return Math.max(
        -100,
        Math.min(100, delta)
      );
    };

    /* =====================================================
       PROCESS WHEEL
       Runs once per animation frame.
    ===================================================== */

    const flushWheel = () => {
      wheelFrameRef.current = null;

      const rawDelta =
        wheelAccumulatorRef.current;

      wheelAccumulatorRef.current = 0;

      if (!rawDelta) return;

      /*
       * Extra safety.
       *
       * Prevent accumulated wheel events
       * from creating a giant progress jump.
       */
      const delta = Math.max(
        -120,
        Math.min(120, rawDelta)
      );

      /*
       * LOWER = smoother / longer scroll
       *
       * 100px wheel ≈ 0.085 progress
       */
      const sensitivity = 0.00085;

      const progressDelta =
        delta * sensitivity;

      const current =
        serviceProgressRef.current;

      const next = Math.max(
        0,
        Math.min(
          1,
          current + progressDelta
        )
      );

      setServiceProgress(next);

      /* =================================================
         REACHED END
      ================================================= */

      if (
        next >= 0.999 &&
        delta > 0
      ) {
        setServiceProgress(1);

        window.requestAnimationFrame(() => {
          unlockServices("down");
        });

        return;
      }

      /* =================================================
         REACHED BEGINNING
      ================================================= */

      if (
        next <= 0.001 &&
        delta < 0
      ) {
        setServiceProgress(0);

        window.requestAnimationFrame(() => {
          unlockServices("up");
        });

        return;
      }
    };

    /* =====================================================
       QUEUE WHEEL
    ===================================================== */

    const queueWheelDelta = (
      deltaY: number
    ) => {
      /*
       * Accumulate wheel movement.
       *
       * This is what makes trackpad scrolling
       * much smoother than processing every event.
       */
      wheelAccumulatorRef.current +=
        deltaY;

      /*
       * Prevent runaway accumulation.
       */
      wheelAccumulatorRef.current =
        Math.max(
          -180,
          Math.min(
            180,
            wheelAccumulatorRef.current
          )
        );

      /*
       * Only one RAF at a time.
       */
      if (
        wheelFrameRef.current !== null
      ) {
        return;
      }

      wheelFrameRef.current =
        window.requestAnimationFrame(
          flushWheel
        );
    };

    /* =====================================================
       WHEEL EVENT
    ===================================================== */

    const handleWheel = (
      event: WheelEvent
    ) => {
      if (!isDesktop()) return;

      if (serviceTransitioningRef.current) {
    return;
  }

  const state =
    getSectionState();

      if (!state) return;

      const {
        atTop,
        atBottom,
      } = state;

      const deltaY =
        normalizeWheelDelta(event);

      if (!deltaY) return;

      /* =================================================
         ENTER SECTION 6 FROM ABOVE
      ================================================= */

     if (
  !serviceLockedRef.current &&
  !serviceTransitioningRef.current &&
  deltaY > 0 &&
  atTop
) {
  event.preventDefault();
  event.stopPropagation();

  lockServices(0);

  queueWheelDelta(deltaY);

  return;
}
      /* =================================================
         ENTER SECTION 6 FROM BELOW
      ================================================= */

      if (
  !serviceLockedRef.current &&
  !serviceTransitioningRef.current &&
  deltaY < 0 &&
  atBottom
) {
  event.preventDefault();
  event.stopPropagation();

  lockServices(1);

  queueWheelDelta(deltaY);

  return;
}

      /* =================================================
         SECTION 6 IS LOCKED
      ================================================= */

      if (serviceLockedRef.current) {
        event.preventDefault();
        event.stopPropagation();

        queueWheelDelta(deltaY);
      }
    };

    /* =====================================================
       ADD WHEEL LISTENER
    ===================================================== */

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
        capture: true,
      }
    );

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel,
        true
      );

      if (
        wheelFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          wheelFrameRef.current
        );

        wheelFrameRef.current = null;
      }

      wheelAccumulatorRef.current = 0;
    };
  }, [isMounted]);

  /* =======================================================
     KEYBOARD LOCK
  ======================================================= */

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (window.innerWidth < 1024) {
        return;
      }

      if (!serviceLockedRef.current) {
        return;
      }

      /* =================================================
         DOWN
      ================================================= */

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        event.stopPropagation();

        const next = Math.min(
          1,
          serviceProgressRef.current +
            0.06
        );

        setServiceProgress(next);

        if (next >= 0.999) {
          setServiceProgress(1);
          unlockServices("down");
        }

        return;
      }

      /* =================================================
         UP
      ================================================= */

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();
        event.stopPropagation();

        const next = Math.max(
          0,
          serviceProgressRef.current -
            0.06
        );

        setServiceProgress(next);

        if (next <= 0.001) {
          setServiceProgress(0);
          unlockServices("up");
        }

        return;
      }

      /* =================================================
         PREVENT PAGE JUMP
      ================================================= */

      if (
        event.key === "Home" ||
        event.key === "End"
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
      {
        capture: true,
      }
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
        true
      );
    };
  }, [isMounted]);

  /* =======================================================
     RESIZE SAFETY
  ======================================================= */

  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      /*
       * Desktop -> Mobile
       *
       * Never leave the page locked.
       */
      if (
        window.innerWidth < 1024 &&
        serviceLockedRef.current
      ) {
        serviceLockedRef.current = false;

        unlockingRef.current = false;

        wheelAccumulatorRef.current = 0;

        if (
          wheelFrameRef.current !== null
        ) {
          cancelAnimationFrame(
            wheelFrameRef.current
          );

          wheelFrameRef.current = null;
        }

        setServiceProgress(0);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [isMounted]);

  /* =======================================================
     DESKTOP SERVICE ANIMATION
  ======================================================= */

  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.12, 0.24],
    [1, 0.65, 0]
  );

  const titleScale = useTransform(
    smoothProgress,
    [0, 0.24],
    [1, 0.94]
  );

  const contentX = useTransform(
    smoothProgress,
    [0.10, 0.55],
    [-90, 0]
  );

  const contentOpacity = useTransform(
    smoothProgress,
    [0.10, 0.55],
    [0, 1]
  );

  const imageX = useTransform(
    smoothProgress,
    [0.10, 0.55],
    [90, 0]
  );

  const imageOpacity = useTransform(
    smoothProgress,
    [0.10, 0.55],
    [0, 1]
  );

  const imageScale = useTransform(
    smoothProgress,
    [0.10, 0.55],
    [0.9, 1]
  );

  const progressWidth = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", "100%"]
  );

  /*
   * IMPORTANT:
   * Don't call useTransform() directly inside JSX.
   */
  const lockStatusOpacity =
    useTransform(
      smoothProgress,
      [0, 0.03, 0.95, 1],
      [1, 1, 1, 0.35]
    );

  /* =======================================================
     LANGUAGE
  ======================================================= */

  useEffect(() => {
    setIsMounted(true);

    const checkLang = () => {
      const savedLang =
        localStorage.getItem("lang");

      if (
        savedLang === "th" ||
        savedLang === "en"
      ) {
        setLang(savedLang);
      } else {
        setLang("en");
      }
    };

    checkLang();

    window.addEventListener(
      "langChange",
      checkLang
    );

    return () =>
      window.removeEventListener(
        "langChange",
        checkLang
      );
  }, []);

  /* =======================================================
     SECTIONS
  ======================================================= */

  const sections = useMemo(
    () => [
      {
        id: "overview",
        label:
          lang === "en"
            ? "Overview"
            : "ภาพรวม",
      },
      {
        id: "companyprofile",
        label:
          lang === "en"
            ? "Company Profile"
            : "ข้อมูลบริษัท",
      },
      {
        id: "leadership",
        label:
          lang === "en"
            ? "Leadership & Visions"
            : "ผู้บริหารและวิสัยทัศน์",
      },
      {
        id: "strengths",
        label:
          lang === "en"
            ? "Core Strengths"
            : "จุดแข็งหลัก",
      },
      {
        id: "responsibilities",
        label:
          lang === "en"
            ? "Corporate Responsibilities"
            : "ความรับผิดชอบขององค์กร",
      },
      {
        id: "Our service",
        label:
          lang === "en"
            ? "Services & Capabilities"
            : "บริการและความสามารถ",
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

  /* =======================================================
     CURRENT SERVICE
  ======================================================= */

  const currentService =
    companyData.services[
      activeServiceTab
    ] ?? companyData.services[0];

  /* =======================================================
     ACTIVE SECTION DETECTION
  ======================================================= */

  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const scrollPosition =
          window.scrollY + 300;

        for (const section of sections) {
          const el =
            document.getElementById(
              section.id
            );

          if (!el) continue;

          const top =
            el.getBoundingClientRect().top +
            window.scrollY;

          const height = el.offsetHeight;

          if (
            scrollPosition >= top &&
            scrollPosition < top + height
          ) {
            setActiveSection(
              section.id
            );
            break;
          }
        }

        ticking = false;
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    handleScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [isMounted, sections]);

  /* =======================================================
     SCROLL TO SECTION
  ======================================================= */

  const scrollToSection = (id: string) => {
    /*
     * ถ้ากำลัง lock Services
     * ให้ปลดก่อน
     */
    if (serviceLockedRef.current) {
      serviceLockedRef.current = false;
      unlockingRef.current = false;
    }

    /*
     * ถ้ากดเข้า Services โดยตรง
     * เริ่มจาก 0
     */
    if (id === "Our service") {
      setServiceProgress(0);
      serviceProgressRef.current = 0;
    }

    /*
     * ถ้ากด Contact โดยตรง
     * ถือว่า Services ผ่านแล้ว
     */
    if (id === "Contact Us") {
      setServiceProgress(1);
      serviceProgressRef.current = 1;
    }

    const element =
      document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden bg-slate-100 text-slate-800">

      {/* ===================================================
          SIDE PROGRESS
      =================================================== */}

      <div className="fixed right-5 xl:right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col space-y-4 xl:space-y-5 items-end">
        {sections.map((section) => {
          const isActive =
            isMounted &&
            activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() =>
                scrollToSection(
                  section.id
                )
              }
              className="group flex items-center gap-3 xl:gap-4 focus:outline-none cursor-pointer"
              aria-label={`Go to ${section.label}`}
            >
              <span
                className={`max-w-[160px] text-[9px] xl:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 text-right ${
                  isActive
                    ? "text-orange-600 translate-x-0 opacity-100"
                    : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
                }`}
              >
                {section.label}
              </span>

              <div className="relative w-6 xl:w-8 h-8 flex items-center justify-end">
                <span
                  className={`absolute transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-6 xl:w-8 h-[3px] bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.8)]"
                      : "w-3 xl:w-4 h-[1.5px] bg-gray-300 group-hover:bg-orange-400 group-hover:w-5 xl:group-hover:w-6"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ===================================================
          SECTION 1 — HERO
      =================================================== */}

      <section
        id="overview"
        className="relative w-full min-h-[100svh] lg:min-h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden border-b border-slate-800"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/images/all-inter-global.jpeg"
            alt={companyData.companyName}
            className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/20 z-10" />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 text-center relative z-20 pt-20 pb-12 w-full">
          <ScrollCardReveal
            direction="up"
            delay={100}
          >
            <div className="inline-block max-w-full bg-orange-600/90 backdrop-blur-md px-4 sm:px-5 py-1.5 rounded-full shadow-lg mb-5">
              <span className="text-[9px] sm:text-xs font-bold text-white uppercase tracking-[0.12em] sm:tracking-widest font-mono">
                {companyData.affiliation}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-md">
              {companyData.companyName}
            </h1>

            <div className="w-16 sm:w-20 h-1 bg-orange-500 mx-auto rounded-full my-5 sm:my-6" />

            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-orange-400 tracking-wide leading-tight max-w-3xl mx-auto">
              {companyData.tagline}
            </h2>

            <p className="text-slate-200 max-w-4xl mx-auto mt-6 sm:mt-7 text-xs sm:text-sm md:text-base leading-7">
              {companyData.overview}
            </p>

            <div className="pt-7 sm:pt-8 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  scrollToSection(
                    "companyprofile"
                  )
                }
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-600/30 inline-flex items-center gap-3 cursor-pointer"
              >
                <span>
                  {lang === "en"
                    ? "EXPLORE COMPANY PROFILE"
                    : "ดูข้อมูลบริษัท"}
                </span>

                <span className="animate-bounce">
                  ↓
                </span>
              </button>
            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* ===================================================
          SECTION 2 — COMPANY PROFILE
      =================================================== */}

      <section
        id="companyprofile"
        className="relative w-full bg-[#FDFBF7] text-stone-900 py-16 sm:py-20 md:py-28 px-5 sm:px-8 lg:px-16 border-b border-stone-200"
      >
        <div className="max-w-7xl mx-auto">

          <ScrollCardReveal direction="up">
            <div className="max-w-5xl mx-auto text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-4">
                {companyData.affiliation}
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 sm:mb-8 leading-tight">
                {companyData.companyName}
              </h2>

              <p className="text-stone-700 text-sm sm:text-base md:text-lg leading-7 sm:leading-relaxed">
                {companyData.overview}
              </p>
            </div>
          </ScrollCardReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-14">
            {companyData.statistics.map(
              (stat, index) => (
                <ScrollCardReveal
                  key={stat.title}
                  direction="up"
                  delay={index * 100}
                  className="h-full"
                >
                  <div className="h-full bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="text-orange-600 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
                      {stat.title}
                    </div>

                    <div className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 leading-tight">
                      {stat.value}
                    </div>
                  </div>
                </ScrollCardReveal>
              )
            )}
          </div>

          <div className="mt-14 sm:mt-20">
            <ScrollCardReveal direction="up">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-7 sm:mb-8">
                <span className="text-[10px] sm:text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono">
                  Interactive Presentation
                </span>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                  Company Profile
                </h2>

                <p className="text-xs text-neutral-500">
                  Browse our official digital company brochure below.
                </p>
              </div>
            </ScrollCardReveal>

            <div className="w-full max-w-5xl mx-auto bg-black/90 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-stone-300 p-1.5 sm:p-4">
              <div className="relative w-full h-[460px] sm:h-[620px] md:h-[700px] rounded-lg sm:rounded-xl overflow-hidden">
                <iframe
                  src="https://heyzine.com/flip-book/975d37c84c.html"
                  title="ALL INTER GLOBAL Company Profile"
                  className="w-full h-full border-0 rounded-lg sm:rounded-xl"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 3 — LEADERSHIP & VISIONS
      =================================================== */}

      <section
        id="leadership"
        className="relative w-full bg-[#FDFBF7] text-stone-900 py-16 sm:py-20 md:py-28 px-5 sm:px-8 lg:px-16 border-b border-stone-200 overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-amber-200/40 rounded-full blur-[120px] sm:blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollCardReveal direction="up">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[10px] sm:text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-3">
                LEADERSHIP & VISIONS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                LEADERSHIP & VISIONS
              </h2>
            </div>
          </ScrollCardReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
            {companyData.leadership.map(
              (leader, index) => (
                <ScrollCardReveal
                  key={leader.name}
                  direction={
                    index === 0
                      ? "left"
                      : "right"
                  }
                  delay={index * 150}
                  className="h-full"
                >
                  <div className="h-full bg-white border border-stone-200 rounded-2xl sm:rounded-[32px] p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="text-orange-600 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-3">
                      {leader.position}
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-6 sm:mb-7 leading-tight">
                      {leader.name}
                    </h3>

                    <blockquote className="border-l-4 border-orange-500 pl-4 sm:pl-6 text-stone-600 text-sm sm:text-base leading-7 sm:leading-relaxed italic">
                      "{leader.quote}"
                    </blockquote>
                  </div>
                </ScrollCardReveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 4 — CORE STRENGTHS
      =================================================== */}

      <section
        id="strengths"
        className="relative w-full bg-stone-950 text-white py-16 sm:py-20 md:py-28 px-5 sm:px-8 lg:px-16 border-b border-stone-800"
      >
        <div className="max-w-7xl mx-auto">
          <ScrollCardReveal direction="up">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[10px] sm:text-[11px] font-bold text-orange-400 uppercase tracking-widest block font-mono mb-3">
                CORE STRENGTHS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                CORE STRENGTHS
              </h2>
            </div>
          </ScrollCardReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-5">
            {companyData.coreStrengths.map(
              (strength, index) => (
                <ScrollCardReveal
                  key={strength.number}
                  direction="up"
                  delay={index * 100}
                  className="h-full"
                >
                  <div className="h-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7 hover:bg-white/10 transition-all duration-500">
                    <div className="text-orange-500 font-black text-4xl mb-5 sm:mb-6">
                      {strength.number}
                    </div>

                    <h3 className="text-lg font-black mb-3 leading-tight">
                      {strength.title}
                    </h3>

                    <p className="text-sm text-stone-400 leading-7">
                      {strength.description}
                    </p>
                  </div>
                </ScrollCardReveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 5 — CORPORATE RESPONSIBILITIES
      =================================================== */}

      <section
        id="responsibilities"
        className="relative w-full bg-[#FDFBF7] text-stone-900 py-16 sm:py-20 md:py-28 px-5 sm:px-8 lg:px-16 border-b border-stone-200"
      >
        <div className="max-w-7xl mx-auto">
          <ScrollCardReveal direction="up">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[10px] sm:text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-3">
                CORPORATE RESPONSIBILITIES
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                CORPORATE RESPONSIBILITIES
              </h2>
            </div>
          </ScrollCardReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {companyData.responsibilities.map(
              (item, index) => (
                <ScrollCardReveal
                  key={item.title}
                  direction={
                    index % 2 === 0
                      ? "left"
                      : "right"
                  }
                  delay={index * 100}
                  className="h-full"
                >
                  <div className="h-full bg-[#FAF6EE] border border-amber-200/70 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500">
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-4 leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-stone-600 text-sm sm:text-base leading-7 sm:leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </ScrollCardReveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 6 — SERVICES & CAPABILITIES
          TRUE DESKTOP SCROLL LOCK
      =================================================== */}

      <section
        id="Our service"
        className="relative w-full bg-[#F8F6F1] text-stone-900 border-b border-stone-200"
      >
        {/* =================================================
            DESKTOP
            -----------------------------------------------
            IMPORTANT:
            ไม่ใช้ 250vh
            ไม่ใช้ sticky scroll track

            Section มีขนาดเท่าหน้าจอจริง
            แล้ว wheel event จะเป็นตัวควบคุม animation
        ================================================= */}

        <div
          ref={lockContainerRef}
          className="relative hidden h-[100dvh] w-full lg:block overflow-hidden"
        >
          {/* =================================================
              BACKGROUND
          ================================================= */}

          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[#F8F6F1]" />

            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2200&q=80"
              alt="Worldwide Logistics Network"
              className="absolute inset-0 h-full w-full object-cover opacity-[0.035] grayscale"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(245,158,11,0.16),transparent_32%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_75%,rgba(251,146,60,0.08),transparent_30%)]" />

            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#F8F6F1]" />

            <div className="absolute -right-60 -top-60 h-[700px] w-[700px] rounded-full bg-orange-300/10 blur-[170px]" />

            <div className="absolute -bottom-60 -left-60 h-[650px] w-[650px] rounded-full bg-amber-200/10 blur-[160px]" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(#292524 1px, transparent 1px), linear-gradient(90deg, #292524 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />

            <div className="absolute -right-20 top-[22%] h-[500px] w-[500px] rounded-full border border-orange-300/20" />

            <div className="absolute -right-4 top-[27%] h-[380px] w-[380px] rounded-full border border-orange-300/15" />
          </div>

          {/* =================================================
              MAIN VIEWPORT
          ================================================= */}

          <div className="relative z-10 h-full w-full px-5 py-8 sm:px-8 lg:px-14 xl:px-20">

            {/* =================================================
                TITLE
            ================================================= */}

            <motion.div
              style={{
                opacity: titleOpacity,
                scale: titleScale,
              }}
              className="absolute left-5 right-5 top-[7%] z-20 pointer-events-none sm:left-8 sm:right-8 lg:left-14 lg:right-14 xl:left-20 xl:right-20"
            >
              <div className="mx-auto max-w-[1250px]">

                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-xl">
                    <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />

                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                      SERVICES & CAPABILITIES
                    </span>
                  </span>

                  <span className="hidden h-px w-12 bg-orange-200 sm:block" />
                </div>

                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.055em] text-stone-900 sm:text-6xl md:text-7xl lg:text-[78px] xl:text-[88px]">
                  ALL INTER GLOBAL

                  <br />

                  <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Active Logistics World in Your Hand
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-sm font-normal leading-relaxed text-stone-500 sm:text-base md:text-lg">
                  Scroll down to experience our superior one-stop service quality and complete worldwide logistics ecosystem.
                </p>

                <div className="pt-5">
                  <span className="inline-flex items-center gap-3 rounded-full bg-stone-900 px-6 py-3 font-mono text-xs font-bold text-amber-50 shadow-xl shadow-stone-900/10 sm:text-sm">
                    Scroll Down

                    <span className="text-base text-orange-400">
                      ↓
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                SERVICE CONTENT
            ================================================= */}

            <div className="absolute inset-x-0 top-[23vh] bottom-[14vh]">
              <div className="mx-auto h-full w-full max-w-[1400px] px-8 xl:px-12">
                <div className="grid h-full w-full grid-cols-12 items-center gap-8 xl:gap-12">

                  {/* =================================================
                      LEFT — SERVICE CARD
                  ================================================= */}

                  <motion.div
                    style={{
                      opacity: contentOpacity,
                      x: contentX,
                    }}
                    className="relative z-30 col-span-7 min-w-0"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentService.number}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -20,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                      >
                        <div className="pointer-events-none absolute -left-5 -top-16 select-none text-[140px] font-black leading-none text-stone-900/[0.035] sm:text-[180px]">
                          {currentService.number}
                        </div>

                        <div className="relative w-full max-w-[700px] overflow-hidden rounded-[30px] border border-white bg-white/90 shadow-[0_30px_100px_rgba(28,25,23,0.10)] backdrop-blur-2xl xl:rounded-[34px]">

                          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-orange-700 via-orange-500 to-amber-400" />

                          <div className="p-7 sm:p-9 xl:p-11">

                            <div className="mb-6 flex items-center justify-between">
                              <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3.5 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-orange-700">
                                  SERVICE{" "}
                                  {String(
                                    activeServiceTab + 1
                                  ).padStart(2, "0")}
                                </span>
                              </div>

                              <span className="hidden text-[9px] font-mono uppercase tracking-[0.2em] text-stone-300 sm:block">
                                ALL INTER GLOBAL
                              </span>
                            </div>

                            <h3 className="max-w-[620px] text-3xl font-black leading-[0.98] tracking-[-0.045em] text-stone-900 sm:text-4xl lg:text-[48px]">
                              {currentService.title}
                            </h3>

                            <div className="my-7 flex items-center gap-3">
                              <div className="h-[2px] w-12 bg-orange-500" />
                              <div className="h-px flex-1 bg-stone-100" />
                            </div>

                            <p className="max-w-xl text-sm font-normal leading-[1.8] text-stone-600 sm:text-base">
                              {currentService.description}
                            </p>

                            <div className="pt-7">
                              <button
                                type="button"
                                onClick={() =>
                                  scrollToSection(
                                    "Contact Us"
                                  )
                                }
                                className="group inline-flex cursor-pointer items-center gap-4 rounded-full bg-stone-900 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-amber-50 shadow-xl shadow-stone-900/10 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-orange-500/20 active:scale-95 sm:px-7 sm:text-sm"
                              >
                                <span>
                                  Inquire Service Now ↗
                                </span>
                              </button>
                            </div>

                            <div className="mt-9 border-t border-stone-100 pt-7">
                              <div className="grid grid-cols-3">

                                <div className="pr-4">
                                  <div className="text-xl font-black text-stone-900 sm:text-2xl">
                                    24/7
                                  </div>

                                  <div className="mt-1 text-[9px] font-mono uppercase tracking-widest text-stone-400 sm:text-[10px]">
                                    Operation
                                  </div>
                                </div>

                                <div className="border-l border-stone-100 px-4">
                                  <div className="text-xl font-black text-stone-900 sm:text-2xl">
                                    Global
                                  </div>

                                  <div className="mt-1 text-[9px] font-mono uppercase tracking-widest text-stone-400 sm:text-[10px]">
                                    Network
                                  </div>
                                </div>

                                <div className="border-l border-stone-100 pl-4">
                                  <div className="text-xl font-black text-orange-600 sm:text-2xl">
                                    {currentService.number}
                                  </div>

                                  <div className="mt-1 text-[9px] font-mono uppercase tracking-widest text-stone-400 sm:text-[10px]">
                                    Service
                                  </div>
                                </div>

                              </div>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  {/* =================================================
                      RIGHT — IMAGE
                  ================================================= */}

                  <motion.div
                    style={{
                      opacity: imageOpacity,
                      x: imageX,
                      scale: imageScale,
                    }}
                    className="relative z-20 col-span-5 flex min-w-0 items-center justify-center"
                  >
                    <div className="relative h-[58dvh] max-h-[600px] w-[42dvh] max-w-full">

                      <div className="absolute inset-8 rounded-[50px] bg-orange-400/20 blur-[80px]" />

                      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-orange-300/40" />

                      <div className="absolute -right-3 -top-3 h-28 w-28 rounded-full border border-orange-300/30" />

                      <div className="relative h-full w-full overflow-hidden rounded-[42px] border-[7px] border-white shadow-[0_35px_90px_rgba(28,25,23,0.18)]">

                        <img
                          src={currentService.img}
                          alt={currentService.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                        <div className="absolute left-6 top-6">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-2 backdrop-blur-xl">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-white">
                              Global Logistics
                            </span>
                          </span>
                        </div>

                        <div className="absolute right-6 top-6">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                            {currentService.icon}
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                          <span className="mb-2 block text-[9px] font-mono font-extrabold uppercase tracking-[0.2em] text-orange-300">
                            ALL INTER GLOBAL COMPANY LIMITED
                          </span>

                          <h5 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                            {currentService.title}
                          </h5>
                        </div>

                      </div>

                      <div className="absolute -bottom-2 -left-7 w-[200px] rounded-2xl border border-white bg-white/95 p-4 shadow-[0_20px_60px_rgba(28,25,23,0.15)] backdrop-blur-xl xl:bottom-10">

                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-600">
                            {currentService.icon}
                          </div>

                          <div>
                            <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
                              Service
                            </div>

                            <div className="text-sm font-black text-stone-900">
                              {currentService.number}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-stone-100">
                          <motion.div
                            style={{
                              width: progressWidth,
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-400"
                          />
                        </div>

                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>

            {/* =================================================
                SERVICE TABS
            ================================================= */}

            <div className="absolute bottom-6 left-5 right-5 z-40 sm:left-8 sm:right-8 lg:left-14 lg:right-14 xl:left-20 xl:right-20">
              <div className="mx-auto max-w-[1250px]">

                <div className="rounded-[25px] border border-white bg-white/90 p-2 shadow-[0_15px_60px_rgba(28,25,23,0.10)] backdrop-blur-xl sm:rounded-full">

                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">

                    {companyData.services.map(
                      (service, index) => (
                        <button
                          key={service.number}
                          type="button"
                          onClick={() =>
                            setActiveServiceTab(
                              index
                            )
                          }
                          className={`group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full px-4 py-3 text-xs font-mono whitespace-nowrap transition-all duration-300 sm:px-5 ${
                            activeServiceTab ===
                            index
                              ? "scale-[1.02] bg-stone-900 text-amber-50 shadow-lg"
                              : "text-stone-500 hover:bg-orange-50 hover:text-orange-700"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm transition-all ${
                              activeServiceTab ===
                              index
                                ? "bg-orange-500 text-white"
                                : "bg-stone-100 group-hover:bg-orange-100"
                            }`}
                          >
                            {service.icon}
                          </span>

                          <span>
                            {service.title}
                          </span>
                        </button>
                      )
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                LOCK STATUS / PROGRESS
            ================================================= */}

            <div className="absolute bottom-[108px] left-1/2 z-40 hidden -translate-x-1/2 lg:block">
              <motion.div
  style={{
    opacity: lockStatusOpacity,
  }}
                className="flex items-center gap-3 rounded-full border border-stone-200 bg-white/80 px-4 py-2 shadow-lg backdrop-blur-xl"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)]" />

                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500">
                  Scroll to explore
                </span>

                <div className="h-1 w-20 overflow-hidden rounded-full bg-stone-200">
                  <motion.div
                    style={{
                      width: progressWidth,
                    }}
                    className="h-full rounded-full bg-orange-500"
                  />
                </div>
              </motion.div>
            </div>

            {/* =================================================
                SIDE INDICATOR
            ================================================= */}

            <div className="absolute bottom-32 right-5 hidden flex-col items-center gap-3 xl:right-10 xl:flex">
              <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-stone-400 [writing-mode:vertical-rl]">
                Explore Services
              </span>

              <div className="h-16 w-px bg-gradient-to-b from-orange-500 to-transparent" />
            </div>

          </div>
        </div>

        {/* =================================================
            MOBILE
            ไม่ใช้ scroll lock
        ================================================= */}

        <div className="w-full lg:hidden">
          <div className="px-5 py-16 sm:px-8 sm:py-20">

            <div className="mb-10 text-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600">
                OUR SERVICES
              </p>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Logistics Solutions
              </h2>
            </div>

            {/* MOBILE SELECTOR */}

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {companyData.services.map(
                (service, index) => (
                  <button
                    key={service.number}
                    type="button"
                    onClick={() =>
                      setActiveServiceTab(
                        index
                      )
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold ${
                      activeServiceTab ===
                      index
                        ? "bg-slate-900 text-white"
                        : "bg-white text-stone-400"
                    }`}
                  >
                    {service.number}
                  </button>
                )
              )}
            </div>

            {/* MOBILE IMAGE */}

            <div className="mb-6 overflow-hidden rounded-[28px]">
              <img
                src={currentService.img}
                alt={currentService.title}
                className="h-[420px] w-full object-cover sm:h-[500px]"
              />
            </div>

            {/* MOBILE CONTENT */}

            <div className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-600">
                SERVICE{" "}
                {String(
                  activeServiceTab + 1
                ).padStart(2, "0")}
              </div>

              <h3 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                {currentService.title}
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                {currentService.description}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 7 — CONTACT DIRECTORY
      =================================================== */}

      <section
        id="Contact Us"
        className="relative w-full min-h-[100svh] lg:min-h-screen bg-[#FDFBF7] text-stone-900 py-16 sm:py-20 lg:py-28 px-5 sm:px-8 lg:px-16 flex flex-col justify-center overflow-hidden border-t border-stone-200"
      >
        <div className="absolute top-1/3 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-200/40 rounded-full blur-[120px] sm:blur-[140px] pointer-events-none" />

        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-100/60 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto relative z-10">

          <ScrollCardReveal direction="up">
            <div className="text-center mb-10 sm:mb-14">

              <span className="text-[10px] sm:text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-3">
                CONTACT DIRECTORY & LOCATIONS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                ALL INTER GLOBAL COMPANY LIMITED
              </h2>

              <p className="text-xs sm:text-sm text-stone-500 mt-4">
                MEMBER OF HANDLE INTER GROUP
              </p>

            </div>
          </ScrollCardReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">

            {companyData.locations.map(
              (location, index) => (
                <ScrollCardReveal
                  key={location.number}
                  direction={
                    index === 0
                      ? "left"
                      : "right"
                  }
                  delay={index * 150}
                  className="h-full"
                >
                  <div className="h-full bg-[#FAF6EE]/90 border border-amber-200/70 rounded-2xl sm:rounded-[32px] p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500">

                    <div className="flex items-start sm:items-center gap-4 sm:gap-5 mb-7 sm:mb-8">

                      <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-stone-900 text-amber-50 flex items-center justify-center font-black">
                        {location.number}
                      </div>

                      <div className="min-w-0">

                        <div className="text-[9px] sm:text-[10px] text-orange-600 font-mono font-bold uppercase tracking-widest mb-1">
                          {location.title}
                        </div>

                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-stone-900 leading-tight break-words">
                          {location.building}
                        </h3>

                      </div>

                    </div>

                    <div className="space-y-5 sm:space-y-6">

                      <div className="flex items-start gap-3 sm:gap-4">

                        <div className="w-9 h-9 shrink-0 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
                          <i className="fa-solid fa-location-dot" />
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 leading-6 sm:leading-relaxed break-words">
                          {location.address}
                        </p>

                      </div>

                      <div className="flex items-center gap-3 sm:gap-4">

                        <div className="w-9 h-9 shrink-0 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
                          <i className="fa-solid fa-phone" />
                        </div>

                        <a
                          href={`tel:${location.phone}`}
                          className="text-xs sm:text-sm font-mono font-semibold text-stone-800 hover:text-orange-600 transition-colors"
                        >
                          {location.phone}
                        </a>

                      </div>

                    </div>

                  </div>
                </ScrollCardReveal>
              )
            )}

          </div>

          <ScrollCardReveal
            direction="up"
            delay={200}
          >
            <div className="mt-10 sm:mt-14 text-center">
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-500 font-mono leading-6 break-words">
                Hotline: 0-2393-2300 (Auto) | Fax: 0-2393-7307-10 | admincenter@handleintergroup.com
              </p>
            </div>
          </ScrollCardReveal>

        </div>
      </section>

    </div>
  );
}