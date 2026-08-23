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

// 🎬 Component จัดการ ScrollReveal พื้นฐาน (ใช้ระบบเดียวกันกับชุดที่หนึ่ง)
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
  const detailText = t.consolidation || {};

  const sections = useMemo(
    () => [
      { id: "overview", label: lang === "en" ? "Overview" : "ภาพรวม" },
      { id: "capabilities", label: lang === "en" ? "Capabilities" : "ขีดความสามารถ" },
      { id: "benefits", label: lang === "en" ? "Benefits" : "จุดเด่น" },
      { id: "network-links", label: lang === "en" ? "Contact Us" : "ติดต่อเรา" },
    ],
    [lang]
  );

  // ข้อมูลสำหรับการ์ดซ้อนทับ ปรับโครงสร้างสไตล์มินิมอลแบบการ์ดชุดที่ 1
  const stackItems = useMemo(
    () => [
      {
        id: "s1",
        num: "01",
        tag: "OCEAN LOGISTICS",
        title: detailText.c1_title || "ขนส่งสินค้าทางทะเล",
        desc: detailText.c1_desc || "บริการขนส่งสินค้าทางทะเลทั้งแบบเต็มตู้ (FCL) และไม่เต็มตู้ (LCL) ครอบคลุมท่าเรือหลักทั่วโลก",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>บริการรวบรวมตู้คอนเทนเนอร์ LCL และบริหารเส้นทางขนส่งทางทะเล</span>
          </div>
        ),
      },
      {
        id: "s2",
        num: "02",
        tag: "AIR EXPRESS",
        title: detailText.c2_title || "ขนส่งสินค้าทางอากาศ",
        desc: detailText.c2_desc || "บริการขนส่งสินค้าทางอากาศด่วนพิเศษ ครอบคลุมทุกปลายทางทั่วโลก การันตีความตรงต่อเวลา",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>รองรับการจัดส่งแบบ Door-to-Door และโซลูชัน Express เร่งด่วน</span>
          </div>
        ),
      },
      {
        id: "s3",
        num: "03",
        tag: "CUSTOMS CLEARANCE",
        title: detailText.c3_title || "พิธีการศุลกากร",
        desc: detailText.c3_desc || "จัดการเอกสารและพิธีการศุลกากรอย่างถูกต้อง ครบถ้วน รวดเร็ว โดยทีมงานผู้เชี่ยวชาญ",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>ดูแลสิทธิประโยชน์ทางภาษีและการผ่านแดนแบบครบวงจร</span>
          </div>
        ),
      },
    ],
    [detailText]
  );

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

      {/* SECTION 1: HERO HEADER */}
      <section
        id="overview"
        className="relative w-full min-h-[60vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
            alt="Handle Inter Consolidation Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-4 relative z-20 pt-28 pb-16 w-full">
          <ScrollCardReveal direction="up" delay={100}>
            <div className="inline-block bg-orange-600/90 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                {isMounted && (detailText.heroSub || "HANDLE INTER CONSOLIDATION")}
              </span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md mt-2">
              {isMounted && (subsidiaries[2]?.name || detailText.heroTitle || "HANDLE INTER CONSOLIDATION CO., LTD.")}
            </h1>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full my-4" />
            <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-normal">
              {isMounted && ((subsidiaries[2]?.desc ? `${subsidiaries[2].desc} — ` : "") + detailText.heroDesc)}
            </p>
          </ScrollCardReveal>
        </div>
      </section>

      {/* SECTION 2: CORE CAPABILITIES (การ์ดมินิมอลแบบการ์ดซ้อน) */}
      <section id="capabilities" className="relative w-full">
        {isMounted && (
          <MinimalCardStack
            subtitle="Operational Excellence"
            title={detailText.coreTitle}
            items={stackItems}
          />
        )}
      </section>

      {/* SECTION 3: STRATEGIC BENEFITS SECTION */}
      <section id="benefits" className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <ScrollCardReveal direction="up">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block font-mono">
                {isMounted && (t.about?.sub_sub || "STRATEGIC ADVANTAGE")}
              </span>
              <h2 className="text-3xl font-black text-white">{isMounted && detailText.specTitle}</h2>
            </div>
          </ScrollCardReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollCardReveal direction="left" delay={100}>
              <div className="h-[360px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" 
                  alt="Container Logistics" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </ScrollCardReveal>

            <ScrollCardReveal direction="right" delay={200}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[detailText.spec1, detailText.spec2, detailText.spec3, detailText.spec4].map((spec, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-lg hover:border-orange-500/80 transition-all duration-300">
                    <div className="text-orange-400 text-base"><i className="fa-solid fa-circle-check"></i></div>
                    <span className="text-xs font-bold text-slate-200">{spec}</span>
                  </div>
                ))}
              </div>
            </ScrollCardReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4: EXCLUSIVE CONTACT CARDS */}
      <section id="network-links" className="py-24 max-w-7xl mx-auto px-6">
        <ScrollCardReveal direction="up">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-block bg-orange-50 border border-orange-100 px-6 py-2 rounded-full text-xs font-bold text-orange-700 font-mono">
              <i className="fa-solid fa-address-card mr-2"></i>
              {lang === "en" ? "Contact Information" : "ข้อมูลติดต่อเพิ่มเติม"}
            </div>
            <h3 className="font-black text-slate-900 text-2xl">
              {lang === "en" ? "Handle Inter Consolidation Co., Ltd." : "บริษัท แฮนเดิล อินเตอร์ คอนโซลลิเดชั่น จำกัด"}
            </h3>
          </div>
        </ScrollCardReveal>

        <div className="max-w-md mx-auto">
          <ScrollCardReveal direction="up" delay={100}>
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 text-left space-y-6 hover:border-orange-400 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold shadow-md uppercase">
                  MS
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{isMounted && detailText.contact_name}</h4>
                  <p className="text-xs text-orange-600 font-semibold">{isMounted && detailText.contact_position}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-700">
                <p>
                  <i className="fa-solid fa-envelope text-orange-500 mr-3 w-4"></i>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${isMounted ? detailText.contact_email : ""}`}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {isMounted && detailText.contact_email}
                  </a>
                </p>
                <p>
                  <i className="fa-solid fa-phone text-orange-500 mr-3 w-4"></i>
                  <strong>Tel:</strong>{" "}
                  <a
                    href={`tel:${isMounted ? detailText.contact_phone : ""}`}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {isMounted && detailText.contact_phone}
                  </a>
                </p>
              </div>
            </div>
          </ScrollCardReveal>
        </div>

        <ScrollCardReveal direction="up" delay={300}>
          <div className="pt-12 text-center">
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