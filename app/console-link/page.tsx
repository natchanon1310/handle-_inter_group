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

export default function ConsoleLinkPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [lang, setLang] = useState<"en" | "th">("en");
  
  // 🎯 สเตตป้องกัน Hydration Error
  const [isMounted, setIsMounted] = useState(false);

  // 🎯 ฟีเจอร์เก็บค่าประวัติหน้าที่เคยเข้ามาดูแล้ว
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
  const detailText = t.consoleLink || {}; 

  const sections = [
    { id: "overview", label: lang === "en" ? "Console Link" : "บริษัท คอนโซล ลิงค์ จำกัด" },
    { id: "capabilities", label: lang === "en" ? "Capabilities" : "ขีดความสามารถ" },
    { id: "truck-fleet", label: lang === "en" ? "Fleet" : "ประเภทรถขนส่ง" },
    { id: "contact-card", label: lang === "en" ? "Contact" : "ติดต่อเรา" },
  ];

  // ข้อมูลสำหรับการ์ดซ้อนทับสไตล์ Minimal (ปรับให้เหมือนกันเป๊ะ)
  const stackItems = useMemo(
    () => [
      {
        id: "s1",
        num: "01",
        tag: "OCEAN LOGISTICS",
        title: detailText.s1_title || "ขนส่งสินค้าทางทะเล",
        desc: detailText.s1_desc || "บริการขนส่งสินค้าทางทะเลทั้งแบบเต็มตู้ (FCL) และไม่เต็มตู้ (LCL) ครอบคลุมท่าเรือหลักทั่วโลก",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>{detailText.s1_sub1 || "บริการขนส่งสินค้าครอบคลุมทุกเส้นทางหลักทั่วโลก"}</span>
          </div>
        ),
      },
      {
        id: "s2",
        num: "02",
        tag: "AIR EXPRESS",
        title: detailText.s2_title || "ขนส่งสินค้าทางอากาศ",
        desc: detailText.s2_desc || "ประสบการณ์การขนส่งสินค้าทางอากาศทั้งขาเข้าและขาออก ไปยังทุกมุมทั่วโลก ทุกเส้นทาง ทุกเวลา ทุกประเภทสินค้า จัดการได้ตามความต้องการแบบรู้จริงทุกเส้นทาง",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>{detailText.s2_sub1 || "บริการขนส่งสินค้าแบบถึงมือผู้รับ Door to door (DDU/ DDP/ FCA/ Ex-work)"}</span>
          </div>
        ),
      },
      {
        id: "s3",
        num: "03",
        tag: "LCL CONSOLIDATION",
        title: detailText.s3_title || "บริการขนส่งแบบไม่เต็มตู้ (LCL)",
        desc: detailText.s3_desc || "ศูนย์รวมการรวบรวมสินค้า LCL ช่วยลดต้นทุนในการขนส่ง เพิ่มความยืดหยุ่นในการจัดการสินค้าขนาดเล็ก",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>บริการจัดตารางเรือและรวบรวมตู้คอนเทนเนอร์ตรงเวลา</span>
          </div>
        ),
      },
      {
        id: "s4",
        num: "04",
        tag: "CUSTOMS COMPLIANCE",
        title: lang === "en" ? "Customs Compliance" : "พิธีการศุลกากร",
        desc: lang === "en" ? "Integrated custom clearance executing seamless border crossings." : "การดูแลพิธีการศุลกากรผ่านแดนอย่างเป็นระบบถูกต้องตามกฎหมาย",
        subContent: (
          <div className="flex items-center text-sm font-bold text-slate-900 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-2.5 text-base" />
            <span>{lang === "en" ? "Total Logistic Quality Standard Support" : "มาตรฐานการบริการที่ลูกค้าไว้วางใจได้สูงสุด"}</span>
          </div>
        ),
      },
    ],
    [detailText, lang]
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
        
        {/* 1. ภาพแบ็คกราวด์เต็มพื้นที่ */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80" 
            alt="Console Link Logistics Background" 
            className="w-full h-full object-cover opacity-80 brightness-95"
          />
          <div className="absolute inset-0 bg-slate-900/60 z-10" />
        </div>

        {/* 2. ข้อความลอยเด่นเหนือภาพพื้นหลัง */}
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4 relative z-20 pt-28 pb-16 w-full">
          <div className="inline-block bg-orange-600 px-4 py-1.5 rounded-full shadow-md mb-1">
            <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">
              {isMounted && detailText.heroSub}
            </span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {(isMounted && subsidiaries[5]?.name) || (isMounted && detailText.heroTitle)}
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
            subtitle="Consolidation & Freight Scope"
            title={detailText.coreTitle}
            items={stackItems}
          />
        )}
      </section>

      {/* SECTION 3: TRUCK FLEET CONFIGURATION */}
      <FlipSection id="truck-fleet" className="bg-gray-50 py-24 border-y border-gray-200 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center w-full">
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block font-mono">{isMounted && detailText.s5_title}</span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">{isMounted && detailText.s5_subTitle}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{isMounted && detailText.s5_desc}</p>
            
            <div className="flex gap-4 pt-2">
              <div className="bg-white px-5 py-3 rounded-xl border border-gray-150 shadow-sm font-black text-slate-800 text-xs"><i className="fa-solid fa-truck-ramp-box text-orange-500 mr-2"></i>{isMounted && detailText.s5_h1}</div>
              <div className="bg-white px-5 py-3 rounded-xl border border-gray-150 shadow-sm font-black text-slate-800 text-xs"><i className="fa-solid fa-truck-ramp-box text-orange-500 mr-2"></i>{isMounted && detailText.s5_h2}</div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-3 text-left">
              <div className="text-2xl text-orange-600"><i className="fa-solid fa-truck-front"></i></div>
              <h4 className="font-extrabold text-sm text-slate-900">{isMounted && detailText.s5_t1}</h4>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-3 text-left">
              <div className="text-2xl text-orange-600"><i className="fa-solid fa-truck"></i></div>
              <h4 className="font-extrabold text-sm text-slate-900">{isMounted && detailText.s5_t2}</h4>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-3 text-left">
              <div className="text-2xl text-orange-600"><i className="fa-solid fa-truck-moving"></i></div>
              <h4 className="font-extrabold text-sm text-slate-900">{isMounted && detailText.s5_t3}</h4>
            </div>
          </div>
        </div>
      </FlipSection>

      {/* SECTION 4: EXCLUSIVE CONTACT INFO */}
      <FlipSection id="contact-card" className="bg-white py-24 flex items-center">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 w-full">
          <div className="inline-block bg-orange-50 border border-orange-100 px-6 py-3 rounded-full text-xs font-bold text-orange-700 font-mono">
            <i className="fa-solid fa-address-card mr-2"></i> {lang === "en" ? "Corporate Communication Directory" : "ข้อมูลติดต่อประสานงานส่วนกลางและฝ่ายการตลาด"}
          </div>
          
          <div className="max-w-md mx-auto bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm text-left space-y-4 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold shadow-md uppercase">
                MN
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">{isMounted && detailText.contact_name}</h4>
                <p className="text-xs text-orange-600 font-semibold">{isMounted && detailText.contact_position}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2 text-xs text-slate-700">
              <p><i className="fa-solid fa-building text-orange-500 mr-2 w-4"></i><strong>Company:</strong> {lang === "en" ? "Console Link Co., Ltd." : "บริษัท คอนโซล ลิงค์ จำกัด"}</p>
              <p><i className="fa-solid fa-envelope text-orange-500 mr-2 w-4"></i><strong>Email:</strong> <a href={`mailto:${isMounted ? detailText.contact_email : ""}`} className="hover:text-orange-600 transition-colors">{isMounted && detailText.contact_email}</a></p>
              <p><i className="fa-solid fa-phone text-orange-500 mr-2 w-4"></i><strong>Tel (Mobile):</strong> {isMounted && detailText.contact_phone}</p>
              <p><i className="fa-solid fa-phone-flip text-orange-500 mr-2 w-4"></i><strong>Office Hotline:</strong> 0-2393-2300 (Auto)</p>
              <p><i className="fa-solid fa-print text-orange-500 mr-2 w-4"></i><strong>Fax:</strong> 0-2393-7307-10</p>
              <p><i className="fa-solid fa-envelope-open text-orange-500 mr-2 w-4"></i><strong>General Mail:</strong> admincenter@handleintergroup.com</p>
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