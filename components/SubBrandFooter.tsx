"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SubsidiaryBrand } from "../app/config/subsidiariesConfig";
import { dictionary } from "../app/utils/dictionaries";

export default function SubBrandFooter({ brand }: { brand: SubsidiaryBrand }) {
  const [lang, setLang] = useState<"en" | "th">("en");

  // ฟังเหตุการณ์ langChange เพื่ออัปเดตภาษา
  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("lang") as "en" | "th";
      if (savedLang) setLang(savedLang);
    };
    checkLang();
    window.addEventListener("langChange", checkLang);
    return () => window.removeEventListener("langChange", checkLang);
  }, []);

  const t = dictionary[lang] || dictionary.en;
  const isTh = lang === "th";

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 relative z-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Company Info */}
        <div className="md:col-span-5 space-y-4">
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-12 w-auto object-contain brightness-0 invert"
          />
          <h3 className="text-white font-black text-lg tracking-tight">
            {brand.name}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            {brand.address}
          </p>
          <span className="inline-block text-[10px] font-mono uppercase bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-orange-400">
            {isTh
              ? "บริษัทในเครือ แฮนเดิล อินเตอร์ กรุ๊ป"
              : "A Member of Handle Inter Group"}
          </span>
        </div>

        {/* Quick Contact */}
        <div className="md:col-span-4 space-y-3 text-xs">
          <h4 className="text-white font-bold uppercase text-xs tracking-widest font-mono">
            {isTh ? "ข้อมูลติดต่อตรง" : "Direct Contact"}
          </h4>
          <p className="flex items-center space-x-2">
            <span className="text-orange-500 font-mono font-bold">TEL:</span>
            <a
              href={`tel:${brand.phone}`}
              className="hover:text-white transition-colors"
            >
              {brand.phone}
            </a>
          </p>
          <p className="flex items-center space-x-2">
            <span className="text-orange-500 font-mono font-bold">EMAIL:</span>
            <a
              href={`mailto:${brand.email}`}
              className="hover:text-white transition-colors"
            >
              {brand.email}
            </a>
          </p>
        </div>

        {/* Group Navigation */}
        <div className="md:col-span-3 space-y-3 text-xs">
          <h4 className="text-white font-bold uppercase text-xs tracking-widest font-mono">
            {isTh ? "ศูนย์กลางกลุ่มบริษัท" : "Group Hub"}
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                {isTh ? "หน้าหลักกลุ่มบริษัท ↗" : "Main Group Homepage ↗"}
              </Link>
            </li>
            <li>
              <Link
                href="/aboutus"
                className="hover:text-white transition-colors"
              >
                {isTh ? "เกี่ยวกับ แฮนเดิล อินเตอร์ กรุ๊ป" : "About Handle Inter Group"}
              </Link>
            </li>
            <li>
              <Link
                href="/contactus"
                className="hover:text-white transition-colors"
              >
                {isTh ? "ติดต่อสำนักงานใหญ่" : "Contact Headquarters"}
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between text-[11px] font-mono text-slate-500">
        <p>© 2026 {brand.name}. All Rights Reserved.</p>
        <p>
          {isTh
            ? "เครือข่ายโลจิสติกส์ แฮนเดิล อินเตอร์ กรุ๊ป"
            : "Handle Inter Group Member Network"}
        </p>
      </div>
    </footer>
  );
}