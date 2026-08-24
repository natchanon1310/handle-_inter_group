// components/SubBrandNavbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SubsidiaryBrand } from "@/app/config/subsidiariesConfig";

// 🎯 Helper Scroll Function สำหรับทุก Navbar
const handleScrollToSection = (targetId: string, callback?: () => void) => {
  const rawId = targetId.replace(/^#/, "").trim();
  const targetElement =
    document.getElementById(rawId) ||
    document.getElementById(rawId.toLowerCase()) ||
    document.getElementById(rawId.replace(/\s+/g, "-")) ||
    document.getElementById(rawId.toLowerCase().replace(/\s+/g, "-")) ||
    document.getElementById(rawId.replace(/\s+/g, ""));

  if (targetElement) {
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = targetElement.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - 80;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  if (callback) callback();
};

// =============================================================
// 1️⃣ NAVBAR DESIGN 1: H.I.T. INTERCON
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        ref={menuRef}
        className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3 md:py-4 px-4 md:px-12 transition-all duration-500"
      >
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase text-slate-200">
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("overview")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              {isTh ? "ภาพรวม" : "Overview"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("companyprofile")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              {isTh ? "เอกสารบริษัท" : "Company Profile"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Our service")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              {isTh ? "ขีดความสามารถ" : "Capabilities"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Contact Us")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              {isTh ? "ติดต่อเรา" : "Contact Us"}
            </button>

            <Link
              href="/"
              className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-orange-600/30 transition-colors"
            >
              {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center">
                <span
                  className={`w-full h-[2px] bg-white transition-transform duration-300 ${
                    isMobileOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`w-full h-[2px] bg-white transition-opacity duration-300 ${
                    isMobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-full h-[2px] bg-white transition-transform duration-300 ${
                    isMobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* 📱 Mobile Dropdown */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-3 overflow-hidden"
            >
              <nav className="flex flex-col space-y-2">
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("overview", () => setIsMobileOpen(false))}
                  className="text-left text-xs font-bold uppercase text-slate-200 hover:text-orange-400 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer w-full"
                >
                  {isTh ? "ภาพรวม" : "Overview"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("companyprofile", () => setIsMobileOpen(false))}
                  className="text-left text-xs font-bold uppercase text-slate-200 hover:text-orange-400 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer w-full"
                >
                  {isTh ? "เอกสารบริษัท" : "Company Profile"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("Our service", () => setIsMobileOpen(false))}
                  className="text-left text-xs font-bold uppercase text-slate-200 hover:text-orange-400 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer w-full"
                >
                  {isTh ? "ขีดความสามารถ" : "Capabilities"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("Contact Us", () => setIsMobileOpen(false))}
                  className="text-left text-xs font-bold uppercase text-slate-200 hover:text-orange-400 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer w-full"
                >
                  {isTh ? "ติดต่อเรา" : "Contact Us"}
                </button>
              </nav>
              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/"
                  onClick={() => setIsMobileOpen(false)}
                  className="block w-full text-center bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-md"
                >
                  {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {!isScrolled && (
        <div className="pt-4 px-4 md:px-8">
          <div
            ref={menuRef}
            className="max-w-7xl mx-auto bg-indigo-950/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl py-3 px-6 shadow-2xl shadow-indigo-950/50 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
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

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-indigo-200 uppercase">
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("overview")}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {isTh ? "ภาพรวม" : "Overview"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("companyprofile")}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {isTh ? "เอกสารบริษัท" : "Company Profile"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("Our service")}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {isTh ? "ขีดความสามารถ" : "Capabilities"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("Contact Us")}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {isTh ? "ติดต่อเรา" : "Contact Us"}
                </button>
              </nav>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden text-indigo-200 hover:text-white p-2 focus:outline-none cursor-pointer"
              >
                <i className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
              </button>
            </div>

            {/* 📱 Mobile Dropdown */}
            <AnimatePresence>
              {isMobileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden pt-4 pb-2 border-t border-indigo-800/60 mt-3 flex flex-col space-y-2 overflow-hidden"
                >
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("overview", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-indigo-200 hover:text-white py-2 px-3 rounded-lg hover:bg-indigo-900/40 cursor-pointer w-full"
                  >
                    {isTh ? "ภาพรวม" : "Overview"}
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("companyprofile", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-indigo-200 hover:text-white py-2 px-3 rounded-lg hover:bg-indigo-900/40 cursor-pointer w-full"
                  >
                    {isTh ? "เอกสารบริษัท" : "Company Profile"}
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("Our service", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-indigo-200 hover:text-white py-2 px-3 rounded-lg hover:bg-indigo-900/40 cursor-pointer w-full"
                  >
                    {isTh ? "ขีดความสามารถ" : "Capabilities"}
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("Contact Us", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-indigo-200 hover:text-white py-2 px-3 rounded-lg hover:bg-indigo-900/40 cursor-pointer w-full"
                  >
                    {isTh ? "ติดต่อเรา" : "Contact Us"}
                  </button>
                  <Link
                    href="/"
                    onClick={() => setIsMobileOpen(false)}
                    className="bg-indigo-600 text-white text-center py-2.5 rounded-xl text-xs font-bold mt-2 shadow-md"
                  >
                    {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {isScrolled && (
        <div className="pt-3 px-4 md:px-8">
          <div
            ref={menuRef}
            className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl shadow-xl border border-slate-200/90 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-3.5 divide-x-0 md:divide-x divide-slate-200">
              <div className="flex items-center space-x-3 shrink-0 md:pr-6">
                <Link href={brand.path} className="flex items-center space-x-2.5 group">
                  <img src={brand.logo} alt={brand.name} className="h-7 w-auto object-contain" />
                  <span className="font-black text-sm md:text-base tracking-tight text-slate-900">
                    Console<span className="text-indigo-600">Link®</span>
                  </span>
                </Link>
              </div>

              {/* Desktop Nav Scrolled */}
              <nav className="hidden md:flex flex-1 items-center justify-center space-x-8 px-6 text-xs font-bold uppercase tracking-widest text-slate-700">
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("overview")}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {isTh ? "ภาพรวม" : "Overview"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("companyprofile")}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {isTh ? "เอกสารบริษัท" : "Company Profile"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("Our service")}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {isTh ? "ขีดความสามารถ" : "Capabilities"}
                </button>
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("Contact Us")}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {isTh ? "ติดต่อเรา" : "Contact Us"}
                </button>
              </nav>

              <div className="hidden md:flex items-center space-x-5 text-slate-700 shrink-0 md:pl-6">
                <button
                  type="button"
                  onPointerDown={() => handleScrollToSection("Contact Us")}
                  className="bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {isTh ? "ติดต่อ" : "Contact"}
                </button>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden text-slate-900 p-1.5 focus:outline-none cursor-pointer"
              >
                <i className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
              </button>
            </div>

            {/* 📱 Mobile Dropdown Scrolled */}
            <AnimatePresence>
              {isMobileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden px-6 pb-4 border-t border-slate-100 flex flex-col space-y-2 overflow-hidden"
                >
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("overview", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-slate-700 hover:text-indigo-600 py-2 cursor-pointer w-full"
                  >
                    {isTh ? "ภาพรวม" : "Overview"}
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("companyprofile", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-slate-700 hover:text-indigo-600 py-2 cursor-pointer w-full"
                  >
                    {isTh ? "เอกสารบริษัท" : "Company Profile"}
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("Our service", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-slate-700 hover:text-indigo-600 py-2 cursor-pointer w-full"
                  >
                    {isTh ? "ขีดความสามารถ" : "Capabilities"}
                  </button>
                  <button
                    type="button"
                    onPointerDown={() => handleScrollToSection("Contact Us", () => setIsMobileOpen(false))}
                    className="text-left text-xs font-bold uppercase text-slate-700 hover:text-indigo-600 py-2 cursor-pointer w-full"
                  >
                    {isTh ? "ติดต่อเรา" : "Contact Us"}
                  </button>
                  <Link
                    href="/contactus"
                    onClick={() => setIsMobileOpen(false)}
                    className="bg-slate-900 text-white text-center py-2.5 rounded-xl text-xs font-bold mt-2"
                  >
                    {isTh ? "ติดต่อเรา ↗" : "Contact Us ↗"}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </header>
  );
}

// =============================================================
// 3️⃣ NAVBAR DESIGN 3: CONSOLIDATION (Ocean Blue Hub)
// =============================================================
function ConsolidationNavbar({
  brand,
  isTh,
  toggleLanguage,
}: {
  brand: SubsidiaryBrand;
  isTh: boolean;
  toggleLanguage: () => void;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sky-950/85 backdrop-blur-md border-b border-sky-500/20 py-3.5 px-4 md:px-8">
      <div ref={menuRef} className="max-w-7xl mx-auto flex flex-col justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="text-sky-300 hover:text-white text-xs font-bold transition-colors">
              {isTh ? "← หน้าหลักกรุ๊ป" : "← Group Main"}
            </Link>
            <div className="h-4 w-[1px] bg-sky-400/30" />
            <Link href={brand.path} className="flex items-center space-x-2 sm:space-x-3">
              <img src={brand.logo} alt={brand.name} className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-sky-100 font-black text-xs md:text-sm tracking-widest uppercase">
                INTER CONSOLIDATION
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase text-sky-200">
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("overview")}
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              {isTh ? "ภาพรวม" : "Overview"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("companyprofile")}
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              {isTh ? "เอกสารบริษัท" : "Company Profile"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Our service")}
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              {isTh ? "ขีดความสามารถ" : "Capabilities"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Contact Us")}
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              {isTh ? "ติดต่อเรา" : "Contact Us"}
            </button>
            <Link
              href="/"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2 rounded-full font-extrabold shadow-md shadow-sky-500/20 transition-transform hover:scale-105"
            >
              {isTh ? "หน้าหลักกลุ่มบริษัท ↗" : "Main Group ↗"}
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-sky-200 hover:text-white p-2 focus:outline-none cursor-pointer"
          >
            <i className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
          </button>
        </div>

        {/* 📱 Mobile Dropdown */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-2 border-t border-sky-800/50 mt-3 flex flex-col space-y-2 overflow-hidden"
            >
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("overview", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-sky-200 hover:text-white py-2 px-3 rounded-lg hover:bg-sky-900/50 cursor-pointer w-full"
              >
                {isTh ? "ภาพรวม" : "Overview"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("companyprofile", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-sky-200 hover:text-white py-2 px-3 rounded-lg hover:bg-sky-900/50 cursor-pointer w-full"
              >
                {isTh ? "เอกสารบริษัท" : "Company Profile"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Our service", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-sky-200 hover:text-white py-2 px-3 rounded-lg hover:bg-sky-900/50 cursor-pointer w-full"
              >
                {isTh ? "ขีดความสามารถ" : "Capabilities"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Contact Us", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-sky-200 hover:text-white py-2 px-3 rounded-lg hover:bg-sky-900/50 cursor-pointer w-full"
              >
                {isTh ? "ติดต่อเรา" : "Contact Us"}
              </button>
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="bg-sky-500 text-slate-950 text-center py-2.5 rounded-xl text-xs font-bold mt-2"
              >
                {isTh ? "หน้าหลักกลุ่มบริษัท ↗" : "Main Group ↗"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// =============================================================
// 4️⃣ NAVBAR DESIGN 4: LOGISTICS (Emerald Fleet)
// =============================================================
function LogisticsNavbar({
  brand,
  isTh,
  toggleLanguage,
}: {
  brand: SubsidiaryBrand;
  isTh: boolean;
  toggleLanguage: () => void;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/30 py-3 px-4 md:px-8">
      <div ref={menuRef} className="max-w-7xl mx-auto flex flex-col justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="text-emerald-400 hover:text-emerald-200 text-xs font-mono font-bold transition-colors">
              {isTh ? "← กลุ่มแฮนเดิล" : "← Back to Group"}
            </Link>
            <div className="h-4 w-[1px] bg-emerald-500/30" />
            <Link href={brand.path} className="flex items-center space-x-2 sm:space-x-3">
              <img src={brand.logo} alt={brand.name} className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-emerald-50 font-black text-xs md:text-sm tracking-tight">
                HANDLE INTER LOGISTICS
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase text-emerald-100">
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("overview")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isTh ? "ภาพรวม" : "Overview"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("companyprofile")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isTh ? "เอกสารบริษัท" : "Company Profile"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Our service")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isTh ? "ขีดความสามารถ" : "Capabilities"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Contact Us")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isTh ? "ติดต่อเรา" : "Contact Us"}
            </button>
            <Link
              href="/"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 inline-flex items-center"
            >
              {isTh ? "หน้าหลักกลุ่มบริษัท ↗" : "Main Group ↗"}
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-emerald-300 hover:text-white p-2 focus:outline-none cursor-pointer"
          >
            <i className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
          </button>
        </div>

        {/* 📱 Mobile Dropdown */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-2 border-t border-emerald-800/60 mt-3 flex flex-col space-y-2 overflow-hidden"
            >
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("overview", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-emerald-200 hover:text-white py-2 px-3 rounded-lg hover:bg-emerald-950/60 cursor-pointer w-full"
              >
                {isTh ? "ภาพรวม" : "Overview"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("companyprofile", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-emerald-200 hover:text-white py-2 px-3 rounded-lg hover:bg-emerald-950/60 cursor-pointer w-full"
              >
                {isTh ? "เอกสารบริษัท" : "Company Profile"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Our service", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-emerald-200 hover:text-white py-2 px-3 rounded-lg hover:bg-emerald-950/60 cursor-pointer w-full"
              >
                {isTh ? "ขีดความสามารถ" : "Capabilities"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Contact Us", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-emerald-200 hover:text-white py-2 px-3 rounded-lg hover:bg-emerald-950/60 cursor-pointer w-full"
              >
                {isTh ? "ติดต่อเรา" : "Contact Us"}
              </button>
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="bg-emerald-600 text-white text-center py-2.5 rounded-lg text-xs font-bold mt-2"
              >
                {isTh ? "หน้าหลักกลุ่มบริษัท ↗" : "Main Group ↗"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// =============================================================
// 5️⃣ NAVBAR DESIGN 5: SIAM LINERS (Schedule & Capabilities)
// =============================================================
function SiamLinersNavbar({
  brand,
  isTh,
  toggleLanguage,
}: {
  brand: SubsidiaryBrand;
  isTh: boolean;
  toggleLanguage: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg py-3 px-4 md:px-6 border-b border-cyan-500/20"
          : "bg-slate-950/80 backdrop-blur-sm py-4 px-4 md:px-8 border-b border-white/10"
      }`}
    >
      <div ref={menuRef} className="max-w-7xl mx-auto flex flex-col justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className="text-xs font-mono font-bold flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <span>{isTh ? "← หน้าหลักกลุ่ม" : "← Group Home"}</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/20" />
            <Link href={brand.path} className="flex items-center space-x-2 sm:space-x-2.5">
              <img src={brand.logo} alt={brand.name} className="h-7 md:h-9 w-auto object-contain" />
              <span className="font-black text-xs md:text-sm tracking-tight text-white uppercase">
                {brand.name}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider text-slate-200">
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("overview")}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {isTh ? "ภาพรวม" : "Overview"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Our service")}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {isTh ? "ขีดความสามารถ" : "Capabilities"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("schedule")}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {isTh ? "ตารางเรือ" : "Schedule"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Contact Us")}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {isTh ? "ติดต่อเรา" : "Contact Us"}
            </button>
            <Link
              href="/"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md shadow-cyan-600/30"
            >
              {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-cyan-300 hover:text-white focus:outline-none cursor-pointer"
          >
            <i className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
          </button>
        </div>

        {/* 📱 Mobile Dropdown */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-2 border-t border-cyan-900/50 mt-3 flex flex-col space-y-2 overflow-hidden"
            >
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("overview", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-slate-200 hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer w-full"
              >
                {isTh ? "ภาพรวม" : "Overview"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Our service", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-slate-200 hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer w-full"
              >
                {isTh ? "ขีดความสามารถ" : "Capabilities"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("schedule", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-slate-200 hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer w-full"
              >
                {isTh ? "ตารางเรือ" : "Schedule"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Contact Us", () => setIsMobileOpen(false))}
                className="text-left text-xs font-bold uppercase text-slate-200 hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer w-full"
              >
                {isTh ? "ติดต่อเรา" : "Contact Us"}
              </button>
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="bg-cyan-600 text-white text-center py-2.5 rounded-full text-xs font-bold mt-2 shadow-md"
              >
                {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// =============================================================
// 6️⃣ NAVBAR DESIGN 6: STANDARD FALLBACK
// =============================================================
function StandardSubBrandNavbar({
  brand,
  isTh,
  toggleLanguage,
}: {
  brand: SubsidiaryBrand;
  isTh: boolean;
  toggleLanguage: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg py-3 px-4 md:px-6 border-b border-slate-200/80"
          : "bg-slate-950/60 backdrop-blur-sm py-4 px-4 md:px-8 border-b border-white/10"
      }`}
    >
      <div ref={menuRef} className="max-w-7xl mx-auto flex flex-col justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className={`text-xs font-mono font-bold flex items-center space-x-1 transition-colors ${
                isScrolled ? "text-slate-500 hover:text-slate-900" : "text-slate-300 hover:text-white"
              }`}
            >
              <span>{isTh ? "← หน้าหลักกลุ่ม" : "← Group Home"}</span>
            </Link>
            <div className={`h-4 w-[1px] ${isScrolled ? "bg-slate-300" : "bg-white/20"}`} />
            <Link href={brand.path} className="flex items-center space-x-2 sm:space-x-2.5">
              <img src={brand.logo} alt={brand.name} className="h-7 md:h-10 w-auto object-contain" />
              <span
                className={`font-black text-xs md:text-sm tracking-tight ${
                  isScrolled ? "text-slate-900" : "text-white"
                }`}
              >
                {brand.name}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("overview")}
              className={`transition-colors hover:text-orange-500 cursor-pointer ${
                isScrolled ? "text-slate-700" : "text-slate-200"
              }`}
            >
              {isTh ? "ภาพรวม" : "Overview"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("companyprofile")}
              className={`transition-colors hover:text-orange-500 cursor-pointer ${
                isScrolled ? "text-slate-700" : "text-slate-200"
              }`}
            >
              {isTh ? "เอกสารบริษัท" : "Company Profile"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Our service")}
              className={`transition-colors hover:text-orange-500 cursor-pointer ${
                isScrolled ? "text-slate-700" : "text-slate-200"
              }`}
            >
              {isTh ? "ขีดความสามารถ" : "Capabilities"}
            </button>
            <button
              type="button"
              onPointerDown={() => handleScrollToSection("Contact Us")}
              className={`transition-colors hover:text-orange-500 cursor-pointer ${
                isScrolled ? "text-slate-700" : "text-slate-200"
              }`}
            >
              {isTh ? "ติดต่อเรา" : "Contact Us"}
            </button>
            <Link
              href="/"
              className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md shadow-orange-600/20"
            >
              {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`md:hidden p-2 focus:outline-none cursor-pointer ${
              isScrolled ? "text-slate-900" : "text-white"
            }`}
          >
            <i className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
          </button>
        </div>

        {/* 📱 Mobile Dropdown */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden pt-4 pb-2 border-t mt-3 flex flex-col space-y-2 overflow-hidden ${
                isScrolled ? "border-slate-200" : "border-white/10"
              }`}
            >
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("overview", () => setIsMobileOpen(false))}
                className={`text-left text-xs font-bold uppercase py-2 px-3 rounded-lg cursor-pointer w-full ${
                  isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {isTh ? "ภาพรวม" : "Overview"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("companyprofile", () => setIsMobileOpen(false))}
                className={`text-left text-xs font-bold uppercase py-2 px-3 rounded-lg cursor-pointer w-full ${
                  isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {isTh ? "เอกสารบริษัท" : "Company Profile"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Our service", () => setIsMobileOpen(false))}
                className={`text-left text-xs font-bold uppercase py-2 px-3 rounded-lg cursor-pointer w-full ${
                  isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {isTh ? "ขีดความสามารถ" : "Capabilities"}
              </button>
              <button
                type="button"
                onPointerDown={() => handleScrollToSection("Contact Us", () => setIsMobileOpen(false))}
                className={`text-left text-xs font-bold uppercase py-2 px-3 rounded-lg cursor-pointer w-full ${
                  isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {isTh ? "ติดต่อเรา" : "Contact Us"}
              </button>
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="bg-orange-600 text-white text-center py-2.5 rounded-full text-xs font-bold mt-2 shadow-md shadow-orange-600/20"
              >
                {isTh ? "แฮนเดิล กรุ๊ป ↗" : "Handle Group ↗"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
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
      if (savedLang) {
        setLang(savedLang);
      } else {
        setLang("en");
      }
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
    case "/siam-liners":
      return <SiamLinersNavbar brand={brand} isTh={isTh} toggleLanguage={toggleLanguage} />;
    default:
      return <StandardSubBrandNavbar brand={brand} isTh={isTh} toggleLanguage={toggleLanguage} />;
  }
}