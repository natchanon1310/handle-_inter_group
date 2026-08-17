// components/SubBrandNavbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SubsidiaryBrand } from "@/app/config/subsidiariesConfig";
import { dictionary } from "@/app/utils/dictionaries";

// =============================================================
// 1️⃣ NAVBAR DESIGN 1: H.I.T. INTERCON (Dynamic Capsule Pill)
// =============================================================
function HitInterconNavbar({
  brand,
  isTh,
  toggleLanguage,
}: {
  brand: SubsidiaryBrand;
  isTh: boolean;
  toggleLanguage: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileTopOpen, setIsMobileTopOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const langKey = isTh ? "th" : "en";
  const currentNavLinks = brand.navLinks[langKey] || brand.navLinks.en;
  const tNav = dictionary[langKey]?.nav || {
    news: isTh ? "ติดต่อเรา" : "Contact us",
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
        setIsMobileTopOpen(false);
      } else {
        setIsScrolled(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsMobileTopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      {!isScrolled && (
        <div ref={menuRef} className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3 md:py-4 px-4 md:px-12 pointer-events-auto transition-all duration-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/"
                className="text-slate-300 hover:text-orange-400 text-[11px] sm:text-xs font-mono font-bold transition-colors whitespace-nowrap"
              >
                {isTh ? "← หน้าหลักกลุ่ม" : "← Group Home"}
              </Link>
              <div className="h-4 w-[1px] bg-white/20" />
              <Link href={brand.path} className="flex items-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-md"
                />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase text-slate-200">
              {currentNavLinks.map((link, idx) => (
                <a key={idx} href={link.href} className="hover:text-orange-400 transition-colors">
                  {link.label}
                </a>
              ))}
              <button
                onClick={toggleLanguage}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-[11px] font-mono border border-white/20 transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>🌐</span>
                <span className="font-bold">{isTh ? "EN" : "TH"}</span>
              </button>
              <Link
                href="/"
                className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-orange-600/30 transition-colors"
              >
                {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
              </Link>
            </nav>

            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleLanguage}
                className="bg-white/10 text-white px-2.5 py-1 rounded-full text-[10px] font-mono border border-white/20"
              >
                🌐 {isTh ? "EN" : "TH"}
              </button>
              <button
                onClick={() => setIsMobileTopOpen(!isMobileTopOpen)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between items-center">
                  <span className={`w-full h-[2px] bg-white transition-transform duration-300 ${isMobileTopOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                  <span className={`w-full h-[2px] bg-white transition-opacity duration-300 ${isMobileTopOpen ? "opacity-0" : ""}`} />
                  <span className={`w-full h-[2px] bg-white transition-transform duration-300 ${isMobileTopOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMobileTopOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-3"
              >
                <nav className="flex flex-col space-y-2">
                  {currentNavLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.href}
                      onClick={() => setIsMobileTopOpen(false)}
                      className="text-xs font-bold uppercase text-slate-200 hover:text-orange-400 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="pt-2 border-t border-white/10">
                  <Link
                    href="/"
                    onClick={() => setIsMobileTopOpen(false)}
                    className="block w-full text-center bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-md"
                  >
                    {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {isScrolled && (
        <div className="py-5 px-4 md:px-12 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto relative">
            <div className="flex items-center">
              <Link href={brand.path} className="flex items-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-lg transition-all duration-300"
                />
              </Link>
            </div>

            <div ref={menuRef} className="absolute left-1/2 -translate-x-1/2 top-0 z-50">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="bg-black text-white rounded-[28px] border border-white/10 shadow-2xl overflow-hidden w-[260px] sm:w-[320px]"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    <div className="w-4 h-4 flex flex-col justify-center items-center space-y-1">
                      <span className={`w-3.5 h-[1.5px] bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
                      <span className={`w-3.5 h-[1.5px] bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
                    </div>
                    <span>{isOpen ? (isTh ? "ปิด" : "Close") : (isTh ? "เมนู" : "Menu")}</span>
                  </button>

                  <button
                    onClick={toggleLanguage}
                    className="text-[11px] font-mono font-bold px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white flex items-center space-x-1"
                  >
                    <span>🌐</span>
                    <span>{isTh ? "EN" : "TH"}</span>
                  </button>

                  <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold px-2.5 sm:px-3 py-1.5 rounded-full">
                    HIT 01
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="p-4 sm:p-5 space-y-4"
                    >
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2">
                        {isTh ? "รายการเมนู" : "Navigation"}
                      </div>
                      <nav className="flex flex-col space-y-2">
                        {currentNavLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-all group"
                          >
                            <span className="text-sm font-bold text-slate-200 group-hover:text-orange-400 group-hover:translate-x-1 transition-all">
                              {link.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 group-hover:text-orange-400">
                              0{idx + 1}
                            </span>
                          </a>
                        ))}
                      </nav>
                      <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
                        <Link
                          href="/"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold font-mono transition-all text-center shadow-lg shadow-orange-600/30"
                        >
                          <span>{isTh ? "กลับสู่หน้าหลักกลุ่ม" : "Handle Inter Group"}</span>
                          <span>↗</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="flex items-center">
              <Link
                href="/contactus"
                className="bg-black hover:bg-slate-800 text-white text-xs font-bold font-mono px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg transition-colors hidden sm:inline-block"
              >
                {tNav.news || (isTh ? "ติดต่อเรา" : "Contact Us")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// =============================================================
// 2️⃣ NAVBAR DESIGN 2: CONSOLE LINK (Tech Purple)
// =============================================================
function ConsoleLinkNavbar({
  brand,
  isTh,
  toggleLanguage,
}: {
  brand: SubsidiaryBrand;
  isTh: boolean;
  toggleLanguage: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const langKey = isTh ? "th" : "en";
  const currentNavLinks = brand.navLinks[langKey] || brand.navLinks.en;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {!isScrolled && (
        <div className="pt-4 px-4 md:px-8">
          <div className="max-w-7xl mx-auto bg-indigo-950/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl py-3 px-6 shadow-2xl shadow-indigo-950/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="text-indigo-300 hover:text-white text-xs font-mono bg-indigo-900/50 border border-indigo-700/40 px-3 py-1.5 rounded-xl transition-all"
              >
                {isTh ? "← กลุ่มแฮนเดิล" : "← Main Hub"}
              </Link>
              <Link href={brand.path} className="flex items-center space-x-2.5">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 w-auto filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                />
                <span className="text-indigo-100 font-extrabold text-sm tracking-tight font-mono">
                  CONSOLE LINK
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-indigo-200">
              {currentNavLinks.map((link, idx) => (
                <a key={idx} href={link.href} className="hover:text-indigo-400 transition-colors">
                  {link.label}
                </a>
              ))}
              <button
                onClick={toggleLanguage}
                className="bg-indigo-900/60 hover:bg-indigo-800 text-indigo-100 px-3 py-1.5 rounded-xl text-[11px] font-mono border border-indigo-700/50"
              >
                🌐 {isTh ? "EN" : "TH"}
              </button>
              <Link
                href="/"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-mono font-bold shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105"
              >
                CONNECT HUB ↗
              </Link>
            </nav>
          </div>
        </div>
      )}

      {isScrolled && (
        <div className="pt-3 px-4 md:px-8">
          <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl shadow-xl border border-slate-200/90 flex items-center justify-between divide-x divide-slate-200 overflow-hidden">
            <div className="px-6 py-3.5 flex items-center space-x-3 shrink-0">
              <Link href={brand.path} className="flex items-center space-x-2.5 group">
                <img src={brand.logo} alt={brand.name} className="h-7 w-auto object-contain" />
                <span className="font-black text-sm md:text-base tracking-tight text-slate-900">
                  Console<span className="text-indigo-600">Link®</span>
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex flex-1 items-center justify-center space-x-8 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-700">
              {currentNavLinks.map((link, idx) => (
                <a key={idx} href={link.href} className="hover:text-indigo-600 transition-colors relative py-1 group">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="px-6 py-3.5 flex items-center space-x-5 text-slate-700 shrink-0">
              <button
                onClick={toggleLanguage}
                className="text-xs font-mono font-bold hover:text-indigo-600 transition-colors flex items-center space-x-1"
              >
                <span>🌐</span>
                <span>{isTh ? "EN" : "TH"}</span>
              </button>

              <Link href="/contactus" className="bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all">
                {isTh ? "ติดต่อ" : "Contact"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// =============================================================
// 3️⃣ NAVBAR DESIGN 3: CONSOLIDATION (Ocean Blue Hub)
// =============================================================
function ConsolidationNavbar({ brand, isTh, toggleLanguage }: { brand: SubsidiaryBrand; isTh: boolean; toggleLanguage: () => void }) {
  const langKey = isTh ? "th" : "en";
  const currentNavLinks = brand.navLinks[langKey] || brand.navLinks.en;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sky-950/85 backdrop-blur-md border-b border-sky-500/20 py-3.5 px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-sky-300 hover:text-white text-xs font-bold transition-colors">
            {isTh ? "← หน้าหลักกรุ๊ป" : "← Group Main"}
          </Link>
          <div className="h-4 w-[1px] bg-sky-400/30" />
          <Link href={brand.path} className="flex items-center space-x-3">
            <img src={brand.logo} alt={brand.name} className="h-9 w-auto object-contain" />
            <span className="text-sky-100 font-black text-xs md:text-sm tracking-widest uppercase">INTER CONSOLIDATION</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase text-sky-200">
          {currentNavLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="hover:text-sky-400 transition-colors">{link.label}</a>
          ))}
          <button onClick={toggleLanguage} className="bg-sky-900/50 hover:bg-sky-800 text-sky-100 px-3 py-1.5 rounded-full text-[11px] font-mono border border-sky-700/40">
            🌐 {isTh ? "EN" : "TH"}
          </button>
          <Link href="/" className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2 rounded-full font-extrabold shadow-md shadow-sky-500/20 transition-transform hover:scale-105">
            Handle Group ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}

// =============================================================
// 4️⃣ NAVBAR DESIGN 4: LOGISTICS (Emerald Fleet)
// =============================================================
function LogisticsNavbar({ brand, isTh, toggleLanguage }: { brand: SubsidiaryBrand; isTh: boolean; toggleLanguage: () => void }) {
  const langKey = isTh ? "th" : "en";
  const currentNavLinks = brand.navLinks[langKey] || brand.navLinks.en;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/30 py-3 px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-emerald-400 hover:text-emerald-200 text-xs font-mono font-bold transition-colors">
            {isTh ? "← กลุ่มแฮนเดิล" : "← Back to Group"}
          </Link>
          <div className="h-4 w-[1px] bg-emerald-500/30" />
          <Link href={brand.path} className="flex items-center space-x-3">
            <img src={brand.logo} alt={brand.name} className="h-9 w-auto object-contain" />
            <span className="text-emerald-50 font-black text-sm tracking-tight">HANDLE INTER LOGISTICS</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase text-emerald-100">
          {currentNavLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="hover:text-emerald-400 transition-colors">{link.label}</a>
          ))}
          <button onClick={toggleLanguage} className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 px-3 py-1.5 rounded-lg text-[11px] font-mono border border-emerald-800">
            🌐 {isTh ? "EN" : "TH"}
          </button>
          <Link href="/" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105">
            Main Group ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}

// =============================================================
// 5️⃣ NAVBAR DESIGN 5: STANDARD FALLBACK
// =============================================================
function StandardSubBrandNavbar({ brand, isTh, toggleLanguage }: { brand: SubsidiaryBrand; isTh: boolean; toggleLanguage: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const langKey = isTh ? "th" : "en";
  const currentNavLinks = brand.navLinks[langKey] || brand.navLinks.en;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg py-3 px-6 border-b border-slate-200/80" : "bg-slate-950/60 backdrop-blur-sm py-4 px-6 md:px-8 border-b border-white/10"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Link href="/" className={`text-xs font-mono font-bold flex items-center space-x-1 transition-colors ${
            isScrolled ? "text-slate-500 hover:text-slate-900" : "text-slate-300 hover:text-white"
          }`}>
            <span>{isTh ? "← หน้าหลักกลุ่ม" : "← Group Home"}</span>
          </Link>
          <div className={`h-4 w-[1px] ${isScrolled ? "bg-slate-300" : "bg-white/20"}`} />
          <Link href={brand.path} className="flex items-center space-x-2.5">
            <img src={brand.logo} alt={brand.name} className="h-8 md:h-10 w-auto object-contain" />
            <span className={`font-black text-xs md:text-sm tracking-tight ${isScrolled ? "text-slate-900" : "text-white"}`}>
              {brand.name}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
          {currentNavLinks.map((link, idx) => (
            <a key={idx} href={link.href} className={`transition-colors hover:text-orange-500 ${isScrolled ? "text-slate-700" : "text-slate-200"}`}>
              {link.label}
            </a>
          ))}
          <button onClick={toggleLanguage} className={`border text-[11px] font-mono font-bold px-3 py-1 rounded-full transition-all ${
            isScrolled ? "bg-slate-100 text-slate-800 border-slate-200" : "bg-white/10 text-white border-white/20"
          }`}>
            🌐 {isTh ? "EN" : "TH"}
          </button>
          <Link href="/" className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md shadow-orange-600/20">
            {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

// =============================================================
// 🎯 MAIN NAVBAR SWITCHER COMPONENT (DEFAULT EXPORT)
// =============================================================
export default function SubBrandNavbar({ brand }: { brand: SubsidiaryBrand }) {
  const [lang, setLang] = useState<"en" | "th">("en");

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("langChange", checkLang);
    return () => window.removeEventListener("langChange", checkLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "th" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    window.dispatchEvent(new Event("langChange"));
  };

  const isTh = lang === "th";

  switch (brand.path) {
    case "/H-I-T-INTERCON":
      return <HitInterconNavbar brand={brand} isTh={isTh} toggleLanguage={toggleLanguage} />;
    case "/console-link":
      return <ConsoleLinkNavbar brand={brand} isTh={isTh} toggleLanguage={toggleLanguage} />;
    case "/handle-inter-consolidation":
      return <ConsolidationNavbar brand={brand} isTh={isTh} toggleLanguage={toggleLanguage} />;
    case "/handle-inter-logistics":
      return <LogisticsNavbar brand={brand} isTh={isTh} toggleLanguage={toggleLanguage} />;
    default:
      return <StandardSubBrandNavbar brand={brand} isTh={isTh} toggleLanguage={toggleLanguage} />;
  }
}