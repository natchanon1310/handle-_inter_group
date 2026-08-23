"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { dictionary } from "../utils/dictionaries";

// 🎬 Component การ์ดซ้อนโทนมินิมอล (จัดสไตล์เหมือนภาพถ่ายหน้าจอเป๊ะ)
function MinimalCardStack({
  subtitle,
  title,
  items,
}: {
  subtitle: string;
  title: React.ReactNode;
  items: Array<{
    id: string;
    num: string;
    tag: string;
    title: string;
    desc: string;
    subContent?: React.ReactNode;
  }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // ตรวจสอบว่า Container อยู่กลางหน้าจอแล้วหรือยัง
      const isCentered =
        rect.top <= windowHeight * 0.15 && rect.bottom >= windowHeight * 0.85;

      if (!isCentered) return;

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      const canNext = isScrollingDown && activeIndex < items.length - 1;
      const canPrev = isScrollingUp && activeIndex > 0;

      if (canNext || canPrev) {
        e.preventDefault(); // 🛑 ดักจับการ Scroll ไม่ให้หน้าเว็บเลื่อน

        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;

        if (canNext) {
          setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
        } else if (canPrev) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 450);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeIndex, items.length]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-16 px-4 bg-slate-50/50 overflow-hidden"
    >
      {/* ส่วนหัวข้อ Title สไตล์มินิมอล */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-10 shrink-0">
        <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest block font-mono">
          {subtitle}
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      {/* Container การ์ดซ้อน ถอดแบบจากภาพถ่ายหน้าจอ */}
      <div className="relative w-full max-w-3xl h-[440px] flex items-center justify-center">
        {items.map((item, index) => {
          const isPassed = index < activeIndex;
          const isActive = index === activeIndex;
          const isUpcoming = index > activeIndex;

          let yOffset = "100%";
          let scale = 1;
          let opacity = 0;

          if (isActive) {
            yOffset = "0%";
            scale = 1;
            opacity = 1;
          } else if (isPassed) {
            const diff = activeIndex - index;
            yOffset = "0%";
            scale = 1 - diff * 0.04;
            opacity = Math.max(0.2, 1 - diff * 0.25);
          } else if (isUpcoming) {
            yOffset = "100%";
            scale = 1;
            opacity = 0;
          }

          return (
            <motion.div
              key={item.id}
              initial={false}
              animate={{
                y: yOffset,
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 24,
              }}
              style={{ zIndex: index + 10 }}
              className="absolute inset-x-0 mx-auto w-full max-w-3xl h-[420px] transform-gpu flex flex-col justify-center"
            >
              {/* การ์ดสไตล์มินิมอลตรงตามรูปถ่ายหน้าจอ */}
              <div className="bg-white rounded-[24px] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 h-full flex flex-col justify-between relative overflow-hidden">
                
                {/* 1. Header (Badge ด้านซ้าย + ตัวเลขสีส้มด้านขวา) */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50/80 border border-amber-200/80 px-4 py-1.5 rounded-full font-mono">
                    {item.tag}
                  </span>
                  <span className="text-4xl md:text-5xl font-normal font-sans text-orange-400">
                    {item.num}
                  </span>
                </div>

                {/* 2. Body (หัวข้อหลัก + คำอธิบาย + รายการย่อย) */}
                <div className="space-y-4 my-auto text-left">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                  {item.subContent}
                </div>

                {/* 3. Footer (เส้นแบ่งด้านบน + CAPABILITY DETAILS + ลำดับหน้า) */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-400 font-mono tracking-widest uppercase">
                  <span>CAPABILITY DETAILS</span>
                  <span className="font-semibold text-slate-500">{index + 1} / {items.length}</span>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modern Dots Indicator */}
      <div className="mt-8 flex items-center space-x-2.5 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex
                ? "w-8 bg-orange-500"
                : "w-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// 🎬 Component จัดการเอฟเฟกต์พลิกหน้าแบบ 3D
function FlipSection({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
          setIsVisible(true); 
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const flipStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "rotateX(0deg) translateY(0)" : "rotateX(-35deg) translateY(-50px)",
    pointerEvents: isVisible ? ("auto" as const) : ("none" as const)
  };

  return (
    <div 
      id={id} 
      ref={sectionRef} 
      style={isMounted ? flipStyle : { opacity: 0 }} 
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu origin-top [perspective:1200px] ${className || ""}`}
    >
      <div className={`transition-all duration-750 delay-200 transform-gpu w-full ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}>
        {children}
      </div>
    </div>
  );
}

export default function SiamLinersPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);

  const [visitedSections, setVisitedSections] = useState<Record<string, boolean>>({
    "overview": true, 
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
  const detailText = t.siamLiners || {};

  const sections = [
    { id: "overview", label: lang === "en" ? "Siam Liners" : "บริษัท สยามไลน์เนอร์ จำกัด" },
    { id: "capabilities", label: lang === "en" ? "Core NVOCC" : "จุดเด่นสายเรือ" },
    { id: "schedule", label: lang === "en" ? "Vessel Schedule" : "ตารางเดินเรือ" },
    { id: "contact-card", label: lang === "en" ? "Contact Us" : "ติดต่อแผนก" },
  ];

  // ข้อมูลสำหรับการ์ดซ้อนทับสไตล์ Minimal (เหมือนชุดที่หนึ่ง)
  const stackItems = useMemo(
    () => [
      {
        id: "s1",
        num: "01",
        tag: "SCHEDULED SAILINGS",
        title: detailText.feat1_title || "ตารางเดินเรือประจำ",
        desc: detailText.feat1_desc || "บริการตารางเดินเรือตรงเวลา สม่ำเสมอ ควบคุมกำหนดการได้ตามความต้องการของลูกค้าอย่างมืออาชีพ",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>ตารางเดินเรือครอบคลุมเส้นทางสายหลักในภูมิภาค</span>
          </div>
        ),
      },
      {
        id: "s2",
        num: "02",
        tag: "FLEXIBLE ROUTES",
        title: detailText.feat2_title || "เส้นทางขนส่งยืดหยุ่น",
        desc: detailText.feat2_desc || "รองรับเส้นทางการขนส่งทางทะเลที่หลากหลาย พร้อมปรับเปลี่ยนตารางการจัดส่งให้เหมาะกับธุรกิจของคุณ",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>เชื่อมต่อโครงข่ายการขนส่งระหว่างประเทศอย่างไร้รอยต่อ</span>
          </div>
        ),
      },
      {
        id: "s3",
        num: "03",
        tag: "EXPERT OPERATIONS",
        title: detailText.feat3_title || "ทีมงานผู้เชี่ยวชาญ NVOCC",
        desc: detailText.feat3_desc || "ทีมงานมากประสบการณ์พร้อมให้คำปรึกษาและดูแลความเรียบร้อยของตู้สินค้าในทุกขั้นตอนของการขนส่ง",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>บริการติดตามและบริหารจัดการตู้คอนเทนเนอร์ระดับมาตรฐานสากล</span>
          </div>
        ),
      },
      {
        id: "s4",
        num: "04",
        tag: "DIGITAL TRACKING",
        title: detailText.feat4_title || "ระบบติดตามสถานะทันสมัย",
        desc: detailText.feat4_desc || "ใช้เทคโนโลยีที่ทันสมัยในการอัปเดตและตรวจสอบสถานะการขนส่ง เพื่อความโปร่งใสและแม่นยำสูงสุด",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>ตรวจสอบตำแหน่งและสถานะสินค้าได้ตลอดเวลา</span>
          </div>
        ),
      },
    ],
    [detailText]
  );

  useEffect(() => {
    if (!isMounted) return;
    const handleScroll = () => {
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
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted, sections]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setVisitedSections((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="relative overflow-x-hidden bg-gray-50 text-gray-800">
      
      {/* 🎯 Line Dash Loader ด้านข้างจอ */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-6 items-end">
        {sections.map((section) => {
          const isActive = isMounted && activeSection === section.id;
          const isVisited = isMounted && visitedSections[section.id];
          return (
            <button key={section.id} onClick={() => scrollToSection(section.id)} className="group flex items-center space-x-4 focus:outline-none cursor-pointer">
              <span className={`text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                isActive ? "text-orange-600 translate-x-0 opacity-100" : isVisited ? "text-orange-400 opacity-60 group-hover:opacity-100" : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
              }`}>{section.label}</span>
              <div className="relative w-8 h-8 flex items-center justify-end">
                <span className={`absolute transition-all duration-300 rounded-full ${
                  isActive ? "w-8 h-[3px] bg-orange-600" : isVisited ? "w-5 h-[2px] bg-orange-400/80 group-hover:bg-orange-500 group-hover:w-7" : "w-4 h-[1.5px] bg-gray-300 group-hover:bg-orange-400 group-hover:w-6"
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 🎯 SECTION 1: HERO HEADER SECTION */}
      <FlipSection id="overview" className="relative w-full min-h-[55vh] flex items-center justify-center bg-slate-900 overflow-hidden border-b border-gray-200 text-white">
        
        {/* 1. ภาพฉากหลังเรือคอนเทนเนอร์ขนส่งเต็มพื้นที่ */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1920&q=80" 
            alt="Siam Liners Ocean Vessel Background" 
            className="w-full h-full object-cover opacity-80 brightness-95"
          />
          <div className="absolute inset-0 bg-slate-900/60 z-10" />
        </div>

        {/* 2. เนื้อหาข้อความลอยเด่นเหนือภาพฉากหลัง */}
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4 relative z-20 pt-28 pb-16 w-full">
          <div className="inline-block bg-orange-600 px-4 py-1.5 rounded-full shadow-md mb-1">
            <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
              {isMounted && detailText.heroSub}
            </span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {(isMounted && subsidiaries[6]?.name) || (isMounted && detailText.heroTitle)}
          </h1>

          <div className="w-16 h-[3.5px] bg-orange-500 mx-auto rounded-full mt-2" />

          <p className="text-slate-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed pt-2 font-medium drop-shadow-sm">
            {isMounted && detailText.heroDesc}
          </p>
        </div>
      </FlipSection>

      {/* SECTION 2: CORE CAPABILITIES (การ์ดมินิมอลแบบการ์ดซ้อน) */}
      <section id="capabilities" className="relative w-full">
        {isMounted && (
          <MinimalCardStack
            subtitle="NVOCC Liner Capabilities"
            title={detailText.coreTitle}
            items={stackItems}
          />
        )}
      </section>

      {/* SECTION 3: VESSEL SCHEDULE IMAGE SECTION */}
      <FlipSection id="schedule" className="bg-gray-50 py-24 border-y border-gray-200 min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block font-mono">Global Sailings</span>
            <h2 className="text-3xl font-black text-slate-900">{isMounted && detailText.scheduleTitle}</h2>
          </div>
          
          <div className="bg-white p-4 md:p-8 rounded-3xl border border-gray-200 shadow-xl overflow-hidden group max-w-4xl mx-auto">
            <img 
              src="/images/14370015_1190770380966664_7177799465110770306_n-1 (1).jpg" 
              alt="Siam Liners Import & Export Vessel Schedule" 
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </FlipSection>

      {/* SECTION 4: DEPARTMENTS CONTACT CARDS */}
      <FlipSection id="contact-card" className="bg-white py-24 flex items-center">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12 w-full">
          <div className="space-y-2">
            <div className="inline-block bg-orange-50 border border-orange-100 px-6 py-3 rounded-full text-xs font-bold text-orange-700 font-mono">
              <i className="fa-solid fa-headset mr-2"></i> {isMounted && detailText.contactTitle}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 pt-2">Siam Liners Co., Ltd. Central Hotline</h3>
            <p className="text-xs text-gray-500 font-mono">Center: 02-393-5300 #5141 , 080-993-6445</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* กล่องแผนก Sales */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-sm text-left space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center text-md"><i className="fa-solid fa-percent"></i></div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{lang === "en" ? "Sales Department" : "แผนก Sales"}</h4>
                  <p className="text-[10px] text-gray-400">Quotations & Special Pricing</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p><i className="fa-solid fa-phone text-orange-500 mr-2 w-4"></i>092-280-6609</p>
                <p><i className="fa-solid fa-phone text-orange-500 mr-2 w-4"></i>099-227-9517</p>
                <p><i className="fa-solid fa-envelope text-orange-500 mr-2 w-4"></i>SLN_SALES@siamliner.com</p>
              </div>
            </div>

            {/* กล่องแผนก Customer Service & Operations */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-sm text-left space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-md"><i className="fa-solid fa-people-carry-box"></i></div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{lang === "en" ? "Customer Service Department" : "แผนก Customer Service"}</h4>
                  <p className="text-[10px] text-gray-400">Operations & Booking Controls</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p><i className="fa-solid fa-user-tie text-orange-500 mr-2 w-4"></i>086-894-1581 (K. Keaw)</p>
                <p><i className="fa-solid fa-user-tie text-orange-500 mr-2 w-4"></i>088-809-9293 (K. Yale)</p>
                <p><i className="fa-solid fa-circle-arrow-up text-orange-500 mr-2 w-4"></i><strong>Export:</strong> SLN_OUTBOUND@siamliner.com</p>
                <p><i className="fa-solid fa-circle-arrow-down text-orange-500 mr-2 w-4"></i><strong>Import:</strong> SLN_INBOUND@siamliner.com</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/aboutus" className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition cursor-pointer">
              <span>{lang === "en" ? "Back to About Us" : "กลับสู่หน้าเกี่ยวกับเรา"}</span>
              <i className="fa-solid fa-arrow-left text-[10px] order-first mr-2"></i>
            </Link>
          </div>
        </div>
      </FlipSection>
      
    </div>
  );
}