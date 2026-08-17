"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionary } from "../app/utils/dictionaries";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "th">("en");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSubOpen, setIsMobileSubOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // 🎯 Ref สำหรับหน่วงเวลาปิด Dropdown (Debounce Timer)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subsidiaryPaths = [
    "/H-I-T-INTERCON",
    "/handle-inter-consolidation",
    "/handle-inter-logistics",
    "/handle-inter-express",
    "/console-link",
    "/siam-liners"
  ];

  useEffect(() => {
    setIsMounted(true);
    const savedLang = localStorage.getItem("lang") as "en" | "th";
    if (savedLang) setLang(savedLang);

    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";
      if (savedLang) setLang(savedLang);
    };
    window.addEventListener("langChange", checkLang);
    return () => window.removeEventListener("langChange", checkLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "th" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    window.dispatchEvent(new Event("langChange"));
  };

  // 🎯 ฟังก์ชันจัดการ Hover เปิด-ปิด Dropdown
  const handleMouseEnterDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const t = dictionary[lang].nav;
  const subsidiaries = dictionary[lang].subsidiaries;
  const isSubsidiaryActive = isMounted && (subsidiaryPaths.includes(pathname) || pathname.startsWith("/partners"));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isScrolled ? "py-2 px-4 md:px-8" : "py-4 px-6"
    }`}>
      <div className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible ${
        isScrolled 
          ? "max-w-6xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-lg shadow-slate-900/5 rounded-full px-6 py-2" 
          : "max-w-7xl bg-transparent border-transparent px-2 py-1"
      }`}>
        <div className="flex justify-between items-center relative overflow-visible">
          
          {/* 🎯 OVERHANGING BIG LOGO (โลโก้ขยายใหญ่ล้นขอบ Navbar) */}
          <Link href="/" className="relative z-10 flex items-center group py-1 overflow-visible">
            <img
              src="/images/j6592 (1).gif"
              alt="Handle Inter Group Logo"
              className={`w-auto max-w-none object-contain transition-all duration-500 group-hover:scale-105 absolute top-1/2 -translate-y-1/2 left-0 ${
                isScrolled 
                  ? "h-14 md:h-16 lg:h-18 drop-shadow-md" 
                  : "h-20 md:h-28 lg:h-32 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
              } ${
                !isScrolled ? "brightness-0 invert" : ""
              }`}
            />
            {/* กล่องเว้นพื้นที่ว่างทางซ้ายคงที่ไว้ไม่ให้เมนูอื่นๆ ทับโลโก้ */}
            <div className={`transition-all duration-500 ${
              isScrolled ? "w-28 md:w-36 lg:w-40 h-8" : "w-36 md:w-48 lg:w-56 h-10"
            }`} />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-wider items-center">
            
            {/* Link: Home */}
            <Link 
              href="/" 
              className={`transition-all duration-300 relative py-1 group/link ${
                isMounted && pathname === "/" 
                  ? "text-orange-500" 
                  : isScrolled ? "text-slate-700 hover:text-orange-600" : "text-white/90 hover:text-white"
              }`}
            >
              {t.home}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-orange-500 rounded-full transition-all duration-300 ${
                isMounted && pathname === "/" ? "w-full" : "w-0 group-hover/link:w-full"
              }`} />
            </Link>

            {/* Link: About */}
            <Link 
              href="/aboutus" 
              className={`transition-all duration-300 relative py-1 group/link ${
                isMounted && pathname === "/aboutus" 
                  ? "text-orange-500" 
                  : isScrolled ? "text-slate-700 hover:text-orange-600" : "text-white/90 hover:text-white"
              }`}
            >
              {t.about}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-orange-500 rounded-full transition-all duration-300 ${
                isMounted && pathname === "/aboutus" ? "w-full" : "w-0 group-hover/link:w-full"
              }`} />
            </Link>

            {/* Desktop Dropdown: Partners */}
            <div 
              className="relative py-2"
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button className={`flex items-center space-x-1.5 transition-all duration-300 py-1 cursor-pointer uppercase ${
                isSubsidiaryActive 
                  ? "text-orange-500" 
                  : isScrolled ? "text-slate-700 hover:text-orange-600" : "text-white/90 hover:text-white"
              }`}>
                <span>{t.partners}</span>
                <i className={`fa-solid fa-chevron-down text-[9px] transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180 text-orange-500 scale-125" : ""
                }`}></i>
              </button>

              {/* Dropdown Menu Container */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full pt-1 w-72 z-50 transform origin-top transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-2xl p-2">
                    <div className="px-3 py-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
                      {lang === "en" ? "Our Subsidiaries" : "บริษัทในเครือของเรา"}
                    </div>
                    {subsidiaries.map((sub, idx) => {
                      const subPath = subsidiaryPaths[idx] || "/partners";
                      const isSubActive = isMounted && pathname === subPath;
                      return (
                        <Link
                          key={idx}
                          href={subPath}
                          className={`block px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:translate-x-1 ${
                            isSubActive 
                              ? "text-orange-600 bg-orange-50 font-bold" 
                              : "text-slate-700 hover:text-orange-600 hover:bg-orange-50/50"
                          }`}
                        >
                          <span className="text-orange-500/50 mr-2 font-mono text-[10px]">0{idx + 1}.</span> {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 🌟 Link: News (แก้ไขปุ่มข่าวสารให้ยิงไปที่ /news) */}
            {/* <Link 
              href="/news" 
              className={`transition-all duration-300 relative py-1 group/link ${
                isMounted && pathname === "/news" 
                  ? "text-orange-500" 
                  : isScrolled ? "text-slate-700 hover:text-orange-600" : "text-white/90 hover:text-white"
              }`}
            >
              {t.services}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-orange-500 rounded-full transition-all duration-300 ${
                isMounted && pathname === "/news" ? "w-full" : "w-0 group-hover/link:w-full"
              }`} />
            </Link> */}

            {/* 🌟 Link: Contact Us (แก้ไขปุ่มติดต่อเราให้ยิงไปที่ /contactus) */}
            <Link 
              href="/contactus" 
              className={`transition-all duration-300 relative py-1 group/link ${
                isMounted && pathname === "/contactus" 
                  ? "text-orange-500" 
                  : isScrolled ? "text-slate-700 hover:text-orange-600" : "text-white/90 hover:text-white"
              }`}
            >
              {t.news}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-orange-500 rounded-full transition-all duration-300 ${
                isMounted && pathname === "/contactus" ? "w-full" : "w-0 group-hover/link:w-full"
              }`} />
            </Link>
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className={`border text-[11px] font-mono font-bold px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
                isScrolled 
                  ? "bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-800 border-slate-200/80" 
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
              }`}
            >
              <i className="fa-solid fa-globe mr-1.5 text-orange-500"></i> {lang === "en" ? "TH" : "EN"}
            </button>

            {/* CTA Button
            <Link
              href="/contactus"
              className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-600/30 active:scale-95"
            >
              {t.quote}
            </Link> */}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button 
              onClick={toggleLanguage} 
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                isScrolled ? "bg-slate-100 text-slate-800 border-slate-200" : "bg-white/10 text-white border-white/20 backdrop-blur-md"
              }`}
            >
              {lang === "en" ? "TH" : "EN"}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`text-xl p-2 focus:outline-none transition-transform active:scale-90 ${
                isScrolled ? "text-slate-800" : "text-white"
              }`}
            >
              <i className={`fa-solid ${isOpen ? "fa-xmark rotate-90" : "fa-bars-staggered"} transition-transform duration-300`}></i>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <nav className="md:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <Link href="/" onClick={() => setIsOpen(false)} className={`text-sm font-bold py-1 transition ${isMounted && pathname === "/" ? "text-orange-600" : "text-slate-700"}`}>
            {t.home}
          </Link>
          <Link href="/aboutus" onClick={() => setIsOpen(false)} className={`text-sm font-bold py-1 transition ${isMounted && pathname === "/aboutus" ? "text-orange-600" : "text-slate-700"}`}>
            {t.about}
          </Link>

          <div className="flex flex-col">
            <button 
              onClick={() => setIsMobileSubOpen(!isMobileSubOpen)} 
              className="flex justify-between items-center text-sm font-bold py-1 text-slate-700 w-full text-left"
            >
              <span className={isSubsidiaryActive ? "text-orange-600" : ""}>{t.partners}</span>
              <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${isMobileSubOpen ? "rotate-180 text-orange-600" : ""}`}></i>
            </button>
            
            {isMobileSubOpen && (
              <div className="pl-4 mt-2 space-y-2 border-l-2 border-orange-500/40 py-1 animate-in fade-in duration-200">
                {subsidiaries.map((sub, idx) => {
                  const subPath = subsidiaryPaths[idx] || "/partners";
                  const isSubActive = isMounted && pathname === subPath;
                  return (
                    <Link
                      key={idx}
                      href={subPath}
                      onClick={() => { setIsOpen(false); setIsMobileSubOpen(false); }}
                      className={`block text-xs font-semibold py-1 transition-colors ${isSubActive ? "text-orange-600 font-bold" : "text-slate-600 hover:text-orange-600"}`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/news" onClick={() => setIsOpen(false)} className={`text-sm font-bold py-1 transition ${isMounted && pathname === "/news" ? "text-orange-600" : "text-slate-700"}`}>
            {t.services}
          </Link>
          <Link href="/contactus" onClick={() => setIsOpen(false)} className={`text-sm font-bold py-1 transition ${isMounted && pathname === "/contactus" ? "text-orange-600" : "text-slate-700"}`}>
            {t.news}
          </Link>
          <Link
            href="/contactus"
            onClick={() => setIsOpen(false)}
            className="bg-orange-600 hover:bg-orange-500 text-center py-3 rounded-2xl text-white text-xs font-bold tracking-wider uppercase transition block mt-4 shadow-lg shadow-orange-600/30"
          >
            {t.quote}
          </Link>
        </nav>
      )}
    </header>
  );
}