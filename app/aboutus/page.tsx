"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { dictionary } from "../utils/dictionaries";

// 🎬 Component 3D Tilt Card สำหรับทำให้การ์ดเอียงตามเมาส์
function InteractiveCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y / height) - 0.5) * -10;
    const rotateY = ((x / width) - 0.5) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.2s ease-out" }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [lang, setLang] = useState<"en" | "th">("th");
  const [isMounted, setIsMounted] = useState(false);
  const [activeSubIndex, setActiveSubIndex] = useState(0);

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

  const t = dictionary[lang].about;
  const isTh = lang === "th";

  // รายชื่อทั้ง 7 บริษัทในเครือ
  const detailedSubsidiaries = [
    {
      id: "hit",
      name: isTh ? "บริษัท แฮนเดิล อินเตอร์เนชั่นแนล ทรานสปอร์ต จำกัด" : "Handle International Transport Co., Ltd.",
      shortName: "H.I.T. INTERCON",
      desc: isTh 
        ? "ให้บริการครอบคลุมเกี่ยวกับ Freight Forwarder ทั้งหมด ทั้งการนำเข้า-ส่งออก" 
        : "Covers all Freight Forwarder operations for both import and export logistics.",
      link: "/H-I-T-INTERCON",
      tag: "FREIGHT FORWARDER",
      icon: "🚢",
      img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      features: [
        { icon: "🌍", title: isTh ? "นำเข้า-ส่งออกทั่วโลก" : "Global Import/Export", desc: isTh ? "ครอบคลุมเส้นทางหลักระหว่างประเทศ" : "International shipping routes coverage" },
        { icon: "📦", title: isTh ? "FCL & LCL Container" : "FCL & LCL Services", desc: isTh ? "รองรับการขนส่งทั้งแบบเต็มตู้และไม่เต็มตู้" : "Full and less container load options" },
        { icon: "📄", title: isTh ? "เอกสารศุลกากร" : "Customs Clearance", desc: isTh ? "จัดการพิธีการศุลกากรครบวงจร" : "Full customs documentation handling" },
        { icon: "⏱️", title: isTh ? "ตรงต่อเวลา" : "On-Time Delivery", desc: isTh ? "การันตีการจัดส่งตามกำหนดเวลา" : "Guaranteed punctual cargo arrival" }
      ]
    },
    {
      id: "consolidation",
      name: isTh ? "บริษัท แฮนเดิล อินเตอร์ คอนโซลลิเดชั่น จำกัด" : "Handle Inter Consolidation Co., Ltd.",
      shortName: "INTER CONSOLIDATION",
      desc: isTh 
        ? "ให้บริการทางด้านคอนโซล และขาเข้า มีบริการเปิดตู้รับสินค้าทุกวัน" 
        : "Provides consolidation and inbound services with daily container opening schedules.",
      link: "/HANDLE-INTER-CONSOLIDATION",
      tag: "CONSOLIDATION HUB",
      icon: "🏢",
      img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
      features: [
        { icon: "📅", title: isTh ? "เปิดตู้รับสินค้าทุกวัน" : "Daily Container Unstuffing", desc: isTh ? "บริการรวบรวมและกระจายสินค้าต่อเนื่อง" : "Continuous cargo gathering & unpacking" },
        { icon: "🏭", title: isTh ? "คลังสินค้า LCL Hub" : "LCL Warehouse Hub", desc: isTh ? "พื้นที่คลังสินค้ามาตรฐานระดับสากล" : "World-class standard warehouse facility" },
        { icon: "📉", title: isTh ? "ประหยัดต้นทุน" : "Cost Optimization", desc: isTh ? "ช่วยลดค่าใช้จ่ายการขนส่งสินค้าขนาดเล็ก" : "Reduces shipping fees for SME volumes" },
        { icon: "🔒", title: isTh ? "ความปลอดภัยสูง" : "High Security", desc: isTh ? "ดูแลสินค้าอย่างรัดกุมตลอดการจัดเก็บ" : "Strict cargo tracking & protection" }
      ]
    },
  
    
    {
      id: "express",
      name: isTh ? "บริษัท แฮนเดิล อินเตอร์ เอ็กเพลส จำกัด" : "Handle Inter Express Co., Ltd.",
      shortName: "INTER EXPRESS",
      desc: isTh 
        ? "ให้บริการทางการการเดินพิธีการศุลกากรตลอดจนการจัดส่งสินค้าให้ถึงมือลูกค้า" 
        : "Provides comprehensive customs clearance and express door-to-door delivery.",
      link: "/aboutus",
      tag: "CUSTOMS & EXPRESS",
      icon: "⚡",
      img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      features: [
        { icon: "📑", title: isTh ? "ชิปปิ้งและพิธีการ" : "Customs Clearance", desc: isTh ? "ผ่านด่านศุลกากรรวดเร็วและถูกต้อง" : "Smooth customs border clearance" },
        { icon: "⚡", title: isTh ? "จัดส่งด่วน Express" : "Express Delivery", desc: isTh ? "ส่งสินค้าถึงมือผู้รับอย่างว่องไว" : "Fast door-to-door distribution" },
        { icon: "💡", title: isTh ? "ให้คำปรึกษาพิกัดอากร" : "Tax & Tariff Counsel", desc: isTh ? "วางแผนสิทธิประโยชน์ทางภาษี" : "Tax benefit optimization consulting" },
        { icon: "🤝", title: isTh ? "ดูแลแบบ One-on-One" : "Dedicated Agent", desc: isTh ? "มีผู้เชี่ยวชาญดูแลส่วนตัว" : "Personalized customer support" }
      ]
    },
    {
      id: "consolelink",
      name: isTh ? "บริษัท คอนโซล ลิงค์ จำกัด" : "Console Link Co., Ltd.",
      shortName: "CONSOLE LINK",
      desc: isTh 
        ? "ให้บริการด้านคอนโซล จากเอเชียและยุโรป" 
        : "Provides strategic cargo consolidation routes across Asia and Europe.",
      link: "/CONSOLE-LINK",
      tag: "ASIA & EUROPE CONSOLE",
      icon: "🌐",
      img: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80",
      features: [
        { icon: "🌏", title: isTh ? "เส้นทางเอเชียและยุโรป" : "Asia & Europe Routes", desc: isTh ? "เชื่อมต่อตู้คอนโซลระหว่างทวีป" : "Direct Asian & European console paths" },
        { icon: "🚢", title: isTh ? "ตารางตู้สินค้าคงที่" : "Fixed Consol Frequency", desc: isTh ? "มีตารางตู้สินค้าออกสม่ำเสมอ" : "Guaranteed weekly shipping schedules" },
        { icon: "💻", title: isTh ? "ระบบตู้คอนโซลดิจิทัล" : "Digital Console System", desc: isTh ? "ติดตามตู้รวบรวมสินค้าด้วยเทคโนโลยี" : "Digital tracking for aggregated cargo" },
        { icon: "🏷️", title: isTh ? "อัตราค่าบริการเหมาะสม" : "Competitive Rates", desc: isTh ? "คุ้มค่ามากที่สุดสำหรับผู้ประกอบการ" : "Best value pricing for businesses" }
      ]
    },
    {
      id: "siamliners",
      name: isTh ? "บริษัท สยาม ไลน์เนอร์ จำกัด" : "Siam Liners Co., Ltd.",
      shortName: "SIAM LINERS",
      desc: isTh 
        ? "การร่วมมือกับพันธมิตรต่างประเทศ เพื่อให้บริการขนส่งครบวงจร ทั้งด้านตัวกลางการขนส่งทางเรือ บริการแพ็คสินค้า และการขนถ่ายสินค้า" 
        : "Collaborates with global partners to deliver total ocean transport, packing, and container handling.",
      link: "/SIAM-LINERS",
      tag: "NVOCC LINER",
      icon: "⚓",
      img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
      features: [
        { icon: "⚓", title: isTh ? "ตัวกลางการเดินเรือ NVOCC" : "NVOCC Operations", desc: isTh ? "ตัวแทนขนส่งทางเรือมืออาชีพ" : "Licensed ocean freight intermediary" },
        { icon: "📦", title: isTh ? "บริการแพ็คสินค้า" : "Packing & Re-Packing", desc: isTh ? "แพ็คเกจจิ้งได้มาตรฐานความปลอดภัย" : "Cargo packaging & protective wrapping" },
        { icon: "🏗️", title: isTh ? "ขนถ่ายสินค้า (Stuffing)" : "Stuffing & Unstuffing", desc: isTh ? "บรรจุและขนถ่ายสินค้าออกจากตู้" : "Professional container loading crew" },
        { icon: "🤝", title: isTh ? "เครือข่ายพันธมิตรสากล" : "Global Agency Alliance", desc: isTh ? "ร่วมมือกับสายเรือต่างประเทศ" : "Strong international liner network" }
      ]
    }
  ];

  const currentSub = detailedSubsidiaries[activeSubIndex];

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden text-slate-800 relative">
      
      {/* 🎯 GLOBAL BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[130px]" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      {/* 🎯 SECTION 1: HERO BANNER */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden border-b border-slate-200 z-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80" 
            alt="Global Logistics Background"
            className="w-full h-full object-cover opacity-50 brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 via-slate-50/40 to-transparent z-10" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-5 relative z-20 pt-24 pb-16">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-[0.3em] block font-mono">
            {isMounted && t.sub}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {isMounted && t.title}
          </h1>

          <h2 className="text-lg md:text-2xl font-bold text-sky-300 font-mono tracking-wide">
            {isMounted && (t.history_title || "ประวัติความเป็นมาและการเติบโตขององค์กร")}
          </h2>

          <div className="w-20 h-[3.5px] bg-red-600 mx-auto rounded-full my-3" />
          
          <div className="max-w-3xl mx-auto text-slate-200 text-sm md:text-base leading-relaxed space-y-4 font-normal text-center">
            <p>
              {isTh 
                ? "ก้าวสู่ปีที่ 10 Handle Inter Group ก้าวสู่ความมั่นคงและยั่งยืน ย้ำจุดยืนเป็นผู้ให้บริการขนส่งและโลจิสติกส์ที่มีคุณภาพระดับแถวหน้าของเมืองไทย ด้วยมาตรฐานการบริการระดับสากล ชูทีมเวิร์คที่แข็งแกร่ง-ให้บริการแบบมืออาชีพ พร้อมพัฒนาคุณภาพบริการอย่างไม่หยุดนิ่ง มุ่งสู่ผู้ให้บริการที่ดีที่สุด ด้วยราคาที่เหมาะสมมากที่สุดของไทย"
                : "Stepping into its 10th year, Handle Inter Group achieves stability and sustainability, reinforcing its position as a leading logistics provider in Thailand with international standards, strong teamwork, and professional services."}
            </p>
            <p className="text-slate-300 text-xs md:text-sm italic border-t border-white/10 pt-3">
              {isTh
                ? "Handle Inter Group ตอกย้ำภาพ “การขนส่งและบริการที่ดีที่สุด” และความเป็นผู้นำด้านการขนส่งและโลจิสติกส์ ด้วยจุดยืนคือ การเป็น Total Logistics ผู้ให้บริการโลจิสติกส์แบบครบวงจรมาตรฐานระดับโลก โดยมุ่งเน้นความพึงพอใจของลูกค้าเป็นที่ตั้ง จากก้าวแรกของการก่อตั้งบริษัทเมื่อวันที่ 8 สิงหาคม 2003 และวันนี้ Handle Inter Group ได้ก้าวสู่ปีที่ 10 อย่างมั่นคง"
                : "Handle Inter Group reinforces its image of 'The Best Transport and Service' and leadership in logistics as a world-class Total Logistics provider."}
            </p>
          </div>
        </div>
      </section>

      {/* 🎯 SECTION 2: MILESTONE, HISTORY & MANAGEMENT VISION */}
      <section className="w-full min-h-screen flex flex-col justify-center relative z-10 overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/krhblmkrhb.png" 
            alt="Smart Warehouse Background"
            className="w-full h-full object-cover opacity-65 contrast-[1.08] brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/70 via-slate-50/50 to-slate-50/30 backdrop-blur-[0.5px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            
            <div className="lg:col-span-6 space-y-6 text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex bg-red-50/90 text-red-600 border border-red-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono shadow-sm">
                  {isMounted && (t.m1_tag || "ก่อตั้งเมื่อวันที่ 8 สิงหาคม 2003")}
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-snug tracking-tight drop-shadow-sm">
                  {isTh 
                    ? "ผู้นำด้านโลจิสติกส์ผู้เชี่ยวชาญแบบครบวงจร" 
                    : "Comprehensive Logistics Specialist"}
                </h2>

                <p className="text-slate-800 text-sm leading-relaxed font-normal">
                  {isTh
                    ? "Handle Inter Group กลุ่มบริษัทฯ ที่มีศักยภาพสูงติดอันดับต้นๆ ของเมืองไทยในธุรกิจโลจิสติกส์ ฉายภาพชัดเจนในเรื่องผู้เชี่ยวชาญด้านขนส่งและโลจิสติกส์ จากจุดแข็งของการมีบริษัทในเครือรวม 7 บริษัท ที่สามารถให้บริการครอบคลุมในทุกช่องทางขนส่ง ทั้งทางบก อากาศ และการขนส่งทางน้ำ ส่งให้บริษัทฯ ได้รับการยอมรับและเชื่อมั่นในการเลือกใช้บริการมาโดยตลอด ซึ่งที่ผ่านมาบริษัทฯ มีอัตราการเติบโตอย่างก้าวกระโดด พร้อมทั้งได้ขยายศักยภาพการให้บริการอย่างไม่หยุดยั้ง…"
                    : "Handle Inter Group is a high-potential corporate group ranked among the top logistics providers in Thailand with 7 specialized subsidiaries covering land, air, and sea freight."}
                </p>

                <p className="text-slate-800 text-sm leading-relaxed font-normal">
                  {isTh
                    ? "ตลอดระยะเวลาของการเดินทางอันยาวนานของ Handle Inter Group บริษัทฯ ดำเนินงานบนเส้นทางอย่างมั่นคง เป็นอีกหนึ่งบริษัทฯ ที่มีศักยภาพสูงสุดในธุรกิจโลจิสติกส์แบบครบวงจร สิ่งที่บริษัทให้ความสำคัญและเน้นมาตลอดคือเรื่องบุคลากร โดยมีจุดยืนคือการมีบุคลากรที่มีคุณภาพ-มีมาตรฐานการทำงานเดียวกัน ที่เป็นหัวใจหลักให้บริษัทฯ เติบโตอย่างต่อเนื่อง เป็นไปในทิศทางเดียวกัน ด้วยจุดยืนเดียวกัน พร้อมทั้งมีวัตถุประสงค์ที่สำคัญคือให้บุคลากรเติบโตไปพร้อมกับบริษัท"
                    : "Throughout its journey, Handle Inter Group operates with stability, focusing continuously on human resource excellence as the core foundation for growth."}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-6">
                <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-md">
                  <span className="text-3xl md:text-4xl font-black text-red-600 block">20%+</span>
                  <span className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1 block">
                    {isTh ? "อัตราการเติบโตต่อปี" : "Annual Growth"}
                  </span>
                </div>
                <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-md">
                  <span className="text-3xl md:text-4xl font-black text-sky-600 block">5</span>
                  <span className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1 block">
                    {isTh ? "บริษัทในเครือรองรับทุกช่องทาง" : "Subsidiaries"}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between">
  <InteractiveCard className="h-full">
    <div className="bg-white/95 backdrop-blur-xl text-slate-800 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200/90 flex flex-col justify-between p-6 sm:p-8 md:p-10 h-full relative group">
      <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-red-600 via-sky-500 to-red-600 z-10" />
      
      <div className="space-y-6 text-left">
        {/* 🟢 พื้นที่ใส่รูปภาพ (Image Container) */}
        <div className="w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200/80 shadow-inner">
          <img
            src="/images/IMG_9031-Medium.jpg" 
            alt="คุณสมชาย รุ่งบวรวงศ์ - Managing Director"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
          
          <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
            EXECUTIVE PROFILE
          </span>
        </div>

        {/* ส่วนเนื้อหาและหัวข้อ */}
        <div className="space-y-4">
          <span className="bg-red-50 text-red-600 text-xs font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-widest border border-red-100 inline-block">
            EXECUTIVE VISION & STRATEGY
          </span>

          <h3 className="text-base md:text-lg font-bold text-slate-800 leading-relaxed italic border-l-4 border-red-600 pl-4 py-1">
            {isTh
              ? "“กลยุทธ์หลักที่สร้างความได้เปรียบทางการแข่งขัน คือการมีบริการที่ครบวงจร ลูกค้าสามารถติดต่อมาที่เดียวแต่ได้รับบริการที่ครบถ้วน ตั้งแต่หน้าประตูโรงงานไปจนถึงผู้รับปลายทาง ซึ่งหัวใจสำคัญที่ Handle Inter Group มุ่งเน้นมาโดยตลอด คือการพัฒนาบุคลากรมืออาชีพ สร้างทีมงานและระบบการทำงานที่ดีและมีคุณภาพ และมุ่งมั่นพัฒนาประสิทธิภาพบริการ”"
              : '"The key competitive strategy is total integrated one-stop service, focusing on human resources and professional teamwork."'}
          </h3>

          <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-2">
            {isTh
              ? "“ด้วยเป้าหมายคือการเป็นผู้ให้บริการแบบครบวงจร One Stop service ในทุกด้านที่เกี่ยวข้องกับการขนส่งระหว่างประเทศ เป็น Total logistics ที่มีทุกสิ่งที่ลูกค้าต้องการ เพราะเป้าหมายคือให้ลูกค้านึกถึง Handle Inter Group ในภาพของ การขนส่งและบริการที่ดีที่สุด”"
              : "Our goal is to be the total logistics provider of choice delivering the best service quality."}
          </p>
        </div>
      </div>

      {/* ส่วนท้ายแสดงชื่อผู้บริหาร */}
      <div className="pt-6 mt-6 border-t border-slate-100 text-left flex items-center justify-between">
        <div>
          <p className="font-black text-sm md:text-base text-slate-900">คุณสมชาย รุ่งบวรวงศ์</p>
          <p className="text-xs font-bold text-sky-600 tracking-wider pt-0.5">กรรมการผู้จัดการ Handle Inter Group</p>
        </div>
        <span className="text-2xl">🏆</span>
      </div>
    </div>
  </InteractiveCard>
</div>

          </div>
        </div>
      </section>
      
     {/* 🎯 SECTION 3: INTEGRATED EDITORIAL & FULL CONTENT SUBSIDIARIES */}
      <section className="w-full min-h-screen bg-[#0d0d0d] text-white py-16 lg:py-24 px-6 sm:px-10 lg:px-16 relative z-10 flex items-center justify-center overflow-hidden border-b border-neutral-800">
        
        {/* 🌟 Background Dynamic Glows */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-orange-600/30 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-sky-600/20 rounded-full blur-[150px] pointer-events-none"
        />

        {/* Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px"
          }}
        />

        <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-center relative z-10 space-y-10">
          
          {/* 📍 1. ท่อนบน: หัวข้อและเนื้อหาเต็ม (ครบถ้วน 100% ไม่ตัดแต่ง) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-left max-w-5xl space-y-4"
          >
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300 font-bold">
                {isTh ? "เครือข่ายโลจิสติกส์แบบบูรณาการเบ็ดเสร็จ" : "Total Integrated Logistics Network"}
              </span>
            </div>

            {/* หัวข้อเต็ม */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight text-white">
              {isTh ? "Handle Inter Group คือการขนส่งและบริการที่ดีที่สุด" : "Handle Inter Group: The Best Transport and Service"}
            </h2>

            {/* เนื้อหาย่อหน้าที่ 1 เต็ม */}
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              {isTh
                ? "ตลอดระยะเวลาของการเดินทางอันยาวนานของ Handle Inter Group บริษัทฯ ดำเนินงานบนเส้นทางอย่างมั่นคง เป็นอีกหนึ่งบริษัทฯ ที่มีศักยภาพสูงสุดในธุรกิจโลจิสติกส์แบบครบวงจร สิ่งที่บริษัทให้ความสำคัญและเน้นมาตลอดคือเรื่องบุคลากร โดยมีจุดยืนคือการมีบุคลากรที่มีคุณภาพ-มีมาตรฐานการทำงานเดียวกัน ที่เป็นหัวใจหลักให้บริษัทฯ เติบโตอย่างต่อเนื่อง เป็นไปในทิศทางเดียวกัน ด้วยจุดยืนเดียวกัน พร้อมทั้งมีวัตถุประสงค์ที่สำคัญคือให้บุคลากรเติบโตไปพร้อมกับบริษัท พร้อมก้าวสู่การค้าเสรี ที่จะมีการแข่งขันทางการค้ากันมากขึ้น"
                : "Throughout the long journey of Handle Inter Group, the company has operated stably, standing as one of the highest-potential leaders in total integrated logistics. What we continuously emphasize is our human resources—having high-quality personnel with unified working standards to drive sustainable corporate growth in the same direction, aiming for people to grow alongside the company towards competitive free trade."}
            </p>

            {/* เนื้อหาย่อหน้าที่ 2 เต็ม */}
            <p className="text-neutral-400 text-xs sm:text-sm md:text-base leading-relaxed font-light border-l-2 border-orange-500/80 pl-4 py-1">
              {isTh
                ? "คุณสมชาย กล่าวว่า ที่ผ่านมาบริษัทฯ มีอัตราการเติบโตอย่างก้าวกระโดด โดยมีอัตราการเติบโตปีละไม่น้อยกว่า 20% จากการที่บริษัทได้ขยายศักยภาพการให้บริการอย่างไม่หยุดยั้ง มีการพัฒนาในทุกด้านที่เกี่ยวข้องกับการให้บริการ เพื่อให้ลูกค้าได้รับความพึงพอใจอย่างสูงสุด ซึ่งจุดแข็งของบริษัทฯ เกิดจากการมีรากฐานที่แข็งแกร่งของ 7 บริษัทฯ ในเครือ ทำให้มีบริษัทฯ มีความพร้อมในทุกช่องทางการขนส่ง ทั้งทางน้ำ ทางบก และทางอากาศ ส่งผลให้ Handle Inter Group ได้เปรียบคู่แข่งในเรื่องการให้บริการที่หลากหลาย ทำให้บริษัทยืนหยัดและติดอันดับต้นๆ ของผู้ให้บริการ Freight Forwarder ที่ดีที่สุดในประเทศไทย"
                : "Khun Somchai stated that the company has experienced leapfrog growth of not less than 20% annually by relentlessly expanding service capabilities across all service aspects for maximum customer satisfaction. The strength arises from the solid foundation of 7 specialized subsidiaries across ocean, land, and air transport, giving Handle Inter Group a competitive edge with diversified services as one of the best Freight Forwarders in Thailand."}
            </p>
          </motion.div>

          {/* 📍 2. ท่อนล่าง: รายชื่อ 7 บริษัทในเครือเต็มรูปแบบ + กล่อง Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
            
            {/* ฝั่งซ้าย: เนื้อหารายชื่อทั้ง 7 บริษัทแบบเต็มร้อยข้อความ */}
            <div className="lg:col-span-7 text-left space-y-4">
              
              <p className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">
                {isTh 
                  ? "ทั้งนี้ ปัจจุบันมีบริษัทในเครือรวม 5 บริษัท ที่สามารถให้บริการครอบคลุมในทุกช่องทางขนส่ง ทั้งทางบก อากาศ และการขนส่งทางน้ำ โดยมี:"
                  : "Currently, there are 5 subsidiary companies providing complete coverage across land, air, and ocean transport, including:"}
              </p>
              
              {/* รายการทั้ง 7 บริษัทตามข้อความต้นฉบับเต็ม */}
              <div className="divide-y divide-neutral-800 border-t border-b border-neutral-800 font-sans">
                {detailedSubsidiaries.map((sub, idx) => {
                  const isActive = activeSubIndex === idx;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setActiveSubIndex(idx)}
                      className={`py-3 px-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-start space-x-3 ${
                        isActive 
                          ? "bg-white/10 text-white border-l-4 border-orange-500" 
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold text-orange-400 shrink-0 pt-0.5">
                        {idx + 1}.
                      </span>
                      <div className="text-xs sm:text-sm leading-relaxed">
                        <span className="font-bold text-neutral-100">{sub.name}</span>
                        {" "}
                        <span className="text-neutral-300 font-light">{sub.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* แท็บปุ่มย่อสำหรับเลือกสลับ */}
              <div className="flex flex-wrap gap-2 pt-2">
                {detailedSubsidiaries.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubIndex(idx)}
                    className={`px-3 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      activeSubIndex === idx
                        ? "bg-white text-black font-bold shadow-md"
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800"
                    }`}
                  >
                    0{idx + 1} {sub.shortName}
                  </button>
                ))}
              </div>

            </div>

            {/* ฝั่งขวา: กล่องแสดงผลรูปภาพและลิงก์รายละเอียดของบริษัทที่เลือก */}
            <div className="lg:col-span-5 w-full sticky top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSub.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-neutral-900/90 rounded-[28px] border border-neutral-800 p-6 space-y-5 text-left shadow-2xl backdrop-blur-xl"
                >
                  {/* กรอบรูปภาพ */}
                  <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-neutral-950 relative group">
                    <motion.img
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.7 }}
                      src={currentSub.img}
                      alt={currentSub.name}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/80 backdrop-blur-md text-white font-mono text-[11px] font-bold px-3 py-1 rounded-md border border-neutral-700 flex items-center space-x-1.5">
                        <span>{currentSub.icon}</span>
                        <span>{currentSub.tag}</span>
                      </span>
                    </div>
                  </div>

                  {/* ข้อมูลบริษัทและปุ่มเชื่อมต่อ */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                        {currentSub.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 font-light pt-1.5 leading-relaxed">
                        {currentSub.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800/80 flex justify-between items-center">
                      <span className="text-[11px] font-mono text-neutral-500 font-medium">
                        SUBSIDIARY 0{activeSubIndex + 1} OF 07
                      </span>
                      <Link
                        href={currentSub.link}
                        className="inline-flex items-center space-x-1.5 bg-white text-black hover:bg-orange-500 hover:text-white px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-300 shadow-md hover:scale-105"
                      >
                        <span>Explore Hub</span>
                        <span className="text-sm">↗</span>
                      </Link>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 🎯 SECTION 4: AEC STRATEGY & CUSTOMER VALUE (เนื้อหาครบ 100% เต็มทุกย่อหน้า) */}
      <section className="w-full relative z-10 overflow-hidden bg-white border-y border-slate-200/80">
        
        {/* 📍 บล็อกที่ 1: พัฒนาศักยภาพรับมือเปิดเสรี AEC (ความสูงเต็มหน้าจอ min-h-screen) */}
        <div className="min-h-screen w-full flex items-center justify-center py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* ฝั่งซ้าย: รูปภาพและป๊อปอัพโควตคำพูดผู้บริหาร */}
              <motion.div 
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5"
              >
                <div className="relative rounded-[36px] overflow-hidden shadow-2xl border border-slate-200/90 group">
                  <img 
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80" 
                    alt="AEC Logistics Readiness" 
                    className="w-full h-[460px] sm:h-[540px] md:h-[620px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/25" />
                  
                  {/* Floating Card สไตล์แชตโควตคำพูด */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute inset-x-5 bottom-5 bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/60 text-left space-y-3"
                  >
                    <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        HIG
                      </div>
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900">ASEAN Economic Community (AEC)</h4>
                        <p className="text-[10px] font-mono text-slate-400">Strategic Logistics Preparedness</p>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic font-medium">
                      {isTh 
                        ? "“เชื่อว่าการเตรียมตัวตั้งรับเป็นเรื่องที่สำคัญมากที่สุด หากเราเตรียมตัวดี ย่อมมีความได้เปรียบคู่แข่งรายอื่นอย่างแน่นอน ซึ่ง Handle Inter Group มีความพร้อมในเรื่องนี้ 100%”" 
                        : '"Preparedness is the absolute key to competitive advantage. Handle Inter Group is 100% ready for AEC."'}
                    </p>
                    <p className="text-[10px] font-mono text-right text-slate-400 font-bold">
                      — คุณสมชาย รุ่งบวรวงศ์
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* ฝั่งขวา: ข้อความเต็ม 100% ครบทุกคำ */}
              <motion.div 
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 text-left space-y-5"
              >
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-4 py-1.5 rounded-full inline-block">
                  STRATEGIC PREPARATION
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  พัฒนาศักยภาพรับมือเปิดเสรี AEC
                </h2>

                {/* เนื้อหาเต็มย่อหน้าที่ 1 */}
                <p className="text-slate-700 text-sm md:text-base leading-relaxed font-normal">
                  {isTh
                    ? "จากการที่กลุ่มประเทศอาเซียนได้ประกาศอย่างชัดเจนให้ปี 2015 เป็นปีเป้าหมายในการจัดตั้งประชาคมเศรษฐกิจอาเซียน (ASEAN Economic Community) หรือ AEC และได้กำหนดให้เร่งเปิดเสรีภาคบริการใน 5 สาขาเร่งรัด ได้แก่ สาขาสุขภาพ สาขาคอมพิวเตอร์และโทรคมนาคม สาขาท่องเที่ยว สาขาขนส่งทางอากาศภายในปี 2010 และสาขาโลจิสติกส์ภายในปี 2013 ส่วนสาขาบริการอื่นๆ ให้เปิดตลาดเสรีภายในปี 2015 ตามลำดับ ในเรื่องนี้ คุณสมชาย มองว่า นับเป็นโอกาสของผู้ให้บริการขนส่งและโลจิสติกส์ไทย ที่จะเตรียมตัววางกลยุทธ์รับมือผู้ให้บริการจากต่างชาติที่จะขยายฐานเข้ามาในประเทศไทย และเป็นจังหวะที่ดีที่ผู้ให้บริการไทยจะขยายฐานเปิดให้บริการยังประเทศอาเซียนได้"
                    : "As the ASEAN nations announced 2015 as the target year for establishing the ASEAN Economic Community (AEC) and expedited service liberalization in 5 priority sectors—including air transport by 2010 and logistics by 2013—Khun Somchai views this as a vital strategic opportunity for Thai logistics providers to prepare for incoming international competition and expand outwards into ASEAN markets."}
                </p>

                {/* เนื้อหาเต็มย่อหน้าที่ 2 (คำกล่าวสปีชเต็ม) */}
                <div className="bg-slate-50 border-l-4 border-red-600 p-4 sm:p-5 rounded-r-2xl space-y-2">
                  <p className="text-slate-800 text-xs sm:text-sm md:text-base leading-relaxed italic font-medium">
                    {isTh
                      ? "“การเปิดเสรีทางการค้า จะทำให้ตลาดเปิดกว้างมากขึ้น การแข่งขันจะสูงมากขึ้น ซึ่งเมื่อการแข่งขันสูงขึ้น ความต้องการใช้บริการก็จะสูงขึ้นเช่นเดียวกัน ทำอย่างไรที่เราจะมีความพร้อมรับมือการแข่งขันที่จะทวีความรุนแรงมากขึ้น เชื่อว่าการเตรียมตัวตั้งรับเป็นเรื่องที่สำคัญมากที่สุด หากเราเตรียมตัวดี ย่อมมีความได้เปรียบคู่แข่งรายอื่นอย่างแน่นอน ซึ่ง Handle Inter Group มีความพร้อมในเรื่องนี้ 100% จากการมีบุคลากรที่มีคุณภาพ การมีพันธมิตรต่างประเทศที่มีคุณภาพ ทำงานร่วมกันมานานกว่า 10 ปี ที่เป็นส่วนเสริมให้บริษัทฯ มีความแข็งแกร่ง นอกจากนี้ สิ่งที่บริษัทฯ ยึดมั่นมาโดยตลอด คือการทำงานร่วมกันกับลูกค้า ทำให้ลูกค้าได้รับประโยชน์สูงสุด สามารถลดต้นทุนและแข่งขันกับคู่แข่งรายอื่นได้” คุณสมชาย กล่าว"
                      : '"Trade liberalization expands the market and heightens competition, which also surges demand. Being prepared is the key to gaining advantage over competitors. Handle Inter Group is 100% ready thanks to our high-quality talent, 10+ years of trusted international partnerships, and our commitment to working alongside clients to optimize costs and maximize competitive edge." said Khun Somchai.'}
                  </p>
                </div>

                {/* เนื้อหาเต็มย่อหน้าที่ 3 */}
                <p className="text-slate-700 text-sm md:text-base leading-relaxed font-normal">
                  {isTh
                    ? "Handle Inter Group เป็นกลุ่มบริษัทที่ให้บริการครบวงจร โดยมีแผนการดำเนินงานเชิงรุก คือเร่งเสริมความแข็งแกร่งด้านการตลาด เพื่อรองรับการแข่งขันที่สูงขึ้น นอกจากนี้ยังให้ความสำคัญกับการขยายไลน์ธุรกิจให้ครอบคลุมทุกบริการด้านโลจิสติกส์ เพื่อให้สามารถตอบสนองความต้องการที่หลากหลายของลูกค้าได้เป็นอย่างดี จากการบริการที่เป็นเลิศ ผนวกกับการมีบริษัทในเครือที่มีความเข้มแข็ง ที่สามารถให้บริการที่ครอบคลุมทุกเส้นทางการขนส่ง ทำให้บริษัทมีความได้เปรียบคู่แข่งรายอื่น ส่งผลให้ลูกค้าเลือกใช้บริการอย่างต่อเนื่อง มั่นใจว่าบริษัทฯ มีความพร้อมเต็มที่ในการรับมือการเปิดเสรีทางการค้า AEC"
                    : "Handle Inter Group operates comprehensively with proactive marketing strategies to absorb heightened market competition while expanding service lines to cover every logistics facet. Supported by strong specialized subsidiaries covering all transport routes, clients continuously choose our excellence, trusting our complete readiness for AEC trade liberalization."}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById("highlight-block");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center space-x-3 bg-orange-600 hover:bg-orange-500 text-white text-xs md:text-sm font-extrabold uppercase font-mono px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-600/30 hover:scale-105 cursor-pointer active:scale-95"
                  >
                    <span>อ่านวิสัยทัศน์พันธมิตรธุรกิจ ↗</span>
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* 📍 บล็อกที่ 2: ลูกค้าคือพันธมิตรทางธุรกิจสำคัญที่สุด (เนื้อหาเต็ม 100% สไตล์ Minimalist Slate / Off-White) */}
        <div id="highlight-block" className="min-h-screen w-full bg-slate-50/90 text-slate-900 py-20 md:py-28 flex items-center justify-center transition-all relative overflow-hidden border-t border-slate-200/80">
          
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* ฝั่งซ้าย: ข้อความเต็มย่อหน้าสุดท้าย */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 text-left space-y-6"
              >
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full inline-block">
                  CUSTOMER-CENTRIC VALUE
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-[1.1]">
                  ลูกค้าคือพันธมิตร<br />ทางธุรกิจที่สำคัญที่สุด
                </h2>

                {/* ข้อความเต็มย่อหน้าของลูกค้าคือพันธมิตรสำคัญที่สุด */}
                <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                  {isTh
                    ? "คุณสมชาย กล่าวว่า Handle Inter Group มองว่าลูกค้าคือพันธมิตรทางธุรกิจที่สำคัญที่สุด จึงเร่งสร้างมาตรฐานชั้นเลิศในด้านการบริการแบบ One Stop service และพร้อมทุ่มเทเพื่อบริการที่เหนือความคาดหวังของลูกค้า พร้อมสานต่อแนวคิดลดต้นทุน เพิ่มประสิทธิภาพ ประหยัดเวลา และอำนวยความสะดวก ให้ลูกค้าได้รับประโยชน์และสะดวกสบายมากที่สุด วันนี้ Handle Inter Group พร้อมก้าวสู่ปีที่ 10 อย่างมั่นคง จากฐานรากที่แข็งแกร่งของบริษัท รวมทั้งความมั่นคง ความมีเครดิตทางการเงิน ที่จะสร้างความมั่นใจในการเลือกใช้บริการของลูกค้า ซึ่งลูกค้าสามารถมั่นใจได้ว่าสินค้าของลูกค้าจะถึงมือผู้รับอย่างแน่นอน"
                    : "Khun Somchai stated that Handle Inter Group views customers as the most vital business partners. We accelerate first-class standards in One Stop Service, dedicate ourselves to exceeding expectations, and sustain the core concept of reducing costs, enhancing efficiency, saving time, and delivering ultimate convenience. Stepping into our 10th year with solid foundations and financial credibility, clients can rest completely assured that their cargo will arrive safely in the recipient's hands."}
                </p>

                <div className="pt-3">
                  <motion.div 
                    whileHover={{ scale: 1.04 }}
                    className="inline-flex items-center space-x-3 bg-slate-900 text-white font-mono text-xs md:text-sm font-bold px-7 py-3.5 rounded-full shadow-xl border border-slate-800"
                  >
                    <span>✓ การขนส่งและบริการที่ดีที่สุด (The Best Transport & Service)</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* ฝั่งขวา: รูปภาพขอบมนพร้อมอนิเมชัน */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5"
              >
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-white group">
                  <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
                    alt="Customer Service Excellence" 
                    className="w-full h-[420px] sm:h-[480px] md:h-[520px] object-cover transition-transform duration-1000 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-slate-950/10" />
                </div>
              </motion.div>

            </div>
          </div>
        </div>

      </section>

      
      
     {/* 🎯 SECTION 5: PURE LOGO TIMELINE (ไม่มีข้อความ + ขยายขนาดโลโก้ใหญ่พิเศษ) */}
      <section className="w-full bg-slate-50 py-32 md:py-48 px-6 sm:px-12 lg:px-20 relative z-10 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto w-full space-y-24 md:space-y-32">
          
          {/* 📍 หัวข้อด้านบนสุดของ Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-5 pb-8"
          >
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider inline-block shadow-sm">
              Timeline Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
              {isTh ? "เส้นทางประวัติศาสตร์และความสำเร็จ" : "Historical Milestones & Growth"}
            </h2>
            <p className="text-slate-500 font-mono text-xs sm:text-sm uppercase tracking-widest pt-1">
              2003 — 2013+ & BEYOND
            </p>
          </motion.div>

          {/* 📍 พื้นที่แกนกลางไทม์ไลน์ */}
          <div className="relative pt-12 pb-20">
            
            {/* เส้นแกนกลางแนวตั้งสีเขียว */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-emerald-500 via-emerald-500 to-emerald-400 rounded-full z-0 shadow-[0_0_12px_rgba(16,185,129,0.35)]" />

            {/* รายการโหนดปีและโลโก้สลับซ้าย-ขวา */}
            <div className="space-y-36 sm:space-y-48 lg:space-y-56 relative z-10">
              
              {/* 🟢 โหนดที่ 1: 2003 (Handle Inter Group) -> [ซ้าย: โลโก้ใหญ่] */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-between"
              >
                {/* ฝั่งซ้าย: โลโก้ขนาดใหญ่ */}
                <div className="w-[44%] text-right pr-6 sm:pr-10">
                  <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img 
                      src="/images/j6592 (1).gif" 
                      alt="Handle Inter Group Logo" 
                      className="h-20 sm:h-28 md:h-32 w-auto object-contain ml-auto"
                    />
                  </div>
                </div>

                {/* จุดกึ่งกลาง: วงกลมปี 2003 */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white border-[4px] border-emerald-500 flex items-center justify-center font-mono font-black text-xs sm:text-base text-emerald-700 shadow-xl shrink-0 z-10 animate-pulse">
                  2003
                </div>

                {/* ฝั่งขวา: เว้นว่างรักษาสมดุล */}
                <div className="w-[44%]" />
              </motion.div>

              {/* 🟢 โหนดที่ 2: 2003 (H.I.T. Intercon) -> [ขวา: โลโก้ใหญ่] */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-between"
              >
                {/* ฝั่งซ้าย: เว้นว่างรักษาสมดุล */}
                <div className="w-[44%]" />

                {/* จุดกึ่งกลาง: วงกลมปี 2003 */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white border-[4px] border-emerald-500 flex items-center justify-center font-mono font-black text-xs sm:text-base text-emerald-700 shadow-xl shrink-0 z-10">
                  2003
                </div>

                {/* ฝั่งขวา: โลโก้ขนาดใหญ่ */}
                <div className="w-[44%] text-left pl-6 sm:pl-10">
                  <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img 
                      src="/images/1725e41.png" 
                      alt="H.I.T. Intercon Logo" 
                      className="h-20 sm:h-28 md:h-32 w-auto object-contain mr-auto"
                    />
                  </div>
                </div>
              </motion.div>

              {/* 🟢 โหนดที่ 3: 2005 (Handle Inter Consolidation) -> [ซ้าย: โลโก้ใหญ่] */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-between"
              >
                {/* ฝั่งซ้าย: โลโก้ขนาดใหญ่ */}
                <div className="w-[44%] text-right pr-6 sm:pr-10">
                  <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img 
                      src="/images/handle inter con.png" 
                      alt="Handle Inter Consolidation Logo" 
                      className="h-20 sm:h-28 md:h-32 w-auto object-contain ml-auto"
                    />
                  </div>
                </div>

                {/* จุดกึ่งกลาง: วงกลมปี 2005 */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white border-[4px] border-emerald-500 flex items-center justify-center font-mono font-black text-xs sm:text-base text-emerald-700 shadow-xl shrink-0 z-10">
                  2005
                </div>

                {/* ฝั่งขวา: เว้นว่างรักษาสมดุล */}
                <div className="w-[44%]" />
              </motion.div>

              {/* 🟢 โหนดที่ 4: 2006 (Consol Link) -> [ขวา: โลโก้ใหญ่] */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-between"
              >
                {/* ฝั่งซ้าย: เว้นว่างรักษาสมดุล */}
                <div className="w-[44%]" />

                {/* จุดกึ่งกลาง: วงกลมปี 2006 */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white border-[4px] border-emerald-500 flex items-center justify-center font-mono font-black text-xs sm:text-base text-emerald-700 shadow-xl shrink-0 z-10">
                  2006
                </div>

                {/* ฝั่งขวา: โลโก้ขนาดใหญ่ */}
                <div className="w-[44%] text-left pl-6 sm:pl-10">
                  <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img 
                      src="/images/consol-link.png" 
                      alt="Consol Link Logo" 
                      className="h-20 sm:h-28 md:h-32 w-auto object-contain mr-auto"
                    />
                  </div>
                </div>
              </motion.div>

              {/* 🟢 โหนดที่ 5: 2007 (PKT Logistics) -> [ซ้าย: โลโก้ใหญ่] */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-between"
              >
                {/* ฝั่งซ้าย: โลโก้ขนาดใหญ่ */}
                <div className="w-[44%] text-right pr-6 sm:pr-10">
                  <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img 
                      src="/images/pkt.png" 
                      alt="PKT Logistics Logo" 
                      className="h-20 sm:h-28 md:h-32 w-auto object-contain ml-auto"
                    />
                  </div>
                </div>

                {/* จุดกึ่งกลาง: วงกลมปี 2007 */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white border-[4px] border-emerald-500 flex items-center justify-center font-mono font-black text-xs sm:text-base text-emerald-700 shadow-xl shrink-0 z-10">
                  2007
                </div>

                {/* ฝั่งขวา: เว้นว่างรักษาสมดุล */}
                <div className="w-[44%]" />
              </motion.div>

              {/* 🟢 โหนดที่ 6: 2008 (Siam Liner) -> [ขวา: โลโก้ใหญ่] */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-between"
              >
                {/* ฝั่งซ้าย: เว้นว่างรักษาสมดุล */}
                <div className="w-[44%]" />

                {/* จุดกึ่งกลาง: วงกลมปี 2008 */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white border-[4px] border-emerald-500 flex items-center justify-center font-mono font-black text-xs sm:text-base text-emerald-700 shadow-xl shrink-0 z-10">
                  2008
                </div>

                {/* ฝั่งขวา: โลโก้ขนาดใหญ่ */}
                <div className="w-[44%] text-left pl-6 sm:pl-10">
                  <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img 
                      src="/images/siam liner.png" 
                      alt="Siam Liner Logo" 
                      className="h-20 sm:h-28 md:h-32 w-auto object-contain mr-auto"
                    />
                  </div>
                </div>
              </motion.div>

              {/* 🟢 โหนดที่ 7: 2013 (Siam Warehousing) -> [ซ้าย: โลโก้ใหญ่] */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-between pb-8"
              >
                {/* ฝั่งซ้าย: โลโก้ขนาดใหญ่ */}
                <div className="w-[44%] text-right pr-6 sm:pr-10">
                  <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img 
                      src="/images/siamwarehouse.jpeg" 
                      alt="Siam Warehousing Logo" 
                      className="h-20 sm:h-28 md:h-32 w-auto object-contain ml-auto"
                    />
                  </div>
                </div>

                {/* จุดกึ่งกลาง: วงกลมปี 2013 */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white border-[4px] border-emerald-500 flex items-center justify-center font-mono font-black text-xs sm:text-base text-emerald-700 shadow-xl shrink-0 z-10 animate-bounce">
                  2013
                </div>

                {/* ฝั่งขวา: เว้นว่างรักษาสมดุล */}
                <div className="w-[44%]" />
              </motion.div>

            </div>
          </div>

          {/* 📍 ส่วนท้ายไทม์ไลน์ */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-16 border-t border-slate-200 text-center"
          >
            <span className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-widest font-bold">
              Continuous Innovation & Sustainable Logistics Network
            </span>
          </motion.div>

        </div>
      </section>

    </div>
  );
}