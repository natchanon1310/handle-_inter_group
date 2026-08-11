"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

// 🎯 Component การ์ด Core Value สไตล์ Clean Minimal Story Card
function CleanStoryCoreCard({
  index,
  tag,
  title,
  desc,
  date,
  imgSrc,
  isBig = false
}: {
  index: number;
  tag: string;
  title: string;
  desc: string;
  date: string;
  imgSrc: string;
  isBig?: boolean;
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const getDispersedTransform = (idx: number) => {
    const offsets = [
      "translateX(-100px) translateY(-60px) rotate(-10deg) scale(0.7)",
      "translateX(100px) translateY(-60px) rotate(10deg) scale(0.7)",
      "translateX(-110px) translateY(80px) rotate(-8deg) scale(0.75)",
      "translateX(0px) translateY(120px) rotate(5deg) scale(0.7)",
      "translateX(110px) translateY(80px) rotate(12deg) scale(0.75)"
    ];
    return offsets[idx % offsets.length];
  };

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: `${index * 0.1}s`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0) translateY(0) rotate(0deg) scale(1)" : getDispersedTransform(index),
      }}
      className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu h-full"
    >
      <InteractiveCard className="h-full">
        <div className={`bg-white rounded-[32px] border border-slate-100/80 shadow-xl shadow-slate-200/50 p-8 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-slate-300 group cursor-pointer text-left hover:scale-[1.02] ${
          isBig ? "min-h-[380px]" : "min-h-[340px]"
        }`}>
          
          <div className="space-y-6">
            {/* 1. รูปภาพตรงกลางสไตล์ Clean Illustration/Photo */}
            <div className="w-full flex justify-center items-center py-2 relative">
              <div className={`overflow-hidden transition-transform duration-500 group-hover:scale-110 ${
                isBig ? "h-48 md:h-56" : "h-36 md:h-40"
              }`}>
                <img 
                  src={imgSrc} 
                  alt={title} 
                  className="w-auto h-full object-contain mx-auto filter drop-shadow-md"
                />
              </div>
            </div>

            {/* 2. Tag & Title */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                {tag}
              </span>
              <h3 className={`font-black text-slate-900 tracking-tight leading-snug group-hover:text-sky-600 transition-colors ${
                isBig ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
              }`}>
                {title}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-normal line-clamp-2">
                {desc}
              </p>
            </div>
          </div>

          {/* 3. Footer Date & Arrow Indicator */}
          <div className="pt-6 mt-4 border-t border-slate-50 flex justify-between items-center text-xs font-medium text-slate-400 font-mono">
            <span>{date}</span>
            <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors text-xs font-bold shadow-sm">
              ↗
            </span>
          </div>

        </div>
      </InteractiveCard>
    </div>
  );
}

// 🎯 Component การ์ดบริษัทย่อย สไตล์ Magazine/Blog
function MagazineSubsidiaryCard({ 
  index, 
  name, 
  desc, 
  link, 
  tag, 
  tagBg, 
  imgSrc 
}: { 
  index: number; 
  name: string; 
  desc: string; 
  link: string; 
  tag: string; 
  tagBg: string; 
  imgSrc: string;
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const getDispersedTransform = (idx: number) => {
    const offsets = [
      "translateX(-120px) translateY(-80px) rotate(-12deg) scale(0.7)",
      "translateX(0px) translateY(-140px) rotate(8deg) scale(0.65)",
      "translateX(120px) translateY(-80px) rotate(14deg) scale(0.7)",
      "translateX(-140px) translateY(100px) rotate(-10deg) scale(0.65)",
      "translateX(0px) translateY(140px) rotate(-6deg) scale(0.7)",
      "translateX(140px) translateY(100px) rotate(12deg) scale(0.65)",
      "translateX(0px) translateY(160px) rotate(15deg) scale(0.6)"
    ];
    return offsets[idx % offsets.length];
  };

  return (
    <Link href={link} className="block h-full">
      <div
        ref={cardRef}
        style={{
          transitionDelay: `${index * 0.12}s`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0) translateY(0) rotate(0deg) scale(1)" : getDispersedTransform(index),
        }}
        className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu h-full"
      >
        <InteractiveCard className="h-full">
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-lg shadow-slate-200/40 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-orange-400 group cursor-pointer overflow-hidden relative hover:scale-[1.03]">
            
            <div className="space-y-4">
              {index % 2 === 1 && (
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img 
                    src={imgSrc} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                </div>
              )}

              <div>
                <span className={`inline-block text-[10px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-md font-mono ${tagBg}`}>
                  {tag}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
                {name}
              </h3>

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-normal line-clamp-3">
                {desc}
              </p>

              {index % 2 === 0 && (
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 relative mt-3">
                  <img 
                    src={imgSrc} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              <span>HANDLE INTER GROUP</span>
              <span className="text-orange-500 group-hover:translate-x-1 transition-transform">EXPLORE ↗</span>
            </div>

          </div>
        </InteractiveCard>
      </div>
    </Link>
  );
}

export default function AboutPage() {
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);

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
  const subsidiaries = dictionary[lang].subsidiaries;

  const subsidiaryPaths = [
    "/H-I-T-INTERCON",
    "/HANDLE-INTER-LOGISTICS",
    "/HANDLE-INTER-CONSOLIDATION",
    "/HANDLE-INTER-FREIGHT-LOGISTICS",
    "/HANDLE-INTER-SERVICE",
    "/CONSOLE-LINK",
    "/SIAM-LINERS"
  ];

  const magazineCardMeta = [
    { tag: "OCEAN & AIR", tagBg: "bg-pink-600", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80" },
    { tag: "LOGISTICS", tagBg: "bg-emerald-600", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" },
    { tag: "CONSOLIDATION", tagBg: "bg-amber-600", img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80" },
    { tag: "FREIGHT", tagBg: "bg-sky-600", img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80" },
    { tag: "SERVICE HUB", tagBg: "bg-purple-600", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" },
    { tag: "DIGITAL TRADE", tagBg: "bg-indigo-600", img: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80" },
    { tag: "NVOCC LINER", tagBg: "bg-orange-600", img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" }
  ];

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

      {/* 🎯 1. HERO BANNER */}
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

        <div className="max-w-5xl mx-auto px-6 text-center space-y-4 relative z-20 pt-20 pb-16">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-[0.3em] block font-mono">
            {isMounted && t.sub}
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {isMounted && t.title}
          </h1>

          <div className="w-16 h-[3.5px] bg-red-600 mx-auto rounded-full mt-2" />
          
          <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-base leading-relaxed pt-2 font-medium">
            {isMounted && t.desc}
          </p>
        </div>
      </section>

      {/* 🎯 2. MILESTONE & VISION BENTO CARD */}
      <section className="w-full min-h-screen flex flex-col justify-center relative z-10 overflow-hidden py-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/krhblmkrhb.png" 
            alt="Smart Warehouse Background"
            className="w-full h-full object-cover opacity-65 contrast-[1.08] brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/70 via-slate-50/50 to-slate-50/30 backdrop-blur-[0.5px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex bg-red-50/90 text-red-600 border border-red-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono shadow-sm">
                {isMounted && t.m1_tag}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-snug tracking-tight drop-shadow-sm">
                {isMounted && t.m1_title}
              </h2>

              <p className="text-slate-800 text-sm leading-relaxed font-medium">{isMounted && t.m1_p1}</p>
              <p className="text-slate-800 text-sm leading-relaxed font-medium">{isMounted && t.m1_p2}</p>
              
              <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-6">
                <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-md">
                  <span className="text-3xl md:text-4xl font-black text-red-600 block">20%+</span>
                  <span className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1 block">{isMounted && t.growth}</span>
                </div>
                <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-md">
                  <span className="text-3xl md:text-4xl font-black text-sky-600 block">7</span>
                  <span className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1 block">{isMounted && t.sub_count}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <InteractiveCard>
                <div className="bg-white/95 backdrop-blur-xl text-slate-800 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200/90 grid grid-cols-1 sm:grid-cols-12 items-stretch group relative">
                  <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-red-600 via-sky-500 to-red-600" />
                  
                  <div className="sm:col-span-5 relative min-h-[260px] sm:min-h-full overflow-hidden bg-slate-950">
                    <img 
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" 
                      alt="Corporate Supply Chain"
                      className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        EXECUTIVE VISION
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-7 p-8 md:p-10 flex flex-col justify-between text-left space-y-6">
                    <div className="space-y-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block">{isMounted && t.v_tag}</span>
                      <h3 className="text-base md:text-lg font-bold text-slate-800 leading-relaxed italic">
                        "{isMounted && t.v_quote}"
                      </h3>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <p className="font-black text-sm text-slate-900">{isMounted && t.v_author}</p>
                      <p className="text-xs font-bold text-sky-600 tracking-wider pt-0.5">{isMounted && t.v_pos}</p>
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </div>

          </div>
        </div>
      </section>

      {/* 🎯 3. CORE VALUE UNITS */}
      <section className="w-full min-h-screen flex flex-col justify-center bg-slate-100/60 backdrop-blur-md py-16 border-y border-slate-200/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono font-bold text-sky-600 uppercase tracking-widest">OUR FOUNDATION</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Core Values & Standards
            </h2>
          </div>

          <div className="space-y-8">
            {/* แถวที่ 1: การ์ดใหญ่ 2 ใบ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <CleanStoryCoreCard
                index={0}
                tag="HUMAN RESOURCES"
                title={isMounted ? t.hr_t : "มุ่งเน้นพัฒนาทรัพยากรบุคคล"}
                desc={isMounted ? t.hr_d : "ทรัพยากรบุคคลคือหัวใจหลักที่เราโฟกัสและพัฒนาอย่างต่อเนื่อง"}
                date="July 18, 2026"
                imgSrc="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                isBig={true}
              />

              <CleanStoryCoreCard
                index={1}
                tag="EXCELLENCE & QUALITY"
                title={isMounted ? t.ef_t : "ประสิทธิภาพและคุณภาพ"}
                desc={isMounted ? t.ef_d : "ยกระดับประสิทธิภาพและคุณภาพอย่างต่อเนื่อง การให้บริการแบบ One Stop Service"}
                date="July 20, 2026"
                imgSrc="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                isBig={true}
              />
            </div>

            {/* แถวที่ 2: การ์ดกะทัดรัด 3 ใบ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              <CleanStoryCoreCard
                index={2}
                tag="PARTNERSHIP"
                title={isMounted ? t.bp_t : "แนวคิดพันธมิตรทางธุรกิจ"}
                desc={isMounted ? t.bp_d : "ลูกค้าคือพันธมิตรทางธุรกิจที่สำคัญ เรามอบมาตรฐานที่ยอดเยี่ยม"}
                date="July 22, 2026"
                imgSrc="https://cdn-icons-png.flaticon.com/512/3062/3062322.png"
              />

              <CleanStoryCoreCard
                index={3}
                tag="GLOBAL NETWORK"
                title={lang === "en" ? "Global Network Security" : "เครือข่ายความปลอดภัยสากล"}
                desc={lang === "en" ? "Seamless connectivity across international trade paths." : "โครงสร้างเครือข่ายครอบคลุม ดูแลความปลอดภัยอย่างใกล้ชิด"}
                date="July 24, 2026"
                imgSrc="https://cdn-icons-png.flaticon.com/512/2906/2906206.png"
              />

              <CleanStoryCoreCard
                index={4}
                tag="FUTURE INTEGRATION"
                title={lang === "en" ? "Smart Supply Chain" : "ห่วงโซ่อุปทานอัจฉริยะ"}
                desc={lang === "en" ? "Integrating advanced technology for maximum operational efficiency." : "ผสานเทคโนโลยีสมัยใหม่เพื่อประสิทธิภาพสูงสุดในทุกเส้นทาง"}
                date="July 26, 2026"
                imgSrc="https://cdn-icons-png.flaticon.com/512/2885/2885417.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 4. SUBSIDIARIES */}
      <section className="w-full min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest block">
            {isMounted && t.sub_sub}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">
            {isMounted && t.sub_title}
          </h2>
          <p className="text-slate-500 text-xs font-medium pt-1">
            {isMounted && t.sub_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left items-stretch">
          {isMounted && subsidiaries.map((sub, index) => {
            const meta = magazineCardMeta[index % magazineCardMeta.length];
            const targetLink = subsidiaryPaths[index] || "/aboutus";

            return (
              <MagazineSubsidiaryCard
                key={index}
                index={index}
                name={sub.name}
                desc={sub.desc}
                link={targetLink}
                tag={meta.tag}
                tagBg={meta.tagBg}
                imgSrc={meta.img}
              />
            );
          })}
        </div>
      </section>

      {/* 🎯 5. FUTURE VISION */}
      <section className="bg-slate-950 text-white pt-24 pb-12 text-center relative overflow-hidden z-10 border-t border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80" 
            alt="Global Network Backdrop"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950" />
        </div>

        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">
            {isMounted && t.aec_tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            {isMounted && t.aec_title}
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light">
            {isMounted && t.aec_desc}
          </p>
          <div className="pt-6">
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl text-xs font-bold text-sky-300 shadow-2xl">
              "{isMounted && t.aec_foot}"
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

