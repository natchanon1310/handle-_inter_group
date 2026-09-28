"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

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
      img: "images/cardair.png",
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
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${getTransformStyle()} ${className}`}
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
     SMOOTH SERVICE SCROLL
     ======================================================= */

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

  /* =======================================================
     LANGUAGE
     ======================================================= */

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

    return () => {
      window.removeEventListener("langChange", checkLang);
    };
  }, []);

  /* =======================================================
     SECTIONS
     ======================================================= */

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
    companyData.services[activeServiceTab];

  /* =======================================================
     ACTIVE SECTION DETECTION
     ======================================================= */

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

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

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
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="relative w-full overflow-clip bg-slate-100 text-slate-800">

      {/* ===================================================
          SIDE PROGRESS DOTS
          =================================================== */}

      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-5 items-end">

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
                className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
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
                      ? "w-8 h-[3px] bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.8)]"
                      : "w-4 h-[1.5px] bg-gray-300 group-hover:bg-orange-400 group-hover:w-6"
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
        className="relative w-full min-h-screen h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden border-b border-slate-800"
      >

        <div className="absolute inset-0 z-0">

          <img
            src="/images/all-inter-global.jpeg"
            alt={companyData.companyName}
            className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />

        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-20 pt-20 w-full">

          <ScrollCardReveal
            direction="up"
            delay={100}
          >

            <div className="inline-block bg-orange-600/90 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg mb-5">

              <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                {companyData.affiliation}
              </span>

            </div>

            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-md">

              {companyData.companyName}

            </h1>

            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full my-6" />

            <h2 className="text-xl md:text-3xl font-bold text-orange-400 tracking-wide">

              {companyData.tagline}

            </h2>

            <p className="text-slate-200 max-w-5xl mx-auto mt-7 text-sm md:text-base leading-relaxed font-normal">

              {companyData.overview}

            </p>

            <div className="pt-8 flex flex-wrap gap-4 justify-center">

              <button
                onClick={() =>
                  scrollToSection(
                    "companyprofile"
                  )
                }
                className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-600/30 inline-flex items-center space-x-3 cursor-pointer"
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
        className="relative w-full bg-[#FDFBF7] text-stone-900 py-20 md:py-28 px-6 sm:px-10 lg:px-16 border-b border-stone-200"
      >

        <div className="max-w-7xl mx-auto">

          <ScrollCardReveal direction="up">

            <div className="max-w-5xl mx-auto text-center">

              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-4">
                {companyData.affiliation}
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-8">
                {companyData.companyName}
              </h2>

              <p className="text-stone-700 text-sm sm:text-base md:text-lg leading-relaxed">
                {companyData.overview}
              </p>

            </div>

          </ScrollCardReveal>

          {/* STATISTICS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">

            {companyData.statistics.map(
              (stat, index) => (
                <ScrollCardReveal
                  key={stat.title}
                  direction="up"
                  delay={index * 100}
                  className="h-full"
                >

                  <div className="h-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500">

                    <div className="text-orange-600 font-mono text-xs font-bold uppercase tracking-widest mb-4">
                      {stat.title}
                    </div>

                    <div className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                      {stat.value}
                    </div>

                  </div>

                </ScrollCardReveal>
              )
            )}

          </div>

          {/* FLIPBOOK */}

          <div className="mt-20">

            <ScrollCardReveal direction="up">

              <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">

                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono">
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

            <div className="w-full max-w-5xl mx-auto bg-black/90 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-stone-300 p-2 sm:p-4">

              <div className="relative w-full h-[520px] sm:h-[620px] md:h-[700px] rounded-xl overflow-hidden">

                <iframe
                  src="https://heyzine.com/flip-book/975d37c84c.html"
                  title="ALL INTER GLOBAL Company Profile"
                  className="w-full h-full border-0 rounded-xl"
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
        className="relative w-full bg-[#FDFBF7] text-stone-900 py-20 md:py-28 px-6 sm:px-10 lg:px-16 border-b border-stone-200 overflow-hidden"
      >

        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">

          <ScrollCardReveal direction="up">

            <div className="text-center mb-14">

              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-3">
                LEADERSHIP & VISIONS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                LEADERSHIP & VISIONS
              </h2>

            </div>

          </ScrollCardReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

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

                  <div className="h-full bg-white border border-stone-200 rounded-[32px] p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500">

                    <div className="text-orange-600 text-xs font-mono font-bold uppercase tracking-widest mb-3">
                      {leader.position}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mb-7">
                      {leader.name}
                    </h3>

                    <blockquote className="border-l-4 border-orange-500 pl-6 text-stone-600 text-sm sm:text-base leading-relaxed italic">
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
        className="relative w-full bg-stone-950 text-white py-20 md:py-28 px-6 sm:px-10 lg:px-16 border-b border-stone-800"
      >

        <div className="max-w-7xl mx-auto">

          <ScrollCardReveal direction="up">

            <div className="text-center mb-14">

              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block font-mono mb-3">
                CORE STRENGTHS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                CORE STRENGTHS
              </h2>

            </div>

          </ScrollCardReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

            {companyData.coreStrengths.map(
              (strength, index) => (

                <ScrollCardReveal
                  key={strength.number}
                  direction="up"
                  delay={index * 100}
                  className="h-full"
                >

                  <div className="h-full bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/10 transition-all duration-500">

                    <div className="text-orange-500 font-black text-4xl mb-6">
                      {strength.number}
                    </div>

                    <h3 className="text-lg font-black mb-3">
                      {strength.title}
                    </h3>

                    <p className="text-sm text-stone-400 leading-relaxed">
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
        className="relative w-full bg-[#FDFBF7] text-stone-900 py-20 md:py-28 px-6 sm:px-10 lg:px-16 border-b border-stone-200"
      >

        <div className="max-w-7xl mx-auto">

          <ScrollCardReveal direction="up">

            <div className="text-center mb-14">

              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-3">
                CORPORATE RESPONSIBILITIES
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                CORPORATE RESPONSIBILITIES
              </h2>

            </div>

          </ScrollCardReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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

                  <div className="h-full bg-[#FAF6EE] border border-amber-200/70 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500">

                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-4">
                      {item.title}
                    </h3>

                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
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
          =================================================== */}

      <section
  id="Our service"
  ref={lockContainerRef}
  className="relative w-full h-[250vh] bg-[#F8F6F1] text-stone-900 border-b border-stone-200"
>
  <div className="sticky top-0 h-screen w-full overflow-hidden">

    {/* =========================================================
        BACKGROUND
    ========================================================= */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

      {/* Main background */}
      <div className="absolute inset-0 bg-[#F8F6F1]" />

      {/* World image */}
      <img
        src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2200&q=80"
        alt="Worldwide Logistics Network"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.035] grayscale"
      />

      {/* Soft light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(245,158,11,0.16),transparent_32%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_75%,rgba(251,146,60,0.08),transparent_30%)]" />

      {/* Top fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#F8F6F1]" />

      {/* Orange glow */}
      <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-orange-300/10 blur-[170px]" />

      <div className="absolute -bottom-60 -left-60 w-[650px] h-[650px] rounded-full bg-amber-200/10 blur-[160px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#292524 1px, transparent 1px), linear-gradient(90deg, #292524 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -right-20 top-[22%] w-[500px] h-[500px] rounded-full border border-orange-300/20" />
      <div className="absolute -right-4 top-[27%] w-[380px] h-[380px] rounded-full border border-orange-300/15" />

    </div>

    {/* =========================================================
        MAIN CONTENT
    ========================================================= */}
    <div className="relative z-10 h-full w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-8">

      {/* =======================================================
          TITLE
      ======================================================= */}
      <motion.div
        style={{
          opacity: titleOpacity,
          scale: titleScale,
        }}
        className="absolute top-[7%] left-5 right-5 sm:left-8 sm:right-8 lg:left-14 lg:right-14 xl:left-20 xl:right-20 z-20 pointer-events-none"
      >
        <div className="max-w-[1250px] mx-auto">

          {/* Small label */}
          <div className="flex items-center gap-3 mb-5">

            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 backdrop-blur-xl px-4 py-2 shadow-sm">

              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />

              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase text-orange-700">
                SERVICES & CAPABILITIES
              </span>

            </span>

            <span className="hidden sm:block h-px w-12 bg-orange-200" />

          </div>

          {/* Main title */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[78px] xl:text-[88px] font-black tracking-[-0.055em] leading-[0.92] text-stone-900">

            ALL INTER GLOBAL

            <br />

            <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-orange-500 bg-clip-text text-transparent">
              Active Logistics World in Your Hand
            </span>

          </h2>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-stone-500 leading-relaxed font-normal">
            Scroll down to experience our superior one-stop service quality and complete worldwide logistics ecosystem.
          </p>

          {/* Scroll */}
          <div className="pt-5">

            <span className="inline-flex items-center gap-3 bg-stone-900 text-amber-50 font-mono font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-xl shadow-stone-900/10">
              Scroll Down
              <span className="text-orange-400 text-base">
                ↓
              </span>
            </span>

          </div>

        </div>
      </motion.div>

      {/* =======================================================
          SERVICE CONTENT
      ======================================================= */}
      <div className="relative h-full max-w-[1250px] mx-auto flex items-center">

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* =====================================================
              LEFT
          ===================================================== */}
          <motion.div
            style={{
              opacity: contentOpacity,
              x: contentX,
            }}
            className="lg:col-span-7 relative z-30 mt-[170px] lg:mt-[155px]"
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

                {/* Big background number */}
                <div className="absolute -top-16 -left-5 text-[140px] sm:text-[180px] font-black leading-none text-stone-900/[0.035] select-none pointer-events-none">
                  {currentService.number}
                </div>

                {/* Main card */}
                <div className="relative max-w-[700px] rounded-[34px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_30px_100px_rgba(28,25,23,0.10)] overflow-hidden">

                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-700 via-orange-500 to-amber-400" />

                  <div className="p-7 sm:p-9 lg:p-11">

                    {/* Service label */}
                    <div className="flex items-center justify-between mb-7">

                      <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3.5 py-1.5">

                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />

                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-orange-700">
                          SERVICE {currentService.number}
                        </span>

                      </div>

                      <span className="hidden sm:block text-[9px] font-mono uppercase tracking-[0.2em] text-stone-300">
                        ALL INTER GLOBAL
                      </span>

                    </div>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-4xl lg:text-[48px] font-black text-stone-900 tracking-[-0.045em] leading-[0.98]">
                      {currentService.title}
                    </h3>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-7">

                      <div className="w-12 h-[2px] bg-orange-500" />

                      <div className="flex-1 h-px bg-stone-100" />

                    </div>

                    {/* Description */}
                    <p className="text-stone-600 text-sm sm:text-base leading-[1.8] font-normal max-w-xl">
                      {currentService.description}
                    </p>

                    {/* CTA */}
                    <div className="pt-7">

                      <button
                        onClick={() =>
                          scrollToSection("Contact Us")
                        }
                        className="group inline-flex items-center gap-4 bg-stone-900 hover:bg-orange-600 text-amber-50 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-7 py-3.5 rounded-full transition-all duration-300 shadow-xl shadow-stone-900/10 hover:shadow-orange-500/20 hover:-translate-y-1 cursor-pointer active:scale-95"
                      >

                        <span>
                          Inquire Service Now ↗
                        </span>

                      </button>

                    </div>

                    {/* Bottom stats */}
                    <div className="mt-9 pt-7 border-t border-stone-100">

                      <div className="grid grid-cols-3">

                        <div className="pr-4">

                          <div className="text-xl sm:text-2xl font-black text-stone-900">
                            24/7
                          </div>

                          <div className="mt-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-stone-400">
                            Operation
                          </div>

                        </div>

                        <div className="px-4 border-l border-stone-100">

                          <div className="text-xl sm:text-2xl font-black text-stone-900">
                            Global
                          </div>

                          <div className="mt-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-stone-400">
                            Network
                          </div>

                        </div>

                        <div className="pl-4 border-l border-stone-100">

                          <div className="text-xl sm:text-2xl font-black text-orange-600">
                            {currentService.number}
                          </div>

                          <div className="mt-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-stone-400">
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

          {/* =====================================================
              RIGHT IMAGE
          ===================================================== */}
          <motion.div
            style={{
              opacity: imageOpacity,
              x: imageX,
              scale: imageScale,
            }}
            className="lg:col-span-5 relative z-20 hidden md:flex items-center justify-center"
          >

            <div className="relative w-full max-w-[520px]">

              {/* Glow */}
              <div className="absolute inset-8 rounded-[50px] bg-orange-400/20 blur-[80px]" />

              {/* Decorative ring */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-orange-300/40" />

              <div className="absolute -right-3 -top-3 w-28 h-28 rounded-full border border-orange-300/30" />

              {/* Image frame */}
              <div className="relative aspect-[4/5] rounded-[42px] overflow-hidden border-[7px] border-white shadow-[0_35px_90px_rgba(28,25,23,0.18)]">

                <img
                  src={currentService.img}
                  alt={currentService.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                {/* Top badge */}
                <div className="absolute top-6 left-6">

                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 px-3.5 py-2">

                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />

                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-white">
                      Global Logistics
                    </span>

                  </span>

                </div>

                {/* Icon */}
                <div className="absolute top-6 right-6">

                  <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg">
                    {currentService.icon}
                  </div>

                </div>

                {/* Image text */}
                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">

                  <span className="text-[9px] font-mono text-orange-300 font-extrabold uppercase tracking-[0.2em] block mb-2">
                    ALL INTER GLOBAL COMPANY LIMITED
                  </span>

                  <h5 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    {currentService.title}
                  </h5>

                </div>

              </div>

              {/* Floating card */}
              <div className="absolute -left-7 bottom-10 w-[200px] rounded-2xl bg-white/95 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(28,25,23,0.15)] p-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
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

                <div className="mt-3 h-1 rounded-full bg-stone-100 overflow-hidden">

                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-orange-600 to-amber-400" />

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

      
     {/* =======================================================
    SERVICE TABS
======================================================= */}
<div className="absolute bottom-6 left-5 right-5 sm:left-8 sm:right-8 lg:left-14 lg:right-14 xl:left-20 xl:right-20 z-40">

  <div className="max-w-[1250px] mx-auto">

    <div className="rounded-[25px] sm:rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-[0_15px_60px_rgba(28,25,23,0.10)] p-2">

      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">

        {/* Services */}
        {companyData.services.map(
          (service, index) => (

            <button
              key={service.number}
              onClick={() =>
                setActiveServiceTab(index)
              }
              className={`group flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 ${
                activeServiceTab === index
                  ? "bg-stone-900 text-amber-50 shadow-lg scale-[1.02]"
                  : "text-stone-500 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >

              {/* Service Icon */}
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm transition-all ${
                  activeServiceTab === index
                    ? "bg-orange-500 text-white"
                    : "bg-stone-100 group-hover:bg-orange-100"
                }`}
              >
                {service.icon}
              </span>

              {/* Service Name */}
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

      {/* =======================================================
          SIDE SCROLL INDICATOR
      ======================================================= */}
      <div className="absolute right-5 lg:right-10 bottom-32 hidden xl:flex flex-col items-center gap-3">

        <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-stone-400 [writing-mode:vertical-rl]">
          Explore Services
        </span>

        <div className="w-px h-16 bg-gradient-to-b from-orange-500 to-transparent" />

      </div>

    </div>
  </div>
</section>

      

      {/* ===================================================
          SECTION 8 — CONTACT DIRECTORY
          =================================================== */}

      <section
        id="Contact Us"
        className="relative w-full min-h-screen bg-[#FDFBF7] text-stone-900 py-20 lg:py-28 px-6 sm:px-10 lg:px-16 flex flex-col justify-center overflow-hidden border-t border-stone-200"
      >

        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[140px] pointer-events-none" />

        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto relative z-10">

          <ScrollCardReveal direction="up">

            <div className="text-center mb-14">

              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono mb-3">
                CONTACT DIRECTORY & LOCATIONS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                ALL INTER GLOBAL COMPANY LIMITED
              </h2>

              <p className="text-sm text-stone-500 mt-4">
                MEMBER OF HANDLE INTER GROUP
              </p>

            </div>

          </ScrollCardReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

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

                  <div className="h-full bg-[#FAF6EE]/90 border border-amber-200/70 rounded-[32px] p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500">

                    <div className="flex items-center gap-5 mb-8">

                      <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-50 flex items-center justify-center font-black">
                        {location.number}
                      </div>

                      <div>

                        <div className="text-[10px] text-orange-600 font-mono font-bold uppercase tracking-widest">
                          {location.title}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                          {location.building}
                        </h3>

                      </div>

                    </div>

                    <div className="space-y-6">

                      <div className="flex items-start gap-4">

                        <div className="w-9 h-9 shrink-0 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
                          <i className="fa-solid fa-location-dot" />
                        </div>

                        <p className="text-sm text-stone-600 leading-relaxed">
                          {location.address}
                        </p>

                      </div>

                      <div className="flex items-center gap-4">

                        <div className="w-9 h-9 shrink-0 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
                          <i className="fa-solid fa-phone" />
                        </div>

                        <a
                          href={`tel:${location.phone}`}
                          className="text-sm font-mono font-semibold text-stone-800 hover:text-orange-600 transition-colors"
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

          {/* CONTACT SUMMARY */}

          <ScrollCardReveal
            direction="up"
            delay={200}
          >

            <div className="mt-14 text-center">

              <p className="text-xs sm:text-sm text-stone-500 font-mono">
                Hotline: 0-2393-2300 (Auto) | Fax: 0-2393-7307-10 | admincenter@handleintergroup.com
              </p>

            </div>

          </ScrollCardReveal>

        </div>

      </section>

    </div>
  );
}