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

export default function HitInterconPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);

  // 📖 E-Book Flipbook State (Section 2)
  const [currentStep, setCurrentStep] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // 🎥 3D Cinematic Scroll-Locking Reference (Section 3)
  const lockContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lockContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // 🌟 Phase 1: หัวข้อใหญ่ตรงกลาง (Fade Out ช่วงต้นของการ Scroll Lock)
  const titleOpacity = useTransform(smoothProgress, [0, 0.16, 0.23], [1, 0.9, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.23], [0, -60]);
  const titleScale = useTransform(smoothProgress, [0, 0.23], [1, 0.9]);

  // 🌟 Phase 2: ภาพลอยเดี่ยว จากกึ่งกลางจอ -> ขยับไปฝั่งขวาพร้อมย่อขนาดและหมุนเอียง
  const objectX = useTransform(smoothProgress, [0.12, 0.52], ["0%", "28%"]);
  const objectY = useTransform(smoothProgress, [0.12, 0.52], ["0%", "0%"]);
  const objectScale = useTransform(smoothProgress, [0, 0.15, 0.52], [1.3, 1.22, 1.05]);
  const objectRotateZ = useTransform(smoothProgress, [0.12, 0.52], [-8, 4]);
  const objectRotateY = useTransform(smoothProgress, [0.12, 0.52], [16, -6]);

  // 🌟 Phase 3: กล่องเนื้อหา E-Book ฝั่งซ้ายสไลด์ขึ้นมา
  const contentOpacity = useTransform(smoothProgress, [0.28, 0.55], [0, 1]);
  const contentX = useTransform(smoothProgress, [0.28, 0.55], [-40, 0]);
  const contentY = useTransform(smoothProgress, [0.28, 0.55], [30, 0]);

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
  const subsidiaries = t.subsidiaries || [];
  const detailText = t.hitIntercon || {};

  const sections = useMemo(
    () => [
      { id: "overview", label: lang === "en" ? "Overview" : "ภาพรวม" },
      { id: "companyprofie", label: lang === "en" ? "Companyprofie" : "เอกสารบริษัท" },
      { id: "Our service", label: lang === "en" ? "Our service" : "บริการของเรา" },
      { id: "Contact Us", label: lang === "en" ? "Contact Us" : "ติดต่อเรา" },
    ],
    [lang]
  );

  // 📦 รวมเนื้อหาทั้งหมดครบถ้วน 100%
  const completeEbookServices = useMemo(
    () => [
      {
        id: "ocean-freight",
        tabTitle: "ขนส่งสินค้าทางทะเล",
        tag: "CORE SERVICE 01 // SEA FREIGHT",
        title: "ขนส่งสินค้าทางทะเล",
        subtitle: "ประสบการณ์ด้านการจัดการขนส่งสินค้าที่พร้อมให้คุณได้มากกว่าการบริการ",
        desc: "ประสบการณ์อันยาวนานของการเป็นตัวแทนผู้ให้บริการด้านระบบการจัดการการส่งสินค้า (Logistic) อย่างครบวงจร ทั้งการขนส่งสินค้าระหว่างประเทศด้านนำเข้า และส่งออก ในทุกเส้นทาง ทุกจุดหมายปลายทางทั่วโลก ครอบคลุมทั้งโซนเอเซีย ยุโรป ตะวันออกกลาง และอเมริกา ด้วยประสบการณ์และความรอบรู้ในด้านการขนส่ง จึงสามารถให้คำปรึกษา และการแนะนำอย่างผู้เชี่ยวชาญ",
        items: [
          "บริการขนส่งสินค้าแบบเต็มตู้คอนเทนเนอร์ (Full Container Load: FCL)",
          "บริการขนส่งสินค้าแบบไม่เต็มตู้คอนเทนเนอร์ (Less Than Container Load: LCL)",
          "บริการขนส่งสินค้าข้ามแดน (Cross border transport)",
          "บริการด้านการขนส่งสินค้าอาหารทะเลแช่แข็ง ด้วยประสบการณ์เฉพาะทางมาอย่างยาวนาน",
          "บริการขนส่งสินค้าที่พิเศษ (Oversize Cargo)",
        ],
        icon: "🚢",
        img: "/images/shipcard.png",
      },
      {
        id: "air-freight",
        tabTitle: "ขนส่งสินค้าทางอากาศ",
        tag: "CORE SERVICE 02 // AIR FREIGHT",
        title: "ขนส่งสินค้าทางอากาศ",
        subtitle: "ตอบสนองทุกความต้องการของคุณแบบรู้จริงทุกเส้นทาง",
        desc: "ประสบการณ์การขนส่งสินค้าทางอากาศทั้งขาเข้า และขาออก ไปยังทุกมุมทั่วโลก ทุกเส้นทาง ทุกเวลา ทุกประเภท ของการขนส่งสินค้าเราจัดการได้ ตอบสนองทุกความต้องการของคุณแบบรู้จริงทุกเส้นทาง",
        items: [
          "บริการขนส่งสินค้าแบบถึงมือผู้รับ Door to door (DDU/ DDP/ FCA/ Ex-work)",
          "บริการขนส่งสินค้าเร่งด่วนและสินค้าควบคุมอุณหภูมิ",
          "บริการจัดส่งสินค้าครอบคลุมทุกสนามบินหลักทั่วโลก",
        ],
        icon: "✈️",
        img: "/images/cardair.png",
      },
      {
        id: "lcl-consolidation",
        tabTitle: "บริการรวบรวมสินค้า LCL",
        tag: "CORE SERVICE 03 // LCL CONSOLIDATION",
        title: "บริการรวบรวมการขนส่งสินค้าแบบไม่เต็มตู้คอนเทนเนอร์",
        subtitle: "เพื่อธุรกิจขนาดเล็กและขนาดกลางไม่พลาดแม้การสั่งซื้อจำนวนน้อย",
        desc: "เพื่อให้ธุรกิจขนาดเล็กและขนาดกลางไม่พลาดแม้การสั่งซื้อจำนวนน้อย ด้วยทีมงานที่มากด้วยประสบการณ์ ทั้งการจัดการหาตู้คอนเทนเนอร์, การวางแผนการจัดวางสินค้าเข้าตู้อย่างมีประสิทธิภาพ พร้อมทั้งบริหารตารางการขนส่งสินค้าที่แน่นอนทุก ๆ สัปดาห์ (Weekly consolidation)",
        items: [
          "Weekly consolidation บริหารตารางการขนส่งสินค้าที่แน่นอนทุกสัปดาห์",
          "การจัดการหาตู้คอนเทนเนอร์ที่ได้มาตรฐาน",
          "การวางแผนการจัดวางสินค้าเข้าตู้อย่างมีประสิทธิภาพสูงสุด",
          "ศูนย์คลังสินค้าเปิดตู้รับสินค้าต่อเนื่อง",
        ],
        icon: "🏢",
        img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: "trucking-fleet",
        tabTitle: "ขนส่งสินค้าทางรถ",
        tag: "CORE SERVICE 04 // LAND TRANSPORT",
        title: "ขนส่งสินค้าทางรถ",
        subtitle: "รองรับทุกความต้องการของผู้ใช้บริการด้านการขนส่ง",
        desc: "รองรับทุกความตามความต้องการของผู้ใช้บริการด้านการขนส่ง รถบรรทุก ทุกประเภท ทุกการใช้งาน พร้อมระบบติดตามความปลอดภัยในการเดินทาง",
        items: [
          "รถบรรทุก 4 ล้อหลังคาสูง",
          "รถบรรทุก 6 ล้อเปิดข้าง",
          "รถบรรทุก 10 ล้อขึ้นไป",
          "รถหัวลากคอนเทนเนอร์ 20 ฟุต",
          "รถหัวลากคอนเทนเนอร์ 40 ฟุต",
        ],
        icon: "🚛",
        img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "customs-brokerage",
        tabTitle: "ดำเนินการพิธีการศุลกากร",
        tag: "CORE SERVICE 05 // CUSTOMS CLEARANCE",
        title: "ดำเนินการพิธีการศุลกากร",
        subtitle: "ทีมงานมากประสบการณ์พร้อมเทคโนโลยีที่ทันสมัย",
        desc: "ทีมงานมากประสบการณ์ที่พร้อมให้คำแนะนำ ประสานงาน จัดเตรียมเอกสารสำคัญ และดำเนินพิธีการผ่านแดนทุกขั้นตอน ด้วยเทคโนโลยีที่ทันสมัย",
        items: [
          "บริการดำเนินพิธีการทางเรือ ทั้งขาเข้า-ขาออก",
          "บริการดำเนินพิธีการทางอากาศ ทั้งขาเข้า-ขาออก",
          "บริการออกหนังสือรับรองถิ่นกำเนิดสินค้า (Certificate of origin)",
          "บริการขอคืนภาษีอากรสำหรับผู้ส่งออก (มุมน้ำเงิน) /มาตรา 19 ทวิ/บีโอไอ",
        ],
        icon: "📑",
        img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    []
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
                      ? "w-8 h-[3px] bg-orange-600"
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
        className="relative w-full min-h-screen h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden border-b border-slate-800"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hithero.jpeg"
            alt="HIT Intercon Logistics Hub"
            className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-20 pt-20 w-full flex flex-col items-center justify-center">
          <ScrollCardReveal direction="up" delay={100}>
            <div className="inline-block bg-orange-600/90 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                {isMounted && (detailText.heroSub || "H.I.T. INTERCON")}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-md mt-2">
              {isMounted && (subsidiaries[0]?.name || detailText.heroTitle || "H.I.T. INTERCON CO., LTD.")}
            </h1>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full my-4" />
           <p className="text-slate-200 max-w-4xl mx-auto text-xl md:text-4xl leading-relaxed font-normal">
  {isMounted && detailText.heroDesc}
</p>

            <div className="pt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => scrollToSection("companyporfile")}
                className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-600/30 inline-flex items-center space-x-3 cursor-pointer"
              >
                <span>{lang === "en" ? "EXPLORE DIGITAL BROCHURE" : "เปิดอ่านโบรชัวร์ดิจิทัล"}</span>
                <span className="animate-bounce">↓</span>
              </button>
            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* 🎯 SECTION 2: REALISTIC FLIPBOOK VIEWER */}
      <section
        id="companyprofie"
        className="py-20 md:py-28 px-4 sm:px-8 bg-[#222327] text-white relative w-full flex flex-col items-center justify-center min-h-screen border-b border-neutral-800"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block font-mono">
            Interactive Presentation
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {lang === "en" ? "H.I.T. Intercon Flipbook Catalog" : "เอกสารแนะนำบริษัท เอช.ไอ.ที. อินเตอร์คอน จำกัด"}
          </h2>
          <p className="text-xs text-neutral-400">
            {lang === "en" ? "Click the arrows to flip pages or use controls below." : "คลิกลูกศรด้านข้างหรือแถบควบคุมด้านล่างเพื่อเปิดพลิกหน้าเอกสาร"}
          </p>
        </div>

        {/* FLIPBOOK VIEWER WRAPPER */}
        <div className="w-full max-w-5xl relative flex items-center justify-center my-auto">
          <button
            onClick={goToPrev}
            disabled={currentStep === 0 || isFlipping}
            className={`absolute left-0 sm:-left-6 lg:-left-12 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer border border-white/20 shadow-2xl ${
              currentStep === 0 ? "opacity-20 cursor-not-allowed" : "hover:scale-110 active:scale-95"
            }`}
            title="Previous Page"
          >
            <span className="text-lg font-bold">‹</span>
          </button>

          <div
            className={`w-full transition-all duration-500 perspective-2000 flex items-center justify-center ${
              isZoomed ? "scale-105 sm:scale-110" : "scale-100"
            }`}
          >
            <div className="relative w-full max-w-[860px] min-h-[480px] sm:min-h-[560px] md:min-h-[600px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {/* STEP 0: FRONT COVER */}
                {currentStep === 0 && (
                  <motion.div
                    key="cover"
                    initial={{ rotateY: flipDirection === "next" ? -80 : 80, opacity: 0, scale: 0.95 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: -80, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                    className="w-full max-w-[420px] h-[540px] sm:h-[580px] bg-[#0c1e38] rounded-r-2xl rounded-l-md shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-r-4 border-b-4 border-slate-700/60 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white"
                  >
                    <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none z-20" />
                    <div className="relative z-10 space-y-4 text-left">
                      <div className="bg-white px-3 py-1 rounded-md inline-block shadow-md">
                        <div className="text-blue-900 font-black text-xl tracking-wider flex items-center space-x-1">
                          <span>HIT</span>
                          <span className="text-xs">🌍</span>
                        </div>
                        <div className="text-[8px] font-mono font-bold text-slate-700 tracking-tight">INTERCON CO., LTD.</div>
                      </div>

                      <div className="pt-2">
                        <h3 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
                          THE
                        </h3>
                        <h3 className="text-2xl sm:text-3xl font-extralight text-sky-300 leading-tight tracking-wider">
                          EXPERIENCED
                        </h3>
                      </div>
                    </div>

                    <div className="relative z-10 my-auto py-2">
                      <div className="relative w-full h-52 sm:h-56 rounded-xl overflow-hidden shadow-2xl border border-white/20">
                        <img
                          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
                          alt="Cargo Ocean Ship"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e38]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 text-left">
                          <span className="text-[10px] font-mono text-sky-300 uppercase tracking-widest block font-bold">
                            ONE STOP FREIGHT FORWARDER
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-300">
                      <span>www.hitintercon.com</span>
                      <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded border border-white/20">
                        <span>ISO 9001</span>
                        <span>•</span>
                        <span>TIFFA</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1: 2-PAGE SPREAD */}
                {currentStep === 1 && (
                  <motion.div
                    key="spread"
                    initial={{ rotateY: flipDirection === "next" ? 70 : -70, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: flipDirection === "next" ? -70 : 70, opacity: 0 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#f8fafc] text-slate-900 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-slate-300 relative overflow-hidden min-h-[540px] sm:min-h-[580px]"
                  >
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/25 via-black/5 to-black/25 pointer-events-none z-30" />

                    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between text-left border-b md:border-b-0 md:border-r border-slate-200 relative bg-gradient-to-b from-white to-slate-50">
                      <div className="space-y-4">
                        <span className="text-2xl sm:text-3xl font-black text-[#1e3a8a] tracking-tight block">
                          THE EXPERIENCED
                        </span>
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal pt-1">
                          We are able to provide you a one stop service where all your needs and demand will be met. Our professional and experience marketing team will ensure that all your goods will be taken care of from it’s origin to it’s destination on time. Choose us, choose superior experiencing service quality.
                        </p>
                      </div>

                      <div className="mt-4 w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-slate-200 shadow-md relative">
                        <img
                          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                          alt="Warehouse Logistics"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="pt-3 flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>H.I.T. INTERCON</span>
                        <span>01</span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between text-left relative bg-gradient-to-b from-white to-slate-50">
                      <div className="space-y-4">
                        <span className="text-xl sm:text-2xl font-black text-[#1e3a8a] tracking-tight block border-b border-slate-200 pb-2">
                          THE EXPERIENCED <span className="text-orange-600">SERVICE</span>
                        </span>

                        <div className="space-y-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-900 mr-2 shrink-0" />
                            International Freight
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 pl-4 leading-relaxed font-light">
                            Service... provides freight forwarder of all FCL/LCL worldwide including Asia, Europe, Middle East, and America.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-900 mr-2 shrink-0" />
                            Consolidator to/from Worldwide
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 pl-4 leading-relaxed font-light">
                            Service... makes managing even your small shipments easier than ever, arrange with our full experienced team who is expert in each field.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-900 mr-2 shrink-0" />
                            Customs Clearance
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 pl-4 leading-relaxed font-light">
                            Service... co-ordinate and prepared every step to make the customs fast green line with our technology and experienced broker teams.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-900 mr-2 shrink-0" />
                            Trucking & Packing Service
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 pl-4 leading-relaxed font-light">
                            Service... transport and packing cargo efficiently with full fleet options.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-100">
                        <span>02</span>
                        <span>EXCELLENCE IN MOTION</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: BACK COVER */}
                {currentStep === 2 && (
                  <motion.div
                    key="backcover"
                    initial={{ rotateY: flipDirection === "next" ? 80 : -80, opacity: 0, scale: 0.95 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: 80, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
                    className="w-full max-w-[420px] h-[540px] sm:h-[580px] bg-gradient-to-b from-[#0a192f] via-[#0d223f] to-[#081326] rounded-l-2xl rounded-r-md shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-l-4 border-b-4 border-slate-700/60 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white"
                  >
                    <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/80 via-black/30 to-transparent pointer-events-none z-20" />
                    <div className="text-center relative z-10 space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase font-sans">
                        WORLDWIDE
                      </h3>
                      <h3 className="text-xl sm:text-2xl font-light tracking-widest text-sky-400 uppercase font-sans">
                        NETWORK
                      </h3>
                    </div>

                    <div className="relative z-10 my-auto py-2 flex items-center justify-center">
                      <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                        <img
                          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                          alt="Worldwide Logistics Network"
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl filter drop-shadow-2xl">🌐</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 text-left space-y-2 pt-3 border-t border-white/15 text-[10px] font-mono text-slate-300">
                      <div className="font-bold text-white text-xs">H.I.T. Intercon Co., Ltd.</div>
                      <p className="text-[9px] text-slate-400 leading-tight">
                        1 Handle Inter Group Building, Bangna-Trad Soi 17, Bangkok 10260 Thailand
                      </p>
                      <div className="flex justify-between items-center pt-1 text-[9px] text-sky-300">
                        <span>Tel: +66 (0) 2393 2300 (Auto)</span>
                        <span>www.hitintercon.com</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={goToNext}
            disabled={currentStep === 2 || isFlipping}
            className={`absolute right-0 sm:-right-6 lg:-right-12 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer border border-white/20 shadow-2xl ${
              currentStep === 2 ? "opacity-20 cursor-not-allowed" : "hover:scale-110 active:scale-95"
            }`}
            title="Next Page"
          >
            <span className="text-lg font-bold">›</span>
          </button>
        </div>

        {/* BOTTOM CONTROL TOOLBAR */}
        <div className="bg-black/70 border border-white/15 rounded-full px-5 py-2.5 flex items-center space-x-4 sm:space-x-6 text-white text-xs font-mono backdrop-blur-xl shadow-2xl z-20 mt-6">
          <button
            disabled={currentStep === 0}
            onClick={() => {
              setFlipDirection("prev");
              setCurrentStep(0);
            }}
            className="hover:text-orange-400 disabled:opacity-30 cursor-pointer transition-colors"
          >
            |‹
          </button>
          <button
            disabled={currentStep === 0}
            onClick={goToPrev}
            className="hover:text-orange-400 disabled:opacity-30 cursor-pointer transition-colors text-sm"
          >
            ‹
          </button>
          <span className="text-neutral-300 font-bold px-2">
            {currentStep === 0 ? "1 / 4 (Cover)" : currentStep === 1 ? "2-3 / 4 (Inside)" : "4 / 4 (Back)"}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`cursor-pointer transition-colors px-2 py-0.5 rounded-full ${
              isPlaying ? "bg-orange-600 text-white" : "hover:text-orange-400"
            }`}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button
            disabled={currentStep === 2}
            onClick={goToNext}
            className="hover:text-orange-400 disabled:opacity-30 cursor-pointer transition-colors text-sm"
          >
            ›
          </button>
          <button
            disabled={currentStep === 2}
            onClick={() => {
              setFlipDirection("next");
              setCurrentStep(2);
            }}
            className="hover:text-orange-400 disabled:opacity-30 cursor-pointer transition-colors"
          >
            ›|
          </button>
          <span className="w-[1px] h-4 bg-white/20" />
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="hover:text-orange-400 cursor-pointer transition-colors"
          >
            {isZoomed ? "🔍-" : "🔍+"}
          </button>
        </div>
      </section>

      {/* 🎯 SECTION 3: 3D CINEMATIC SCROLL-LOCKED EXPERIENCE (FULL TEXT + FULL COLOR + UPRIGHT IMAGE) */}
      <section
        id="Our service"
        ref={lockContainerRef}
        className="relative w-full h-[300vh] bg-[#FDFBF7] text-stone-900 border-b border-stone-200"
      >
        {/* Sticky Pinned Viewport Frame: ล็อกหน้าจอ 100vh อยู่กับที่ระหว่างการเลื่อน */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-8 lg:px-14 z-20">
          
          {/* Background Atmosphere (Warm Cream Ambient Glows) */}
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
            style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
            className="absolute inset-x-6 top-1/4 -translate-y-1/2 text-center max-w-4xl mx-auto space-y-3 z-10 pointer-events-none"
          >
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.3em] text-amber-800 bg-amber-100/80 border border-amber-300/60 px-4 py-1.5 rounded-full inline-block backdrop-blur-md shadow-sm">
              Total Logistics Experience
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-900 leading-[1.08]">
              The Experienced, <br />
              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Anytime, Anywhere.
              </span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
              {lang === "en"
                ? "Scroll down to experience our superior one-stop service quality and complete worldwide logistics ecosystem."
                : "เลื่อนลงเพื่อสัมผัสประสบการณ์บริการขนส่งครบวงจรมาตรฐานระดับโลก"}
            </p>

            <div className="pt-2">
              <span className="inline-block bg-stone-900 text-amber-50 font-mono font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg">
                Scroll Down ↓
              </span>
            </div>
          </motion.div>

          {/* 📍 SCENE 2: REVEAL CONTENT + PURE FLOATING 3D IMAGE */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-20 h-[84vh]">
            
            {/* ฝั่งซ้าย: ข้อมูลเนื้อหาบริการ แสดงข้อความเต็มครบถ้วน ไม่ตัดข้อความทิ้ง */}
            <motion.div
              style={{ opacity: contentOpacity, x: contentX, y: contentY }}
              className="lg:col-span-7 text-left flex flex-col justify-between h-full py-1 pr-1 overflow-y-auto"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentService.id}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
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
                  {currentService.items.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="bg-[#FAF6EE]/95 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2 backdrop-blur-md shadow-sm">
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
                          <span>ขอบเขตการให้บริการ (Service Scope & Capabilities)</span>
                        </h5>
                        <div className="grid grid-cols-1 gap-2 pt-0.5">
                          {currentService.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-start space-x-2 text-xs sm:text-sm text-stone-700">
                              <span className="text-amber-700 font-bold text-xs mt-0.5">✓</span>
                              <span className="leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => scrollToSection("Contact Us")}
                      className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-3 rounded-full transition-all duration-300 shadow-xl shadow-amber-900/20 hover:scale-105 cursor-pointer active:scale-95"
                    >
                      <span>Inquire Service Now ↗</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 🎛️ Interactive Service Switcher Tabs สำหรับเลือกบริการ */}
              <div className="pt-3 border-t border-stone-200 space-y-1.5 mt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block">
                  Select Core Logistics Service :
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

            {/* 🌟 ฝั่งขวา: Pure Floating 3D Image (ภาพสีสมบูรณ์ และตั้งตรง 0 องศาเมื่อ Scroll เสร็จ) */}
            <div className="lg:col-span-5 flex items-center justify-center relative perspective-2000 h-full">
              <motion.div
                style={{
                  x: objectX,
                  y: objectY,
                  scale: objectScale,
                  rotateZ: useTransform(smoothProgress, [0.12, 0.45, 0.6], [-8, 2, 0]),
                  rotateY: useTransform(smoothProgress, [0.12, 0.45, 0.6], [16, -4, 0]),
                }}
                className="relative w-full max-w-[380px] sm:max-w-[440px] flex items-center justify-center pointer-events-auto"
              >
                {/* 🌟 อนิเมชันลอยตัวขึ้น-ลงอย่างนุ่มนวล */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative w-full aspect-[4/5] max-h-[460px] sm:max-h-[500px] flex items-center justify-center group cursor-pointer"
                >
                  {/* แสง Glow โทนอุ่นด้านหลังภาพ */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/40 via-orange-200/40 to-yellow-200/30 rounded-full blur-3xl opacity-70 pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

                  {/* ตัวรูปภาพหลัก (สีสดใสธรรมชาติ ไร้ grayscale พร้อมขอบมนและเงาสมจริง) */}
                  <div className="relative w-full h-full rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(120,53,15,0.18)] border border-stone-200/80 group-hover:scale-105 transition-transform duration-700">
                    <img
                      src={currentService.img}
                      alt={currentService.title}
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                    
                    {/* แสงเงา Overlay สไตล์ Cinematic Warm Film */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                    
                    {/* ไตเติลลอยบนรูปภาพ */}
                    <div className="absolute bottom-5 left-5 right-5 text-left space-y-1">
                      <span className="text-[10px] font-mono text-amber-300 font-extrabold uppercase tracking-widest block drop-shadow-md">
                        HANDLE INTER CONSOLIDATION CO., LTD.
                      </span>
                      <h5 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug drop-shadow-lg">
                        {currentService.title}
                      </h5>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

    
      {/* 🎯 SECTION 4: EXCLUSIVE CONTACT CARDS (SOFT CREAM WARM LUXURY THEME) */}
      <section
        id="Contact Us"
        className="relative w-full min-h-screen bg-[#FDFBF7] text-stone-900 py-20 lg:py-28 px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-center overflow-hidden border-t border-stone-200"
      >
        {/* Background Ambient Warm Glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center relative z-10 space-y-12">
          
          {/* Header Title */}
          <ScrollCardReveal direction="up">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-amber-50/80 border border-amber-200/60 px-6 py-2 rounded-full text-xs font-bold text-amber-800 font-mono shadow-sm backdrop-blur-md">
                <i className="fa-solid fa-address-card text-amber-700"></i>
                <span>{lang === "en" ? "Contact Information" : "ข้อมูลติดต่อฝ่ายการตลาดและประสานงาน"}</span>
              </div>
              
              <h3 className="font-black text-stone-900 text-3xl sm:text-5xl tracking-tight">
                {lang === "en" ? "H.I.T. Intercon Co., Ltd." : "บริษัท เอช.ไอ.ที. อินเตอร์คอน จำกัด"}
              </h3>
              
              <p className="text-xs sm:text-sm text-stone-500 font-mono max-w-2xl mx-auto">
                Hotline: 0-2393-2300 (Auto) | Fax: 0-2393-7307-10 | admincenter@handleintergroup.com
              </p>
            </div>
          </ScrollCardReveal>

          {/* 🎴 Soft Cream Asymmetrical Arch Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
            
            {/* 🎴 Business Card 1 */}
            <ScrollCardReveal direction="left" delay={100} className="h-full">
              <div className="h-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-amber-200/70 hover:border-amber-400/80 rounded-tr-[70px] sm:rounded-tr-[110px] rounded-bl-[70px] sm:rounded-bl-[110px] rounded-tl-3xl rounded-br-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(217,119,6,0.08)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:-translate-y-1.5 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8">
                  
                  {/* ฝั่งซ้าย: โลโก้และชื่อบริษัท */}
                  <div className="w-full sm:w-5/12 flex flex-col items-center justify-center text-center space-y-3 bg-white/80 border border-amber-100 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-5 shadow-sm">
                    <img
                      src="/images/1725e41.png"
                      alt="Handle Inter Group Logo"
                      className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <div>
                      <h4 className="font-black text-stone-900 text-sm tracking-wider uppercase font-mono">
                        H.I.T. INTERCON
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium tracking-tight">
                        Total Logistics Solution
                      </p>
                    </div>
                  </div>

                  {/* เส้นแบ่งแนวตั้งโทนอุ่น */}
                  <div className="hidden sm:block w-[1.5px] bg-gradient-to-b from-amber-300 via-amber-400/50 to-transparent rounded-full my-1" />
                  <div className="block sm:hidden w-full h-[1.5px] bg-gradient-to-r from-amber-300 via-amber-400/50 to-transparent rounded-full" />

                  {/* ฝั่งขวา: ข้อมูลผู้บริหารและการติดต่อ */}
                  <div className="w-full sm:w-7/12 space-y-4 text-left flex flex-col justify-center">
                    <div>
                      <h3 className="font-black text-stone-900 text-xl sm:text-2xl tracking-tight leading-snug">
                        {isMounted && detailText.c1_name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 tracking-wide mt-1 font-mono">
                        {isMounted && detailText.c1_pos}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600 font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <span className="line-clamp-1 text-stone-700">Bangkok & Worldwide Hub</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-phone"></i>
                        </div>
                        <a
                          href={`tel:${isMounted ? detailText.c1_phone : ""}`}
                          className="hover:text-amber-700 transition-colors font-mono text-stone-800 font-semibold"
                        >
                          {isMounted && detailText.c1_phone}
                        </a>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-envelope"></i>
                        </div>
                        <a
                          href={`mailto:${isMounted ? detailText.c1_mail : ""}`}
                          className="hover:text-amber-700 transition-colors line-clamp-1 font-mono text-stone-800 font-semibold"
                        >
                          {isMounted && detailText.c1_mail}
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollCardReveal>

            {/* 🎴 Business Card 2 */}
            <ScrollCardReveal direction="right" delay={200} className="h-full">
              <div className="h-full bg-[#FAF6EE]/90 hover:bg-[#FAF6EE] border border-amber-200/70 hover:border-amber-400/80 rounded-tr-[70px] sm:rounded-tr-[110px] rounded-bl-[70px] sm:rounded-bl-[110px] rounded-tl-3xl rounded-br-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(217,119,6,0.08)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:-translate-y-1.5 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8">
                  
                  {/* ฝั่งซ้าย: โลโก้และชื่อบริษัท */}
                  <div className="w-full sm:w-5/12 flex flex-col items-center justify-center text-center space-y-3 bg-white/80 border border-amber-100 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-5 shadow-sm">
                    <img
                      src="/images/1725e41.png"
                      alt="Handle Inter Group Logo"
                      className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <div>
                      <h4 className="font-black text-stone-900 text-sm tracking-wider uppercase font-mono">
                        H.I.T. INTERCON
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium tracking-tight">
                        Total Logistics Solution
                      </p>
                    </div>
                  </div>

                  {/* เส้นแบ่งแนวตั้งโทนอุ่น */}
                  <div className="hidden sm:block w-[1.5px] bg-gradient-to-b from-amber-300 via-amber-400/50 to-transparent rounded-full my-1" />
                  <div className="block sm:hidden w-full h-[1.5px] bg-gradient-to-r from-amber-300 via-amber-400/50 to-transparent rounded-full" />

                  {/* ฝั่งขวา: ข้อมูลผู้บริหารและการติดต่อ */}
                  <div className="w-full sm:w-7/12 space-y-4 text-left flex flex-col justify-center">
                    <div>
                      <h3 className="font-black text-stone-900 text-xl sm:text-2xl tracking-tight leading-snug">
                        {isMounted && detailText.c2_name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 tracking-wide mt-1 font-mono">
                        {isMounted && detailText.c2_pos}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600 font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <span className="line-clamp-1 text-stone-700">Bangkok & Worldwide Hub</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-phone"></i>
                        </div>
                        <a
                          href={`tel:${isMounted ? detailText.c2_phone : ""}`}
                          className="hover:text-amber-700 transition-colors font-mono text-stone-800 font-semibold"
                        >
                          {isMounted && detailText.c2_phone}
                        </a>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <i className="fa-solid fa-envelope"></i>
                        </div>
                        <a
                          href={`mailto:${isMounted ? detailText.c2_mail : ""}`}
                          className="hover:text-amber-700 transition-colors line-clamp-1 font-mono text-stone-800 font-semibold"
                        >
                          {isMounted && detailText.c2_mail}
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollCardReveal>

          </div>

          {/* ปุ่ม Back to About Us โทนพรีเมียมอบอุ่น */}
          <ScrollCardReveal direction="up" delay={300}>
            <div className="pt-6 text-center">
              <Link
                href="/aboutus"
                className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-amber-800 text-amber-50 border border-stone-800 text-xs font-mono font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <i className="fa-solid fa-arrow-left text-[10px] mr-1"></i>
                <span>{lang === "en" ? "Back to About Us" : "กลับสู่หน้าเกี่ยวกับเรา"}</span>
              </Link>
            </div>
          </ScrollCardReveal>

        </div>
      </section>
    </div>
  );
}