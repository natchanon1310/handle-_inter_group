export interface SubsidiaryBrand {
  id: string;
  name: string;
  logo: string;
  primaryColor: string; // สีธีมหลักของบริษัท เช่น 'orange-600', 'blue-600'
  accentColor: string;
  path: string;
  phone: string;
  email: string;
  address: string;
  navLinks: { label: string; href: string }[];
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
    address: "Bangkok & Worldwide Freight Hub",
    navLinks: [
      { label: "Overview", href: "#overview" },
      { label: "Capabilities", href: "#capabilities" },
      { label: "Contact Us", href: "#contact-card" },
    ],
  },
  "/handle-inter-consolidation": {
    id: "handle-inter-consolidation",
    name: "HANDLE INTER CONSOLIDATION CO., LTD.",
    logo: "/images/logo3.png",
    primaryColor: "blue-600",
    accentColor: "sky-500",
    path: "/handle-inter-consolidation",
    phone: "0-2393-2300",
    email: "consolidation@handleintergroup.com",
    address: "LCL Warehouse & Container Consolidation Hub",
    navLinks: [
      { label: "Overview", href: "#overview" },
      { label: "LCL Hub", href: "#lcl-hub" },
      { label: "Warehouse", href: "#warehouse" },
      { label: "Contact", href: "#contact" },
    ],
  },
  "/handle-inter-freight-logistics": {
    id: "handle-inter-freight-logistics",
    name: "HANDLE INTER FREIGHT LOGISTICS CO., LTD.",
    logo: "/images/logo2.png",
    primaryColor: "emerald-600",
    accentColor: "green-500",
    path: "/handle-inter-freight-logistics",
    phone: "0-2393-2300",
    email: "logistics@handleintergroup.com",
    address: "Fleet Trucking & Domestic Transport Center",
    navLinks: [
      { label: "Overview", href: "#overview" },
      { label: "Fleet Services", href: "#fleet" },
      { label: "Contact", href: "#contact" },
    ],
  },
  "/console-link": {
    id: "console-link",
    name: "CONSOLE LINK CO., LTD.",
    logo: "/images/logo4.png",
    primaryColor: "indigo-600",
    accentColor: "violet-500",
    path: "/console-link",
    phone: "0-2393-2300",
    email: "tech@consolelink.com",
    address: "Digital Freight Platform & Logistics IT",
    navLinks: [
      { label: "Platform", href: "#platform" },
      { label: "Features", href: "#features" },
      { label: "Support", href: "#contact" },
    ],
  },
  "/siam-liners": {
    id: "siam-liners",
    name: "SIAM LINERS CO., LTD.",
    logo: "/images/logo5.png",
    primaryColor: "cyan-700",
    accentColor: "teal-500",
    path: "/siam-liners",
    phone: "0-2393-2300",
    email: "liners@siamliners.com",
    address: "NVOCC Liner & Feeder Operations Hub",
    navLinks: [
      { label: "Schedules", href: "#schedules" },
      { label: "Routes", href: "#routes" },
      { label: "Contact", href: "#contact" },
    ],
  },
};