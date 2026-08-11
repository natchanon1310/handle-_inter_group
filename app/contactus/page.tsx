"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { dictionary } from "../utils/dictionaries";

// 🎬 Component จัดการเอฟเฟกต์เลื่อนขึ้นแบบนุ่มนวล (Smooth Fade & Rise - No Scale/Shake)
function MagnificSection({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const riseStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 800ms ease-out, transform 800ms ease-out"
  };

  return (
    <div 
      id={id} 
      ref={sectionRef} 
      style={isMounted ? riseStyle : { opacity: 0 }} 
      className={className || ""}
    >
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isMounted, setIsMounted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const t = dictionary[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="relative overflow-x-hidden bg-slate-50 text-slate-800 min-h-screen">

      {/* 🎯 SECTION 1: HERO TITLES */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center bg-slate-950 overflow-hidden border-b border-slate-200/80 z-10">
        
        {/* แบ็คกราวด์ภาพถ่ายและแสงฟุ้งของ Hero */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80" 
            alt="Global Network Contact Background" 
            className="w-full h-full object-cover opacity-40 brightness-[0.6] contrast-[1.1]"
          />
          {/* ฟิลเตอร์เงา Gradient ซ้อนทับ */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/90 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.15),transparent_60%)] z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 via-slate-50/40 to-transparent z-10" />
        </div>

        {/* เนื้อหาข้อความ Hero */}
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 text-center relative z-20 space-y-4">
          <MagnificSection id="contact-hero" className="space-y-4">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-[0.3em] block font-mono drop-shadow">
              {lang === "en" ? "Global Connectivity" : "เครือข่ายโลจิสติกส์ระดับโลก"}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none drop-shadow-lg">
              {isMounted && t.contact.title}
            </h1>
            {/* เส้นคั่นสีแดงตามโลโก้ */}
            <div className="w-16 h-[3.5px] bg-red-600 mx-auto mt-4 rounded-full shadow-md" />
            <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-base font-medium pt-2 leading-relaxed drop-shadow">
              {lang === "en" 
                ? "Have a shipment query or need strategic logistics planning? Connect with our corporate matrix offices instantly." 
                : "ต้องการติดต่อสอบถามข้อมูลการขนส่ง วางแผนระบบโลจิสติกส์ หรือขอรับคำปรึกษาจากทีมผู้เชี่ยวชาญ"}
            </p>
          </MagnificSection>
        </div>
      </section>


      {/* 🎯 SECTION 2: OFFICE MATRIX & FORM */}
      <section className="relative py-20 z-10">
        
        {/* ฉากหลังตารางมินิมอล + Soft Gradient Orbs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 right-1/4 w-[550px] h-[500px] bg-sky-200/50 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-[150px]" />
          
          {/* ลายตาราง Dot Grid */}
          <div 
            className="absolute inset-0 opacity-[0.035]" 
            style={{
              backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
              backgroundSize: "28px 24px"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT SIDE: HEADQUARTERS CARD */}
            <MagnificSection id="office-details" className="lg:col-span-5 space-y-6">
              <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 p-8 rounded-3xl shadow-xl shadow-slate-200/50 relative overflow-hidden group transition-colors duration-300 hover:border-sky-300">
                {/* เส้นเรืองแสงไล่เฉดสี แดง-ฟ้า วิ่งด้านบนการ์ด */}
                <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-red-600 via-sky-500 to-red-600 opacity-80" />
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-3 bg-red-600 rounded-sm" />
                    <h2 className="text-xl font-black text-slate-900 tracking-wide uppercase">
                      {lang === "en" ? "Headquarters Matrix" : "สำนักงานใหญ่"}
                    </h2>
                  </div>

                  <div className="space-y-5 text-sm">
                    {/* ที่ตั้งสำนักงานใหญ่ */}
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-md">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">{lang === "en" ? "Corporate Address" : "ที่อยู่สำนักงาน"}</h4>
                        <p className="text-slate-700 font-bold leading-relaxed">
                          {isMounted && t.footer.locDetail}
                        </p>
                      </div>
                    </div>

                    {/* เบอร์โทรศัพท์ */}
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-md">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">{lang === "en" ? "Telephone (Auto Hotline)" : "เบอร์โทรศัพท์"}</h4>
                        <p className="text-slate-900 font-black tracking-wide text-base">
                          <a href="tel:023932300" className="hover:text-sky-600 transition-colors">0-2393-2300 ({lang === "en" ? "Auto" : "อัตโนมัติ"})</a>
                        </p>
                      </div>
                    </div>

                    {/* โทรสาร Fax */}
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-md">
                        <i className="fa-solid fa-print"></i>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">{lang === "en" ? "Facsimile (Fax)" : "โทรสาร"}</h4>
                        <p className="text-slate-700 font-bold tracking-wide">
                          0-2393-7307-10
                        </p>
                      </div>
                    </div>

                    {/* อีเมลกลาง */}
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-md">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">{lang === "en" ? "Central Admin Mail" : "อีเมลส่วนกลาง"}</h4>
                        <p className="text-slate-900 font-bold">
                          <a href="mailto:admincenter@handleintergroup.com" className="hover:text-sky-600 transition-colors underline decoration-slate-300 underline-offset-4">admincenter@handleintergroup.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* โซเชียลมีเดีย */}
                  <div className="pt-4 border-t border-slate-200 flex items-center space-x-3 text-slate-500 text-xs font-semibold">
                    <span>Follow Us:</span>
                    <a href="#" className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"><i className="fa-brands fa-facebook-f text-xs"></i></a>
                    <a href="#" className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"><i className="fa-brands fa-line text-xs"></i></a>
                    <a href="#" className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"><i className="fa-brands fa-linkedin-in text-xs"></i></a>
                  </div>
                </div>
              </div>
            </MagnificSection>

            {/* RIGHT SIDE: FORM CARD */}
            <MagnificSection id="submission-form" className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl border border-slate-200/90 p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 space-y-6 text-slate-800">
                <div className="space-y-1 text-left">
                  <h3 className="text-lg font-black text-slate-900 tracking-wide">
                    {lang === "en" ? "Direct Digital Message" : "ส่งข้อความถึงเจ้าหน้าที่โดยตรง"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === "en" ? "Fields marked with * are required parameters." : "กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน"}
                  </p>
                </div>

                {/* Alert แสดงความสำเร็จ */}
                {formSubmitted && (
                  <div className="p-4 bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold rounded-xl animate-in fade-in duration-200">
                    <i className="fa-solid fa-circle-check mr-2 text-sky-600"></i>
                    {lang === "en" ? "Your cargo message route has been sent successfully!" : "ระบบได้ส่งข้อมูลความต้องการของคุณไปยังฝ่ายประสานงานส่วนกลางเรียบร้อยแล้ว"}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{isMounted && t.contact.name} *</label>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === "en" ? "John Doe" : "ชื่อ-นามสกุล ของคุณ"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-medium placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{isMounted && t.contact.email} *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="example@company.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-medium placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{lang === "en" ? "Logistics Requirements / Subject" : "หัวข้อข้อความติดต่อ *"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder={lang === "en" ? "e.g., Sea Freight FCL Inquiry" : "เช่น ขอใบเสนอราคาขนส่งสินค้าทางเรือ FCL"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-medium placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{isMounted && t.contact.msg} *</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder={lang === "en" ? "Describe your cargo details..." : "ระบุรายละเอียดสินค้า ขนาด น้ำหนัก สถานที่รับและส่งมอบ..."}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-medium resize-none placeholder:text-slate-300"
                  />
                </div>

                {/* ปุ่มกดส่งสีแดงสด */}
                <button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-red-600/20 transition-colors duration-300 cursor-pointer"
                >
                  {isMounted && t.contact.send} <i className="fa-solid fa-paper-plane ml-2 text-[10px]"></i>
                </button>
              </form>
            </MagnificSection>

          </div>
        </div>
      </section>


      {/* 🎯 SECTION 3: MAP BLOCK */}
      <section className="w-full border-t border-slate-200 bg-slate-900 relative z-10 overflow-hidden">
        
        {/* แบ็คกราวด์ภาพถ่ายการขนส่งโลกสีเข้มด้านหลังแผนที่ */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80" 
            alt="Global Connectivity Backdrop" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
        </div>

        {/* แถบหัวข้อแจ้งพิกัดแผนที่ */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-between items-center text-white relative z-10">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              {lang === "en" ? "LIVE SATELLITE HEADQUARTERS MAP" : "แผนที่ที่ตั้งสำนักงานใหญ่ (พิกัดดาวเทียม)"}
            </span>
          </div>
          <div className="text-[11px] font-mono text-sky-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
            GPS: 13.6663° N, 100.6272° E
          </div>
        </div>

        {/* ตัวแผนที่ Google Maps Frame */}
        <MagnificSection id="office-map-frame" className="w-full h-[480px] relative z-10 border-t border-white/10">
          <iframe 
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #0f172a; }
                    iframe { border: 0; width: 100%; height: 100%; display: block; }
                  </style>
                </head>
                <body>
                  <iframe 
                    src="https://maps.google.com/maps?q=Handle%20Inter%20Group%20Bangna&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                </body>
              </html>
            `}
            className="absolute inset-0 w-full h-full border-0"
            style={{ border: 0 }}
            allowFullScreen={true} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Handle Inter Group Headquarters Location Map"
          />
        </MagnificSection>
      </section>

    </div>
  );
}