// app/config/subsidiariesConfig.ts

export interface NavLink {
  label: string;
  href: string;
}

export interface MultiLangString {
  en: string;
  th: string;
}

export interface MultiLangNavLinks {
  en: NavLink[];
  th: NavLink[];
}

export interface SubsidiaryBrand {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  path: string;
  phone: string;
  email: string;
  address: MultiLangString;
  navLinks: MultiLangNavLinks;
}

export const subsidiariesConfig: Record<string, SubsidiaryBrand> = {
  "/H-I-T-INTERCON": {
    id: "hit-intercon",
    name: "H.I.T. INTERCON CO., LTD.",
    logo: "/images/1725e41.png",
    primaryColor: "orange-600",
    accentColor: "orange-500",
    path: "/H-I-T-INTERCON",
    phone: "0-2393-2300",
    email: "hitcenter@handleintergroup.com",
    address: {
      en: "Bangkok & Worldwide Freight Hub",
      th: "กรุงเทพฯ และศูนย์กลางการขนส่งสินค้าระดับโลก",
    },
    navLinks: {
      en: [
        { label: "Overview", href: "#overview" },
        { label: "Companyprofile", href: "#companyprofile" },
        { label: "Capabilities", href: "#Our service" },
        { label: "Contact Us", href: "#Contact Us" },
      ],
      th: [
        { label: "ภาพรวม", href: "#overview" },
        { label: "เอกสารบริษัท", href: "#companyprofile" },
        { label: "ขีดความสามารถ", href: "#Our service" },
        { label: "ติดต่อเรา", href: "#Contact Us" },
      ],
    },
  },

  "/handle-inter-consolidation": {
    id: "handle-inter-consolidation",
    name: "HANDLE INTER CONSOLIDATION CO., LTD.",
    logo: "/images/handle inter con.png",
    primaryColor: "blue-600",
    accentColor: "sky-500",
    path: "/handle-inter-consolidation",
    phone: "0-2393-2300",
    email: "consolidation@handleintergroup.com",
    address: {
      en: "LCL Warehouse & Container Consolidation Hub",
      th: "ศูนย์รวมคลังสินค้า LCL และการรวมตู้คอนเทนเนอร์",
    },
    navLinks: {
      en: [
        { label: "Overview", href: "#overview" },
        { label: "Companyprofile", href: "#companyprofile" },
        { label: "Capabilities", href: "#Our service" },
        { label: "Contact Us", href: "#Contact Us" },
      ],
      th: [
        { label: "ภาพรวม", href: "#overview" },
        { label: "เอกสารบริษัท", href: "#companyprofile" },
        { label: "ขีดความสามารถ", href: "#Our service" },
        { label: "ติดต่อเรา", href: "#Contact Us" },
      ],
    },
  },

  "/handle-inter-logistics": {
    id: "handle-inter-logistics",
    name: "HANDLE INTER LOGISTICS CO., LTD.",
    logo: "/images/handle inter logistic.png",
    primaryColor: "emerald-600",
    accentColor: "green-500",
    path: "/handle-inter-logistics",
    phone: "0-2393-2300",
    email: "logistics@handleintergroup.com",
    address: {
      en: "Fleet Trucking & Domestic Transport Center",
      th: "ศูนย์บริการฟลีทรถบรรทุกและการขนส่งภายในประเทศ",
    },
    navLinks: {
      en: [
        { label: "Overview", href: "#overview" },
        { label: "Companyprofile", href: "#companyprofile" },
        { label: "Capabilities", href: "#Our service" },
        { label: "Contact Us", href: "#Contact Us" },
      ],
      th: [
        { label: "ภาพรวม", href: "#overview" },
        { label: "เอกสารบริษัท", href: "#companyprofile" },
        { label: "ขีดความสามารถ", href: "#Our service" },
        { label: "ติดต่อเรา", href: "#Contact Us" },
      ],
    },
  },

  "/console-link": {
    id: "console-link",
    name: "CONSOLE LINK CO., LTD.",
    logo: "/images/consol-link.png",
    primaryColor: "indigo-600",
    accentColor: "violet-500",
    path: "/console-link",
    phone: "0-2393-2300",
    email: "tech@consolelink.com",
    address: {
      en: "Digital Freight Platform & Logistics IT",
      th: "แพลตฟอร์มขนส่งดิจิทัลและไอทีโลจิสติกส์",
    },
    navLinks: {
      en: [
        { label: "Overview", href: "#overview" },
        { label: "Companyprofile", href: "#companyprofile" },
        { label: "Capabilities", href: "#Our service" },
        { label: "Contact Us", href: "#Contact Us" },
      ],
      th: [
        { label: "ภาพรวม", href: "#overview" },
        { label: "เอกสารบริษัท", href: "#companyprofile" },
        { label: "ขีดความสามารถ", href: "#Our service" },
        { label: "ติดต่อเรา", href: "#Contact Us" },
      ],
    },
  },

  "/siam-liners": {
    id: "siam-liners",
    name: "SIAM LINERS CO., LTD.",
    logo: "/images/siam liner.png",
    primaryColor: "cyan-700",
    accentColor: "teal-500",

    // ✅ แก้จาก /images/siam liner.png
    path: "/siam-liners",

    phone: "0-2393-2300",
    email: "liners@siamliners.com",
    address: {
      en: "NVOCC Liner & Feeder Operations Hub",
      th: "ศูนย์ปฏิบัติการสายการเดินเรือ NVOCC และ Feeder",
    },
    navLinks: {
      en: [
        { label: "Overview", href: "#overview" },
        { label: "Capabilities", href: "#Our service" },
        { label: "Contact Us", href: "#Contact Us" },
      ],
      th: [
        { label: "ภาพรวม", href: "#overview" },
        { label: "ขีดความสามารถ", href: "#Our service" },
        { label: "ติดต่อเรา", href: "#Contact Us" },
      ],
    },
  },

  // =====================================================
  // ALL INTER GLOBAL
  // =====================================================

  "/ALL-INTER-GLOBAL-COMPANY-LIMITED": {
    id: "all-inter-global",
    name: "ALL INTER GLOBAL COMPANY LIMITED",
    logo: "/images/ALL-INTER-GLOBAL.png",
    primaryColor: "slate-900",
    accentColor: "amber-600",
    path: "/ALL-INTER-GLOBAL-COMPANY-LIMITED",
    phone: "0-2393-2300",
    email: "info@allinterglobal.com",
    address: {
      en: "Thailand & Global Logistics Network",
      th: "เครือข่ายโลจิสติกส์ประเทศไทยและทั่วโลก",
    },
    navLinks: {
      en: [
        { label: "Overview", href: "#overview" },
        { label: "Company Profile", href: "#companyprofile" },
        { label: "Services", href: "#Our service" },
        { label: "Contact Us", href: "#Contact Us" },
      ],
      th: [
        { label: "ภาพรวม", href: "#overview" },
        { label: "ข้อมูลบริษัท", href: "#companyprofile" },
        { label: "บริการ", href: "#Our service" },
        { label: "ติดต่อเรา", href: "#Contact Us" },
      ],
    },
  },
};

// =====================================================
// Helper Function
// =====================================================

export function getSubsidiaryBrand(path: string, isTh: boolean) {
  const normalizedPath = path.replace(/\/+$/, "");

  const brand =
    subsidiariesConfig[normalizedPath] ||
    Object.values(subsidiariesConfig).find(
      (item) =>
        item.path.replace(/\/+$/, "").toLowerCase() ===
        normalizedPath.toLowerCase()
    );

  if (!brand) return null;

  const lang = isTh ? "th" : "en";

  return {
    ...brand,
    address:
      typeof brand.address === "string"
        ? brand.address
        : brand.address[lang],
    navLinks: Array.isArray(brand.navLinks)
      ? brand.navLinks
      : brand.navLinks[lang],
  };
}