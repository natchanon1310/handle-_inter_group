"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { dictionary } from "../utils/dictionaries";

// 🎬 Component การ์ดสไตล์ Masonry Grid ที่กรอบการ์ดคงที่ แต่เนื้อหาภายในสลับอนิเมชันได้
function AsymmetricMasonryCard({
  cardSlot,
  content,
  index,
  className = "",
  imgHeight = "h-48",
  onHoverChange,
}: {
  cardSlot: { id: string; num: string; spanClass: string };
  content: {
    tag: string;
    title: string;
    desc: string;
    imgSrc: string;
    subContent?: React.ReactNode;
  };
  index: number;
  className?: string;
  imgHeight?: string;
  onHoverChange?: (isHovered: boolean) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
      className={`h-full ${className}`}
    >
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8 h-full flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:border-orange-400 group cursor-pointer overflow-hidden relative hover:-translate-y-1.5">
        
        {/* AnimatePresence ควบคุมอนิเมชันสลับเนื้อหาภายใน */}
        <AnimatePresence mode="wait">
          <motion.div
            key={content.title} // สลับอนิเมชันเมื่อ Title เปลี่ยน
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Header Badge & Fixed Number */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
                {content.tag}
              </span>
              <span className="text-3xl md:text-4xl font-black font-mono text-orange-400/80">
                {cardSlot.num}
              </span>
            </div>

            {/* Image Block */}
            <div className={`w-full ${imgHeight} rounded-2xl overflow-hidden bg-slate-100 relative group/img`}>
              <img
                src={content.imgSrc}
                alt={content.title}
                className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-60" />
            </div>

            {/* Content Block */}
            <div className="space-y-2 text-left">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
                {content.title}
              </h3>

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-normal line-clamp-3">
                {content.desc}
              </p>

              {content.subContent && (
                <div className="pt-1">
                  {content.subContent}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Card Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest z-10">
          <span>HANDLE INTER LOGISTICS</span>
          <span className="text-orange-500 group-hover:translate-x-1 transition-transform">
            EXPLORE ↗
          </span>
        </div>

      </div>
    </div>
  );
}

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

export default function HandleInterLogisticsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const [visitedSections, setVisitedSections] = useState<Record<string, boolean>>({
    overview: true,
  });

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
  const detailText = t.interLogistics || {};

  const sections = useMemo(
    () => [
      { id: "overview", label: lang === "en" ? "Overview" : "ภาพรวม" },
      { id: "capabilities", label: lang === "en" ? "Capabilities" : "ขีดความสามารถ" },
      { id: "truck-fleet", label: lang === "en" ? "Fleet" : "ประเภทรถขนส่ง" },
      { id: "contact-card", label: lang === "en" ? "Contact Us" : "ติดต่อเรา" },
    ],
    [lang]
  );

  // 1. ตำแหน่งกรอบการ์ด (Slots) ที่ประจำตำแหน่งเดิมเสมอ
  const fixedCardSlots = useMemo(
    () => [
      { id: "slot1", num: "01", spanClass: "md:col-span-7", imgHeight: "h-64 md:h-72" },
      { id: "slot2", num: "02", spanClass: "md:col-span-5", imgHeight: "h-48 md:h-56" },
      { id: "slot3", num: "03", spanClass: "md:col-span-5", imgHeight: "h-52 md:h-60" },
      { id: "slot4", num: "04", spanClass: "md:col-span-7", imgHeight: "h-60 md:h-68" },
      { id: "slot5", num: "05", spanClass: "md:col-span-12", imgHeight: "h-56 md:h-64" },
    ],
    []
  );

  // 2. ชุดข้อมูลเนื้อหาของ Handle Inter Logistics ที่จะนำมาสุ่มสลับ (Contents Pool)
  const initialContents = useMemo(
    () => [
      {
        tag: "OCEAN LOGISTICS",
        title: detailText.s1_title || "ขนส่งสินค้าทางทะเล",
        desc: detailText.s1_desc || "บริการขนส่งสินค้าทางทะเลทั้งแบบเต็มตู้ (FCL) และไม่เต็มตู้ (LCL) ครอบคลุมท่าเรือหลักทั่วโลก",
        imgSrc: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1000&q=80",
        subContent: (
          <div className="flex items-center text-xs font-bold text-slate-800 pt-1">
            <i className="fa-solid fa-circle-check text-orange-500 mr-2 text-sm" />
            <span>{detailText.s1_sub1 || "บริการขนส่งสินค้าครอบคลุมทุกเส้นทางหลักทั่วโลก"}</span>
          </div>
        ),
      },
      {
        tag: "AIR EXPRESS",
        title: detailText.s2_title || "ขนส่งสินค้าทางอากาศ",
        desc: detailText.s2_desc || "ประสบการณ์การขนส่งสินค้าทางอากาศทั้งขาเข้าและขาออก ไปยังทุกมุมทั่วโลก ทุกเส้นทาง ทุกเวลา ทุกประเภทสินค้า จัดการได้ตามความต้องการแบบรู้จริงทุกเส้นทาง",
        imgSrc: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80",
        subContent: (
          <div className="flex items-center text-xs font-bold text-slate-800 pt-1">
            <i className="fa-solid fa-circle-check text-orange-500 mr-2 text-sm" />
            <span>{detailText.s2_sub1 || "บริการขนส่งสินค้าแบบถึงมือผู้รับ Door to door (DDU / DDP / FCA / Ex-work)"}</span>
          </div>
        ),
      },
      {
        tag: "LCL CONSOLIDATION",
        title: detailText.s3_title || "บริการขนส่งแบบไม่เต็มตู้ (LCL)",
        desc: detailText.s3_desc || "ศูนย์รวมการรวบรวมสินค้า LCL ช่วยลดต้นทุนในการขนส่ง เพิ่มความยืดหยุ่นในการจัดการสินค้าขนาดเล็ก",
        imgSrc: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
        subContent: (
          <div className="flex items-center text-xs font-bold text-slate-800 pt-1">
            <i className="fa-solid fa-circle-check text-orange-500 mr-2 text-sm" />
            <span>บริการจัดตารางเรือและรวบรวมตู้คอนเทนเนอร์ตรงเวลา</span>
          </div>
        ),
      },
      {
        tag: "CUSTOMS CLEARANCE",
        title: detailText.s4_title || "บริการตัวแทนออกของและพิธีการศุลกากร",
        desc: detailText.s4_desc || "ดำเนินการพิธีการศุลกากรขาเข้าและขาออกด้วยความถูกต้อง รวดเร็ว โดยทีมงานผู้เชี่ยวชาญระดับมืออาชีพ",
        imgSrc: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80",
        subContent: (
          <div className="flex items-center text-xs font-bold text-slate-800 pt-1">
            <i className="fa-solid fa-circle-check text-orange-500 mr-2 text-sm" />
            <span>{detailText.s4_sub1 || "พิธีการศุลกากรแบบครบวงจร พร้อมคำปรึกษาด้านสิทธิประโยชน์"}</span>
          </div>
        ),
      },
      {
        tag: "LAND TRANSPORT",
        title: lang === "en" ? "Comprehensive Land Transport Solutions" : "รองรับทุกความต้องการด้านการขนส่งทางบก",
        desc: lang === "en" 
          ? "Cross-border and domestic trucking logistics with high-capacity fleet and real-time GPS tracking."
          : "เครือข่ายฟลีตรถขนส่งทางบกครอบคลุมทั่วประเทศและข้ามแดน ปลอดภัย รวดเร็ว พร้อมระบบ GPS ติดตามสถานะตลอดการเดินทาง",
        imgSrc: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
        subContent: (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center space-x-2.5">
              <i className="fa-solid fa-truck-front text-orange-500 text-base" />
              <span className="text-xs font-bold text-slate-800">{detailText.s5_t1 || "รถกระบะ 4 ล้อ / 6 ล้อ"}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center space-x-2.5">
              <i className="fa-solid fa-truck text-orange-500 text-base" />
              <span className="text-xs font-bold text-slate-800">{detailText.s5_t2 || "รถบรรทุก 10 ล้อ"}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center space-x-2.5">
              <i className="fa-solid fa-truck-moving text-orange-500 text-base" />
              <span className="text-xs font-bold text-slate-800">{detailText.s5_t3 || "หัวลากตู้คอนเทนเนอร์"}</span>
            </div>
          </div>
        ),
      },
    ],
    [detailText, lang]
  );

  // State สำหรับเก็บข้อมูลเนื้อหาที่ถูกสุ่มสลับ
  const [shuffledContents, setShuffledContents] = useState(initialContents);

  // อัปเดตเนื้อหาเมื่อเปลี่ยนภาษา
  useEffect(() => {
    setShuffledContents(initialContents);
  }, [initialContents]);

  // ฟังก์ชันสุ่มสลับเฉพาะเนื้อหาภายใน (Content Shuffle)
  const shuffleContents = () => {
    setShuffledContents((prev) => {
      const array = [...prev];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    });
  };

  // 🔄 ระบบ Auto-Shuffle สลับเนื้อหาการ์ดอัตโนมัติทุกๆ 6 วินาที
  useEffect(() => {
    if (isCardHovered) return;

    const interval = setInterval(() => {
      shuffleContents();
    }, 6000);

    return () => clearInterval(interval);
  }, [isCardHovered]);

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
  }, [isMounted, sections]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setVisitedSections((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="relative overflow-x-hidden bg-slate-100 text-slate-800">
      {/* Side Progress Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-6 items-end">
        {sections.map((section) => {
          const isActive = isMounted && activeSection === section.id;
          const isVisited = isMounted && visitedSections[section.id];
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
                    : isVisited
                    ? "text-orange-400 opacity-60 group-hover:opacity-100"
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
                      : isVisited
                      ? "w-5 h-[2px] bg-orange-400/80 group-hover:bg-orange-500 group-hover:w-7"
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
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
            alt="Handle Inter Logistics Hub"
            className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-20 pt-20 w-full flex flex-col items-center justify-center">
          <ScrollCardReveal direction="up" delay={100}>
            <div className="inline-block bg-orange-600/90 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                {isMounted && (detailText.heroSub || "HANDLE INTER LOGISTICS")}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-md mt-2">
              {isMounted && (subsidiaries[1]?.name || detailText.heroTitle || "HANDLE INTER LOGISTICS CO., LTD.")}
            </h1>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full my-4" />
            <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-normal">
              {isMounted && (subsidiaries[1]?.desc || "")} — {isMounted && detailText.heroDesc}
            </p>

            <div className="pt-6">
              <button
                onClick={() => scrollToSection("capabilities")}
                className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-600/30 inline-flex items-center space-x-3 cursor-pointer"
              >
                <span>{lang === "en" ? "EXPLORE CAPABILITIES" : "สำรวจขีดความสามารถ"}</span>
                <span className="animate-bounce">↓</span>
              </button>
            </div>
          </ScrollCardReveal>
        </div>
      </section>

      {/* 🎯 SECTION 2: MASONRY / ASYMMETRIC GRID */}
      <section id="capabilities" className="py-24 px-6 max-w-7xl mx-auto relative w-full">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono">
            Total Integrated Freight
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isMounted && (detailText.coreTitle || "ขีดความสามารถและบริการหลักของเรา")}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-normal">
            {lang === "en"
              ? "Fixed structure layout. Content inside transitions automatically across cards."
              : "โครงสร้างการ์ดประจำตำแหน่ง พร้อมระบบสลับเปลี่ยนเนื้อหาภายในอัตโนมัติ"}
          </p>

          {/* 🔀 ปุ่มกดสุ่มสลับเนื้อหาการ์ด manual */}
          <div className="pt-2">
            <button
              onClick={shuffleContents}
              className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-full text-xs font-mono font-bold transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>SHUFFLE CONTENT</span>
              <span className="text-sm">🔀</span>
            </button>
          </div>
        </div>

        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {fixedCardSlots.map((slot, index) => {
            const content = shuffledContents[index % shuffledContents.length];
            return (
              <div key={slot.id} className={slot.spanClass}>
                <AsymmetricMasonryCard
                  cardSlot={slot}
                  content={content}
                  index={index}
                  imgHeight={slot.imgHeight}
                  onHoverChange={setIsCardHovered}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* 🎯 SECTION 3: TRUCK FLEET CONFIGURATION */}
      <section id="truck-fleet" className="bg-white py-24 border-y border-slate-200/80 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center w-full">
          <div className="lg:col-span-5 space-y-6 text-left">
            <ScrollCardReveal direction="left">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block font-mono">
                {isMounted && detailText.s5_title}
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {isMounted && detailText.s5_subTitle}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isMounted && detailText.s5_desc}
              </p>
              
              <div className="flex gap-4 pt-2">
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-200/80 shadow-sm font-black text-slate-800 text-xs">
                  <i className="fa-solid fa-truck-ramp-box text-orange-500 mr-2"></i>
                  {isMounted && detailText.s5_h1}
                </div>
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-200/80 shadow-sm font-black text-slate-800 text-xs">
                  <i className="fa-solid fa-truck-ramp-box text-orange-500 mr-2"></i>
                  {isMounted && detailText.s5_h2}
                </div>
              </div>
            </ScrollCardReveal>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <ScrollCardReveal direction="up" delay={100}>
              <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3 text-left transition-all duration-300 hover:shadow-md hover:border-orange-300">
                <div className="text-2xl text-orange-600">
                  <i className="fa-solid fa-truck-front"></i>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {isMounted && detailText.s5_t1}
                </h4>
              </div>
            </ScrollCardReveal>

            <ScrollCardReveal direction="up" delay={200}>
              <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3 text-left transition-all duration-300 hover:shadow-md hover:border-orange-300">
                <div className="text-2xl text-orange-600">
                  <i className="fa-solid fa-truck"></i>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {isMounted && detailText.s5_t2}
                </h4>
              </div>
            </ScrollCardReveal>

            <ScrollCardReveal direction="up" delay={300}>
              <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3 text-left transition-all duration-300 hover:shadow-md hover:border-orange-300">
                <div className="text-2xl text-orange-600">
                  <i className="fa-solid fa-truck-moving"></i>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {isMounted && detailText.s5_t3}
                </h4>
              </div>
            </ScrollCardReveal>
          </div>
        </div>
      </section>

      {/* 🎯 SECTION 4: EXCLUSIVE CONTACT INFO */}
      <section id="contact-card" className="py-24 max-w-7xl mx-auto px-6">
        <ScrollCardReveal direction="up">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block bg-orange-50 border border-orange-100 px-6 py-2 rounded-full text-xs font-bold text-orange-700 font-mono">
              <i className="fa-solid fa-address-card mr-2"></i>
              {lang === "en" ? "Contact Information" : "ข้อมูลติดต่อฝ่ายการตลาดและประสานงาน"}
            </div>
            <h3 className="font-black text-slate-900 text-3xl">
              {lang === "en" ? "Handle Inter Logistics Co., Ltd." : "บริษัท แฮนเดิล อินเตอร์ โลจิสติกส์ จํากัด"}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Hotline: 0-2393-2300 (Auto) | Fax: 0-2393-7307-10 | admincenter@handleintergroup.com
            </p>
          </div>
        </ScrollCardReveal>

        <div className="max-w-3xl mx-auto">
          <ScrollCardReveal direction="up" delay={100}>
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-8 md:p-10 shadow-2xl shadow-slate-200/60 relative overflow-hidden transition-all duration-300 hover:shadow-3xl hover:border-orange-400 group hover:-translate-y-1">
              <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-8">
                
                {/* ฝั่งซ้าย: Logo & Company Name */}
                <div className="w-full md:w-5/12 flex flex-col items-center justify-center text-center space-y-3">
                  <img
                    src="/images/handle inter con.png"
                    alt="Handle Inter Logistics Logo"
                    className="h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm tracking-wider uppercase font-mono">
                      HANDLE INTER LOGISTICS
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                      Freight & Trucking Fleet Solution
                    </p>
                  </div>
                </div>

                {/* เส้นแบ่งสีส้มแนวตั้ง */}
                <div className="hidden md:block w-[2px] bg-gradient-to-b from-orange-400 via-orange-500 to-amber-500 rounded-full my-1" />
                <div className="block md:hidden w-full h-[2px] bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-full" />

                {/* ฝั่งขวา: Executive Info & Contacts */}
                <div className="w-full md:w-7/12 space-y-4 text-left flex flex-col justify-center">
                  <div>
                    <h3 className="font-black text-slate-900 text-xl tracking-tight leading-snug">
                      {isMounted && detailText.contact_name}
                    </h3>
                    <p className="text-xs font-bold text-orange-600 tracking-wide mt-0.5">
                      {isMounted && detailText.contact_position}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 text-xs text-slate-600 font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <span className="line-clamp-1">Bangkok & ASEAN Logistics Fleet</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <a href={`tel:${isMounted ? detailText.contact_phone : ""}`} className="hover:text-orange-600 transition-colors">
                        {isMounted && detailText.contact_phone}
                      </a>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <a href={`mailto:${isMounted ? detailText.contact_email : ""}`} className="hover:text-orange-600 transition-colors line-clamp-1">
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
          <div className="pt-16 text-center">
            <Link
              href="/aboutus"
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-8 py-4 rounded-full shadow-lg transition duration-300 cursor-pointer hover:scale-105"
            >
              <i className="fa-solid fa-arrow-left text-[10px] mr-2"></i>
              <span>{lang === "en" ? "Back to About Us" : "กลับสู่หน้าเกี่ยวกับเรา"}</span>
            </Link>
          </div>
        </ScrollCardReveal>
      </section>

    </div>
  );
}