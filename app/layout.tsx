"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react"; // 👈 เพิ่ม useMemo ตรงนี้
import Navbar from "@/components/Navbar"; // Main Navbar
import SubBrandNavbar from "@/components/SubBrandNavbar";
import SubBrandFooter from "@/components/SubBrandFooter";
import { subsidiariesConfig } from "./config/subsidiariesConfig";
import "./globals.css";
import { dictionary } from "./utils/dictionaries";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isShaking, setIsShaking] = useState(false);
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // 🎯 ตรวจสอบอย่างรัดกุมว่า Path ปัจจุบันเป็นบริษัทในเครือหรือไม่
  const currentSubBrand = useMemo(() => {
    if (!pathname || pathname === "/") return null;
    return (
      subsidiariesConfig[pathname] ||
      Object.values(subsidiariesConfig).find(
        (sub) => sub.path && sub.path !== "/" && pathname.startsWith(sub.path)
      ) ||
      null
    );
  }, [pathname]);

  useEffect(() => {
    setIsShaking(true);
    const timer = setTimeout(() => {
      setIsShaking(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("langChange", checkLang);
    return () => window.removeEventListener("langChange", checkLang);
  }, []);

  // 🔒 IntersectionObserver Re-observe
  useEffect(() => {
    if (currentSubBrand) return;

    setIsFooterVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFooterVisible(true);
        }
      },
      { 
        threshold: 0.01,
        rootMargin: "0px 0px 100px 0px"
      }
    );

    const currentFooter = footerRef.current;
    if (currentFooter) {
      observer.observe(currentFooter);
    }

    const fallbackTimer = setTimeout(() => {
      setIsFooterVisible(true);
    }, 1000);

    return () => {
      if (currentFooter) observer.unobserve(currentFooter);
      clearTimeout(fallbackTimer);
    };
  }, [pathname, currentSubBrand]);

  const t = dictionary[lang] || dictionary.en;
  const fText = t.footer || {};

  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-[#0d0f12] text-zinc-100 antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white flex flex-col min-h-screen">
        
        {/* 1. Dynamic Navbar */}
{currentSubBrand ? (
  <SubBrandNavbar brand={currentSubBrand} />
) : (
  <Navbar />
)}

        {/* Main Content Area */}
        <main 
          className={`flex-grow transition-transform duration-200 `}
        >
          {children}
        </main>

        {/* 2. Dynamic Footer */}
        {currentSubBrand ? (
         <SubBrandFooter brand={currentSubBrand} />
        ) : (
          <footer 
            ref={footerRef}
            style={{
              opacity: isFooterVisible ? 1 : 0,
              transform: isFooterVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.99)",
            }}
            className="bg-[#12151b] text-zinc-400 text-xs py-20 transition-all duration-700 ease-out transform-gpu mt-auto border-t border-white/5 relative z-20"
          >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
              
              {/* Column 1: Info */}
              <div className="space-y-6">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-3">
                  {fText.visit || "Visit Us"}
                </h3>
                <div className="flex items-center space-x-2 py-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                  <span className="text-base font-extrabold text-white tracking-tight">
                    handle <span className="text-orange-500 font-light">Inter Group</span>
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  <strong className="text-zinc-200 block mb-1.5">{fText.loc}</strong>
                  {fText.locDetail}
                </p>
                <div className="pt-2 space-y-2 text-[11px] text-zinc-400">
                  <p><strong className="text-zinc-300">{fText.tel}</strong> {fText.telDetail}</p>
                  <p><strong className="text-zinc-300">{fText.fax}</strong> {fText.faxDetail}</p>
                </div>
              </div>

              {/* Column 2: Subsidiaries */}
              <div className="space-y-6">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-3">
                  {fText.subsidiaries || "Subsidiaries"}
                </h3>
                <ul className="space-y-3.5 text-zinc-400 text-[11px]">
                  {fText.subList?.map((sub: string, i: number) => (
                    <li key={i} className="hover:text-orange-400 transition-colors cursor-pointer flex items-center group">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2.5 opacity-40 group-hover:opacity-100 transition-opacity"></span>
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: News & Links */}
              <div className="space-y-6">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-3">
                  {fText.news || "Quick Links"}
                </h3>
                <ul className="space-y-3.5 text-zinc-400 text-[11px]">
                  {fText.newsList?.map((menu: string, i: number) => (
                    <li 
                      key={i} 
                      className={`hover:text-orange-400 transition-colors cursor-pointer ${
                        i === 3 ? "pt-3 border-t border-white/5 text-zinc-500 font-medium" : ""
                      }`}
                    >
                      {menu}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Google Maps */}
              <div className="space-y-6">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-3">
                  {fText.mapTitle || "Location Map"}
                </h3>
                <div className="w-full h-52 rounded-2xl overflow-hidden border border-white/10 relative group shadow-2xl bg-zinc-900">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.5432!2d100.6272!3d13.6663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a0134ffffff9%3A0x123456789abcdef!2sHandle%20Inter%20Group!5e0!3m2!1sth!2sth!4v1700000000000"
                    className="w-full h-full border-0 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none transition-all duration-300 group-hover:opacity-0">
                    <span className="bg-[#0d0f12]/90 backdrop-blur-md text-zinc-200 text-[10px] font-medium px-3 py-2 rounded-full block text-center border border-white/10 shadow-lg">
                      <i className="fa-solid fa-map-location-dot text-orange-500 mr-1.5"></i>{fText.mapBtn || "Open Map"}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-zinc-600 text-[10px] tracking-widest uppercase font-mono">
              © 2026 Handle Inter Group. Designed for high-performance global logistics.
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}