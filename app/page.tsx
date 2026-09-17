"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { dictionary } from "./utils/dictionaries";

interface LogoItem {
  name: string;
  src: string;
  link: string;
}

// 🎬 Component ตัวอักษรโผล่มาทีละตัว
function TextReveal({ 
  text, 
  className = "", 
  delayStep = 0.035,
  lang = "en"
}: { 
  text: string; 
  className?: string; 
  delayStep?: number;
  lang?: "en" | "th";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const wordsAndChars = useMemo(() => {
    if (!text) return [];

    if (isMounted && typeof window !== "undefined" && "Segmenter" in Intl) {
      const wordSegmenter = new Intl.Segmenter(lang === "th" ? "th" : "en", { granularity: "word" });
      const charSegmenter = new Intl.Segmenter(lang === "th" ? "th" : "en", { granularity: "grapheme" });

      const wordSegments = Array.from(wordSegmenter.segment(text));
      
      return wordSegments.map((w) => {
        const chars = Array.from(charSegmenter.segment(w.segment)).map((c) => c.segment);
        return {
          word: w.segment,
          isSpace: w.segment.trim() === "",
          chars,
        };
      });
    }

    return text.split(" ").map((w) => ({
      word: w,
      isSpace: false,
      chars: w.split(""),
    }));
  }, [text, lang, isMounted]);

  let globalCharIndex = 0;

  return (
    <div ref={containerRef} className={`inline-block overflow-hidden leading-tight ${className}`}>
      {wordsAndChars.map((item, wordIdx) => {
        if (item.isSpace) {
          return <span key={wordIdx} className="inline-block">&nbsp;</span>;
        }

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {item.chars.map((char) => {
              const currentIndex = globalCharIndex;
              globalCharIndex++;
              return (
                <span
                  key={currentIndex}
                  style={{
                    transitionDelay: `${currentIndex * delayStep}s`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible 
                      ? "translateY(0) rotateX(0deg) scale(1)" 
                      : "translateY(120%) rotateX(60deg) scale(0.8)",
                  }}
                  className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu origin-bottom"
                >
                  {char}
                </span>
              );
            })}
            {lang === "en" && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </div>
  );
}

// 🎬 3D Tilt Wrapper
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
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
      className={`will-change-transform ${className || ""}`}
    >
      {children}
    </div>
  );
}

// =========================================================================
// 🎨 PROCEDURAL TEXTURES GENERATORS
// =========================================================================

function createSteelPlateHullTexture(isPortSide = true): { colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const width = 2048;
  const height = 512;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#141920";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(40, 50, 60, 0.4)";
  ctx.lineWidth = 3;
  for (let x = 0; x < width; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    for (let y = 8; y < height; y += 24) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(x - 1, y, 2, 2);
    }
  }

  for (let y = 0; y < height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for (let i = 0; i < 70; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * 80 + 40;
    const rLen = Math.random() * 260 + 80;
    const rW = Math.random() * 8 + 3;

    const rGrad = ctx.createLinearGradient(rx, ry, rx, ry + rLen);
    rGrad.addColorStop(0, "rgba(140, 55, 22, 0.65)");
    rGrad.addColorStop(0.4, "rgba(100, 40, 18, 0.35)");
    rGrad.addColorStop(1, "rgba(20, 25, 32, 0)");
    ctx.fillStyle = rGrad;
    ctx.fillRect(rx, ry, rW, rLen);
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 900 78px 'Arial Black', Impact, sans-serif";
  ctx.textAlign = isPortSide ? "left" : "right";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 6;
  ctx.fillText("SANTA RAFAELA", isPortSide ? 180 : width - 180, 230);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px monospace";
  for (let d = 0; d < 8; d++) {
    ctx.fillText(`${14 - d}M`, isPortSide ? 50 : width - 90, 480 - d * 36);
  }

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bctx = bumpCanvas.getContext("2d")!;

  bctx.fillStyle = "#808080";
  bctx.fillRect(0, 0, width, height);

  bctx.strokeStyle = "#404040";
  bctx.lineWidth = 4;
  for (let x = 0; x < width; x += 128) {
    bctx.beginPath();
    bctx.moveTo(x, 0);
    bctx.lineTo(x, height);
    bctx.stroke();
  }
  for (let y = 0; y < height; y += 64) {
    bctx.beginPath();
    bctx.moveTo(0, y);
    bctx.lineTo(width, y);
    bctx.stroke();
  }

  bctx.fillStyle = "#ffffff";
  bctx.font = "italic 900 78px 'Arial Black', Impact, sans-serif";
  bctx.textAlign = isPortSide ? "left" : "right";
  bctx.textBaseline = "middle";
  bctx.fillText("SANTA RAFAELA", isPortSide ? 180 : width - 180, 230);

  const colorMap = new THREE.CanvasTexture(canvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);

  return { colorMap, bumpMap };
}

function createOceanWaveNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#8080ff";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const rx = Math.random() * 30 + 10;
    const ry = Math.random() * 8 + 3;
    const rot = Math.random() * Math.PI;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, rx);
    grad.addColorStop(0, "rgba(180, 120, 255, 0.45)");
    grad.addColorStop(0.5, "rgba(100, 140, 255, 0.2)");
    grad.addColorStop(1, "rgba(128, 128, 255, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

function createBrandContainerTexture(brand: "MAERSK" | "UASC" | "SAMSKIP" | "PLAIN_RED" | "PLAIN_BLUE") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  let bgColor = "#8a3a1b";
  let textColor = "#ffffff";

  if (brand === "MAERSK") {
    bgColor = "#edf2f7";
    textColor = "#0284c7";
  } else if (brand === "UASC") {
    bgColor = "#3d7a46";
    textColor = "#ffffff";
  } else if (brand === "SAMSKIP") {
    bgColor = "#1e3a8a";
    textColor = "#ffffff";
  } else if (brand === "PLAIN_BLUE") {
    bgColor = "#1d4ed8";
  }

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 512, 256);

  for (let x = 0; x < 512; x += 16) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(x, 0, 8, 256);
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(x + 8, 0, 8, 256);
  }

  if (brand === "MAERSK" || brand === "UASC" || brand === "SAMSKIP") {
    ctx.fillStyle = textColor;
    ctx.font = "900 64px 'Arial Black', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(brand, 256, 128);

    if (brand === "MAERSK") {
      ctx.font = "40px sans-serif";
      ctx.fillText("★", 80, 128);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// =========================================================================
// 🚢 R3F 3D SUB-COMPONENTS (Section 2)
// =========================================================================

function R3FSkyDome() {
  const skyMeshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0.0, "#1c6096");
    gradient.addColorStop(0.35, "#4088bc");
    gradient.addColorStop(0.65, "#7eb4d8");
    gradient.addColorStop(0.85, "#bbdcf0");
    gradient.addColorStop(1.0, "#e3f2fd");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (skyMeshRef.current) {
      skyMeshRef.current.rotation.y += delta * 0.004;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={skyMeshRef}>
      <sphereGeometry args={[650, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function R3FClouds() {
  const cloudGroupRef = useRef<THREE.Group>(null);

  const clusters = useMemo(() => {
    return Array.from({ length: 24 }).map((_, c) => {
      const angle = (c / 24) * Math.PI * 2 + (Math.random() * 0.2);
      const dist = Math.random() * 110 + 190;
      const x = Math.cos(angle) * dist;
      const y = Math.random() * 45 + 70;
      const z = Math.sin(angle) * dist;

      const puffs = Array.from({ length: Math.floor(Math.random() * 6) + 6 }).map(() => ({
        radius: Math.random() * 16 + 12,
        px: (Math.random() - 0.5) * 45,
        py: (Math.random() - 0.5) * 10,
        pz: (Math.random() - 0.5) * 30,
      }));

      return { x, y, z, puffs };
    });
  }, []);

  useFrame((_, delta) => {
    if (cloudGroupRef.current) {
      cloudGroupRef.current.rotation.y += delta * 0.006;
    }
  });

  return (
    <group ref={cloudGroupRef}>
      {clusters.map((cluster, ci) => (
        <group key={ci} position={[cluster.x, cluster.y, cluster.z]}>
          {cluster.puffs.map((puff, pi) => (
            <mesh key={pi} position={[puff.px, puff.py, puff.pz]} scale={[1.45, 0.75, 1.05]}>
              <sphereGeometry args={[puff.radius, 14, 14]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.9}
                metalness={0.05}
                transparent
                opacity={0.88}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function R3FOcean() {
  const geoRef = useRef<THREE.PlaneGeometry>(null);
  const waveNormal = useMemo(() => (typeof window !== "undefined" ? createOceanWaveNormalTexture() : null), []);

  const initialPositions = useMemo(() => {
    const tempGeo = new THREE.PlaneGeometry(800, 800, 140, 140);
    const arr = (tempGeo.attributes.position.array as Float32Array).slice();
    tempGeo.dispose();
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!geoRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = geoRef.current.attributes.position;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < posArr.length; i += 3) {
      const u = initialPositions[i];
      const v = initialPositions[i + 1];
      posArr[i + 2] =
        Math.sin(u * 0.04 + t * 1.7) * 0.48 +
        Math.cos(v * 0.035 + t * 1.4) * 0.42;
    }
    posAttr.needsUpdate = true;
    geoRef.current.computeVertexNormals();

    if (waveNormal) {
      waveNormal.offset.x = (t * 0.015) % 1;
      waveNormal.offset.y = (t * 0.02) % 1;
    }
  });

  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.6, 70]}>
      <planeGeometry ref={geoRef} args={[800, 800, 140, 140]} />
      <meshPhysicalMaterial
        color="#0284c7"
        normalMap={waveNormal || undefined}
        normalScale={new THREE.Vector2(0.45, 0.45)}
        roughness={0.12}
        metalness={0.85}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        reflectivity={0.9}
        flatShading={false}
      />
    </mesh>
  );
}

// 🚢 เรือ "SANTA RAFAELA" ปรับปรุงโครงสร้างหัวเรือให้แนบสนิทกับตัวเรือ 100%
function R3FShipModel({ radarRef }: { radarRef: React.RefObject<THREE.Mesh | null> }) {
  const portTextures = useMemo(() => (typeof window !== "undefined" ? createSteelPlateHullTexture(true) : { colorMap: null, bumpMap: null }), []);
  const stbdTextures = useMemo(() => (typeof window !== "undefined" ? createSteelPlateHullTexture(false) : { colorMap: null, bumpMap: null }), []);

  const maerskTex = useMemo(() => (typeof window !== "undefined" ? createBrandContainerTexture("MAERSK") : null), []);
  const uascTex = useMemo(() => (typeof window !== "undefined" ? createBrandContainerTexture("UASC") : null), []);
  const samskipTex = useMemo(() => (typeof window !== "undefined" ? createBrandContainerTexture("SAMSKIP") : null), []);
  const plainRedTex = useMemo(() => (typeof window !== "undefined" ? createBrandContainerTexture("PLAIN_RED") : null), []);
  const plainBlueTex = useMemo(() => (typeof window !== "undefined" ? createBrandContainerTexture("PLAIN_BLUE") : null), []);

  const foamTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.25, "rgba(255, 255, 255, 0.75)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // 📐 1. หัวเรือส่วนบนสีดำ แนบสนิทกับขอบลำเรือหลักพอดีเป๊ะ
  const seamlessBowUpperGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const length = 9.5;
    const height = 3.2;
    const halfWidth = 4.3;

    const vertices = new Float32Array([
      // กราบซ้าย
      -halfWidth, height / 2, 0,
      0, height / 2, length,
      0, -height / 2, length * 0.85,

      -halfWidth, height / 2, 0,
      0, -height / 2, length * 0.85,
      -halfWidth, -height / 2, 0,

      // กราบขวา
      halfWidth, height / 2, 0,
      0, -height / 2, length * 0.85,
      0, height / 2, length,

      halfWidth, height / 2, 0,
      halfWidth, -height / 2, 0,
      0, -height / 2, length * 0.85,

      // ฝาดาดฟ้าบน
      -halfWidth, height / 2, 0,
      halfWidth, height / 2, 0,
      0, height / 2, length,

      // ท้องเชื่อมด้านล่าง
      -halfWidth, -height / 2, 0,
      0, -height / 2, length * 0.85,
      halfWidth, -height / 2, 0,
    ]);

    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 📐 2. หัวเรือส่วนล่างสีแดงใต้แนวน้ำ แนบสนิทกับท้องเรือ
  const seamlessBowLowerGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const length = 8.0;
    const height = 2.2;
    const halfWidth = 4.2;

    const vertices = new Float32Array([
      // ซ้ายล่าง
      -halfWidth, height / 2, 0,
      0, height / 2, length,
      0, -height / 2, length * 0.7,

      -halfWidth, height / 2, 0,
      0, -height / 2, length * 0.7,
      -halfWidth * 0.4, -height / 2, 0,

      // ขวาล่าง
      halfWidth, height / 2, 0,
      0, -height / 2, length * 0.7,
      0, height / 2, length,

      halfWidth, height / 2, 0,
      halfWidth * 0.4, -height / 2, 0,
      0, -height / 2, length * 0.7,
    ]);

    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const containerStacks = useMemo(() => {
    const cWidth = 1.40;
    const cHeight = 1.15;
    const cLength = 4.3;
    const items: Array<{
      pos: [number, number, number];
      texture: THREE.CanvasTexture | null;
    }> = [];

    for (let bay = -3; bay <= 3; bay++) {
      const zBase = bay * (cLength + 0.35) + 2.0;

      for (let r = -2; r <= 2; r++) {
        const maxHeight = bay === 3 ? (Math.abs(r) === 2 ? 1 : 2) : 3;

        for (let h = 0; h < maxHeight; h++) {
          let chosenTex = plainRedTex;

          if (bay === 2 && h === 1 && r === 0) chosenTex = uascTex;
          else if (bay === 1 && h === 2 && r === -1) chosenTex = uascTex;
          else if (bay === 0 && h === 0 && r === 1) chosenTex = samskipTex;
          else if (bay === -1 && h === 1 && r === 0) chosenTex = maerskTex;
          else if (bay === -2 && h === 0 && r === -1) chosenTex = maerskTex;
          else if (bay === 3 && h === 0) chosenTex = uascTex;
          else if (h === 0) chosenTex = plainBlueTex;

          items.push({
            pos: [r * cWidth, 6.25 + h * cHeight, zBase],
            texture: chosenTex,
          });
        }
      }
    }

    return items;
  }, [maerskTex, uascTex, samskipTex, plainRedTex, plainBlueTex]);

  return (
    <group>
      {/* 1. ท้องเรือใต้แนวน้ำสีแดง */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[8.4, 2.2, 50.0]} />
        <meshStandardMaterial color="#7d2417" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* เส้น Waterline ขาว */}
      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[8.55, 0.22, 50.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 2. ตัวเรือเหล็กกล้าสีดำ */}
      <mesh castShadow receiveShadow position={[0, 3.95, 0]}>
        <boxGeometry args={[8.6, 3.2, 50.0]} />
        <meshStandardMaterial attach="material-0" color="#12161b" roughness={0.4} metalness={0.3} />
        <meshStandardMaterial attach="material-1" color="#12161b" roughness={0.4} metalness={0.3} />
        <meshStandardMaterial attach="material-2" color="#12161b" roughness={0.4} metalness={0.3} />
        <meshStandardMaterial attach="material-3" color="#12161b" roughness={0.4} metalness={0.3} />
        <meshStandardMaterial
          attach="material-4"
          map={portTextures.colorMap || undefined}
          bumpMap={portTextures.bumpMap || undefined}
          bumpScale={0.08}
          roughness={0.45}
          metalness={0.25}
        />
        <meshStandardMaterial
          attach="material-5"
          map={stbdTextures.colorMap || undefined}
          bumpMap={stbdTextures.bumpMap || undefined}
          bumpScale={0.08}
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>

      {/* 3. ดาดฟ้าเรือ */}
      <mesh receiveShadow position={[0, 5.65, 0]}>
        <boxGeometry args={[8.3, 0.22, 49.6]} />
        <meshStandardMaterial color="#8a3f2b" roughness={0.75} />
      </mesh>

      {/* 4. โครงสร้างหัวเรือ Bow Structure แนบสนิทกับตัวเรือ */}
      <group position={[0, 0, 25.0]}>
        {/* Bulbous Bow ใต้น้ำ */}
        <mesh castShadow position={[0, 0.85, 7.0]} scale={[0.85, 1.25, 3.4]}>
          <sphereGeometry args={[1.35, 28, 24]} />
          <meshStandardMaterial color="#7d2417" roughness={0.55} metalness={0.15} />
        </mesh>

        {/* ฐานหัวเรือแดงใต้แนวน้ำ */}
        <mesh castShadow receiveShadow geometry={seamlessBowLowerGeometry} position={[0, 1.1, 0]}>
          <meshStandardMaterial color="#7d2417" roughness={0.65} metalness={0.15} side={THREE.DoubleSide} />
        </mesh>

        {/* กาบหัวเรือสีดำผายออก */}
        <mesh castShadow receiveShadow geometry={seamlessBowUpperGeometry} position={[0, 3.95, 0]}>
          <meshStandardMaterial
            color="#12161b"
            bumpMap={portTextures.bumpMap || undefined}
            bumpScale={0.06}
            roughness={0.45}
            metalness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* กราบเรือยกขอบกันตก (Bulwark) */}
        <mesh castShadow position={[-2.2, 5.95, 4.5]} rotation={[0, 0.42, 0]}>
          <boxGeometry args={[0.15, 0.7, 9.6]} />
          <meshStandardMaterial color="#12161b" roughness={0.45} metalness={0.25} />
        </mesh>
        <mesh castShadow position={[2.2, 5.95, 4.5]} rotation={[0, -0.42, 0]}>
          <boxGeometry args={[0.15, 0.7, 9.6]} />
          <meshStandardMaterial color="#12161b" roughness={0.45} metalness={0.25} />
        </mesh>

        {/* ราวกั้นสีขาวรอบหัวเรือ */}
        <mesh position={[0, 6.4, 4.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.8, 0.05, 6, 24, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* เสากระโดงหน้าและแท่น Crow's Nest */}
        <group position={[0, 5.65, 8.2]}>
          <mesh castShadow position={[0, 3.2, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 6.4, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 4.6, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.1, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 5.0, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.8, 8, 1, true]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} wireframe />
          </mesh>
          <mesh castShadow position={[0, 6.8, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 2.8, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* 5. เก๋งสะพานเดินเรือ */}
      <group position={[0, 5.65, -17.5]}>
        <mesh castShadow position={[0, 2.4, 0]}>
          <boxGeometry args={[7.6, 4.8, 5.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} />
        </mesh>

        <mesh castShadow position={[0, 5.2, 0.2]}>
          <boxGeometry args={[10.6, 1.2, 2.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} />
        </mesh>

        <mesh position={[0, 5.3, 0.25]}>
          <boxGeometry args={[10.65, 0.45, 2.85]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        <group position={[0, 6.2, 0]}>
          <mesh castShadow position={[0, 2.6, 0]}>
            <cylinderGeometry args={[0.12, 0.22, 5.2, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 3.8, 0]}>
            <boxGeometry args={[3.2, 0.12, 0.15]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 4.8, 0]}>
            <boxGeometry args={[2.0, 0.12, 0.15]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh ref={radarRef} position={[0, 5.4, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* 6. กองตู้คอนเทนเนอร์ */}
      {containerStacks.map((item, idx) => (
        <mesh castShadow receiveShadow key={idx} position={item.pos}>
          <boxGeometry args={[1.40 * 0.94, 1.15 * 0.94, 4.3 * 0.94]} />
          <meshStandardMaterial
            map={item.texture || undefined}
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

// 📦 กล่อง 3D โลโก้ สีขาวคลีน พร้อมระบบแสงเงาและขอบมน
function R3FSingleLogoBox({
  logo,
  position,
  index,
}: {
  logo: LogoItem;
  position: [number, number, number];
  index: number;
}) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const texture = useTexture(logo.src);

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  const roundedBoxGeometry = useMemo(() => {
    const size = 3.8;
    const shape = new THREE.Shape();
    const half = size / 2;
    const radius = 0.5;

    shape.moveTo(-half + radius, -half);
    shape.lineTo(half - radius, -half);
    shape.quadraticCurveTo(half, -half, half, -half + radius);
    shape.lineTo(half, half - radius);
    shape.quadraticCurveTo(half, half, half - radius, half);
    shape.lineTo(-half + radius, half);
    shape.quadraticCurveTo(-half, half, -half, half - radius);
    shape.lineTo(-half, -half + radius);
    shape.quadraticCurveTo(-half, -half, -half + radius, -half);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: size - 0.7,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.35,
      bevelThickness: 0.35,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!boxGroupRef.current) return;
    const t = clock.getElapsedTime();
    boxGroupRef.current.position.y = position[1] + Math.sin(t * 2.0 + index) * 0.18;
    boxGroupRef.current.rotation.y = Math.sin(t * 0.8 + index) * 0.22;
  });

  const glowColor = index % 2 === 0 ? "#f97316" : "#0284c7";

  return (
    <group ref={boxGroupRef} position={position}>
      <mesh castShadow receiveShadow geometry={roundedBoxGeometry}>
        <meshPhysicalMaterial
          color="#f8fafc"
          roughness={0.12}
          metalness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          reflectivity={0.9}
        />
      </mesh>

      <mesh position={[0, 0, 1.95]}>
        <planeGeometry args={[2.7, 2.7]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.2}
          metalness={0.1}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>

      <mesh position={[0, 0, -1.95]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.7, 2.7]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.2}
          metalness={0.1}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>

      <spotLight
        color="#ffffff"
        intensity={2.8}
        distance={20}
        angle={Math.PI / 3.8}
        position={[2.8, 4.5, 3.5]}
      />

      <pointLight color={glowColor} intensity={3.8} distance={14} position={[0, -2.0, 0]} />
    </group>
  );
}

// 📦 Floating 3D Logo Waypoints (ย้ายตำแหน่งออกซ้าย-ขวา ไม่ขวางทางเดินเรือ)
function R3FLogoBoxes({ logos }: { logos: Array<LogoItem> }) {
  const coords: Array<[number, number, number]> = useMemo(
    () => [
      [-18, 3.8, 15],
      [18, 4.2, 34],
      [-19, 3.5, 54],
      [20, 4.0, 72],
      [-17, 3.6, 90],
      [19, 3.8, 106],
    ],
    []
  );

  return (
    <group>
      {logos.map((logo, i) => (
        <R3FSingleLogoBox
          key={i}
          logo={logo}
          position={coords[i % coords.length]}
          index={i}
        />
      ))}
    </group>
  );
}

// ✨ Sea Foam Particles
function R3FParticles() {
  const particles = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 220;
      pos[i + 1] = Math.random() * 25 + 2;
      pos[i + 2] = Math.random() * 280 - 40;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.22} transparent opacity={0.65} />
    </points>
  );
}

// 🎮 R3F World Controller (แล่นตรง + หลบเล็กน้อย + ระบบเมาส์ลากมุมกล้อง)
function R3FSceneContent({
  logos,
  scrollProgressRef,
  dragOffsetRef,
}: {
  logos: Array<LogoItem>;
  scrollProgressRef: React.MutableRefObject<number>;
  dragOffsetRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const shipGroupRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Mesh>(null);
  const warpSpotlightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const p = scrollProgressRef.current;

    if (radarRef.current) {
      radarRef.current.rotation.y = t * 3.5;
    }

    const roll = Math.sin(t * 1.6) * 0.022;
    const pitch = Math.cos(t * 1.3) * 0.015;
    const bobbing = Math.sin(t * 2.0) * 0.16;

    if (!shipGroupRef.current) return;

    // คำนวณออฟเซ็ตจากแรงลากเมาส์ (Smooth Mouse Drag Offset)
    const dragX = dragOffsetRef.current.x;
    const dragY = dragOffsetRef.current.y;

    if (p < 0.70) {
      const t1 = p / 0.70;
      const travelZ = -10.0 + t1 * 118.0;

      // ⚓ เรือแล่นตรงเป็นหลัก และเอี้ยวตัวเบาๆ หลบกล่องโลโก้เพียงเล็กน้อย
      const steerX = Math.sin(t1 * Math.PI * 2.0) * 1.6;
      const steerAngle = Math.cos(t1 * Math.PI * 2.0) * 0.08;

      shipGroupRef.current.position.set(steerX, bobbing, travelZ);
      shipGroupRef.current.rotation.set(pitch, steerAngle, roll - steerAngle * 0.08);

      // กล้องตามถ่ายด้านหลังเรือ พร้อมบวกมุมลากเมาส์ของผู้ใช้
      const defaultCamX = steerX * 0.5;
      const defaultCamY = 12.0 + Math.sin(t1 * Math.PI) * 2.5;
      const defaultCamZ = travelZ - 34.0;

      camera.position.set(defaultCamX + dragX, defaultCamY - dragY, defaultCamZ);
      camera.lookAt(steerX, 4.0, travelZ + 20.0);

      if (warpSpotlightRef.current) warpSpotlightRef.current.intensity = 0;
    } else if (p >= 0.70 && p < 0.84) {
      const t2 = (p - 0.70) / 0.14;
      const currentZ = 108.0;
      const currentX = (1 - t2) * 1.6;
      const turnAngle = t2 * Math.PI;

      shipGroupRef.current.position.set(currentX, bobbing, currentZ);
      shipGroupRef.current.rotation.set(pitch, turnAngle, roll + Math.sin(t2 * Math.PI) * 0.08);

      const defaultCamY = 16.0 - t2 * 11.0;
      const defaultCamZ = currentZ + 32.0;

      camera.position.set(dragX, defaultCamY - dragY, defaultCamZ);
      camera.lookAt(0, 3.5, currentZ);

      if (warpSpotlightRef.current) {
        warpSpotlightRef.current.intensity = t2 * 2.5;
        warpSpotlightRef.current.position.set(0, 8.0, currentZ + 26.0);
        warpSpotlightRef.current.target = shipGroupRef.current;
      }
    } else {
      const t3 = (p - 0.84) / 0.16;
      const warpZ = 108.0 + Math.pow(t3, 2.3) * 155.0;

      shipGroupRef.current.position.set(0, bobbing, warpZ);
      shipGroupRef.current.rotation.set(pitch - t3 * 0.06, Math.PI, roll);

      const shakeX = (Math.random() - 0.5) * t3 * 0.45;
      const shakeY = (Math.random() - 0.5) * t3 * 0.45;
      camera.position.set(shakeX + dragX, 5.0 + shakeY - dragY, 140.0);
      camera.lookAt(0, 3.5, warpZ);

      if (warpSpotlightRef.current) {
        warpSpotlightRef.current.intensity = 5.0 + t3 * 15.0;
      }
    }
  });

  return (
    <>
      <R3FSkyDome />
      <R3FClouds />
      <R3FOcean />
      <R3FParticles />

      <ambientLight color="#e2f1fc" intensity={1.25} />
      <hemisphereLight color="#ffffff" groundColor="#0284c7" intensity={0.9} />
      
      <directionalLight
        castShadow
        color="#fffaf0"
        intensity={3.2}
        position={[65, 110, 80]}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={400}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0004}
      />
      
      <directionalLight color="#0284c7" intensity={1.4} position={[-50, 30, -40]} />

      <spotLight
        ref={warpSpotlightRef}
        color="#ffffff"
        intensity={0}
        distance={200}
        angle={Math.PI / 3.5}
        penumbra={0.3}
        position={[0, 14, 160]}
      />

      <group ref={shipGroupRef}>
        <R3FShipModel radarRef={radarRef} />
      </group>
      <R3FLogoBoxes logos={logos} />
    </>
  );
}

// 🎬 Component การ์ดบริการวิดีโอเต็มใบ
function FullVideoServiceCard({
  idx,
  service,
  desc,
  bgImg,
  videoSrc,
  lang,
  onHoverChange
}: {
  idx: number;
  service: string;
  desc: string;
  bgImg: string;
  videoSrc: string;
  lang: "en" | "th";
  onHoverChange: (isHovered: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <TiltCard className="h-full shrink-0 w-[300px] sm:w-[360px] md:w-[400px]">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative h-[480px] md:h-[520px] w-full rounded-[32px] overflow-hidden bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between p-8 transition-all duration-500 hover:border-orange-500/80 hover:shadow-2xl cursor-pointer select-none"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImg}
            alt={service}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-0 scale-110" : "opacity-75 scale-100"
            }`}
          />

          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-95 scale-105" : "opacity-0 scale-100"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-black/20 z-10" />
        </div>

        <div className="relative z-20 flex justify-between items-center w-full">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-mono text-xs font-bold text-white shadow-sm">
            0{idx + 1}
          </div>
        </div>

        <div className="relative z-20 flex justify-between items-end gap-4 w-full pt-4">
          <div className="space-y-2 max-w-[78%]">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-orange-400 transition-colors">
              <TextReveal text={service} lang={lang} delayStep={0.03} />
            </h3>
            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
              {desc}
            </p>
          </div>

          <div className={`w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg shrink-0 transition-all duration-300 transform ${
            isHovered ? "scale-110 bg-orange-500 rotate-45 shadow-lg shadow-orange-500/40" : "scale-100"
          }`}>
            ↗
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// 🎬 Component การ์ดแบนเนอร์กลุ่มธุรกิจ
function BusinessGroupVideoBannerCard({
  title,
  subtitle,
  videoSrc,
  tag,
  lang = "en",
  surroundingLogos,
}: {
  title: string;
  subtitle: string;
  videoSrc: string;
  tag: string;
  lang?: "en" | "th";
  centerLogo?: { name: string; src?: string; link?: string };
  surroundingLogos?: Array<{ name: string; src: string; link?: string }>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const surroundingItems = useMemo(() => surroundingLogos || [], [surroundingLogos]);
  const totalLogos = surroundingItems.length;

  return (
    <div 
      className="relative w-full min-h-[380px] md:min-h-[440px] rounded-[32px] overflow-hidden border border-slate-300/80 bg-black text-slate-900 shadow-2xl group transition-all duration-500 hover:border-orange-500 hover:shadow-orange-500/30 flex flex-col md:flex-row items-center justify-between"
      onMouseEnter={() => {
        setIsHovered(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
          isHovered ? "scale-105 opacity-100" : "scale-100 opacity-90"
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/70 z-10 pointer-events-none" />

      <div className="relative z-20 w-full h-full p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 my-auto">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] shrink-0 flex items-center justify-center">
          <div className="absolute inset-2 rounded-full border border-white/30 animate-pulse pointer-events-none" />

          {surroundingItems.map((logo, idx) => {
            const radius = 40;
            const angleDegree = -90 + (idx * (360 / Math.max(1, totalLogos)));
            const angleRad = (angleDegree * Math.PI) / 180;

            const topPercent = 50 + radius * Math.sin(angleRad);
            const leftPercent = 50 + radius * Math.cos(angleRad);

            const circleContent = (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: idx % 2 === 0 ? [0, -5, 0] : [0, 5, 0],
                  x: idx % 3 === 0 ? [0, 3, 0] : [0, -3, 0]
                }}
                transition={{
                  opacity: { duration: 0.4, delay: idx * 0.06 },
                  scale: { duration: 0.4, delay: idx * 0.06 },
                  y: { duration: 3 + (idx % 3), repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 3.5 + (idx % 2), repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.18, zIndex: 50 }}
                style={{
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                }}
                className="absolute w-20 h-20 sm:w-24 sm:h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 backdrop-blur-md border-2 border-white shadow-2xl flex items-center justify-center p-2 transition-colors duration-300 hover:bg-white hover:border-orange-500 cursor-pointer group/circle"
                title={logo.name}
              >
                {logo.src ? (
                  <img src={logo.src} alt={logo.name} className="w-full h-full object-contain rounded-full transition-transform group-hover/circle:scale-105" />
                ) : (
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 font-mono text-center leading-tight uppercase px-1">
                    {logo.name}
                  </span>
                )}
              </motion.div>
            );

            return logo.link ? (
              <Link href={logo.link} key={idx}>
                {circleContent}
              </Link>
            ) : (
              <div key={idx}>{circleContent}</div>
            );
          })}
        </div>

        <div className="flex-1 space-y-4 text-left">
          <div className="flex items-center space-x-3">
            <span className="bg-orange-600 text-white font-mono text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md">
              {tag}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md group-hover:text-orange-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed max-w-xl drop-shadow">
              {subtitle}
            </p>
          </div>

          <div className="pt-4">
            <button className="bg-white/20 hover:bg-orange-600 text-white border border-white/40 hover:border-orange-600 px-6 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 shadow-lg backdrop-blur-md cursor-pointer">
              <span>{lang === "th" ? "สำรวจกลุ่มธุรกิจ" : "EXPLORE DIVISION"}</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎬 Component การ์ดบริษัทในเครือ
function CurvedTimelinePartnerCardLocked({
  idx,
  name,
  logoSrc,
  desc,
  link,
  totalItems,
  scrollYProgress,
}: {
  idx: number;
  name: string;
  logoSrc: string;
  desc: string;
  link: string;
  totalItems: number;
  scrollYProgress: any;
}) {
  const step = 1 / totalItems;
  const startProgress = idx * (step * 0.7);
  const endProgress = Math.min(1, startProgress + 0.5);

  const x = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    ["250%", "-270%"]
  );

  const yVal = idx % 2 === 0 ? [40, -60, 30] : [-40, 60, -20];
  const y = useTransform(
    scrollYProgress,
    [startProgress, (startProgress + endProgress) / 2, endProgress],
    yVal
  );

  const opacity = useTransform(
    scrollYProgress,
    [startProgress, startProgress + 0.08, endProgress - 0.08, endProgress],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [startProgress, (startProgress + endProgress) / 2, endProgress],
    [0.85, 1, 0.88]
  );

  return (
    <motion.div
      style={{ x, y, opacity, scale }}
      className="absolute top-1/2 -translate-y-1/2 will-change-transform z-20 pointer-events-auto shrink-0 w-[300px] sm:w-[360px] md:w-[400px]"
    >
      <Link href={link}>
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[32px] border border-white/20 p-8 h-[480px] md:h-[520px] w-full shadow-2xl shadow-black/60 flex flex-col justify-between transition-all duration-500 hover:shadow-orange-500/30 hover:border-orange-500 hover:scale-105 cursor-pointer select-none group">
          <div className="flex justify-between items-center w-full">
            <span className="text-3xl md:text-4xl font-black font-mono text-orange-400 tracking-tighter">
              '{String(idx + 1).padStart(2, "0")}
            </span>
            <span className="bg-orange-500/20 border border-orange-500/30 text-[10px] font-mono text-orange-300 px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
              SUBSIDIARY
            </span>
          </div>

          <div className="my-auto py-4 flex items-center justify-center min-h-[140px] md:min-h-[160px] bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 group-hover:border-orange-500/40 transition-colors">
            <img
              src={logoSrc}
              alt={name}
              className="h-16 md:h-20 w-auto max-w-[85%] object-contain drop-shadow-md transition-all duration-500 group-hover:scale-110"
            />
          </div>

          <div className="space-y-2 text-left w-full">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-orange-400 transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal line-clamp-2">
              {desc}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between w-full">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              EXPLORE HUB
            </span>
            <span className="bg-orange-600 group-hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-1.5 shadow-lg shadow-orange-600/30">
              <span>Read more</span>
              <span className="text-xs group-hover:translate-x-1 transition-transform">↗</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("who-we-are");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [visitedSections, setVisitedSections] = useState<Record<string, boolean>>({ "who-we-are": true });

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // State สำหรับ News Slider การ์ด YouTube
  const [currentNewsPageIndex, setCurrentNewsIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Ref & State สำหรับ Pinned Service Slider (หัวข้อที่ 4)
  const serviceWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState("2500px");
  const [progressRatio, setProgressRatio] = useState(0);

  // Ref & Scroll Engine สำหรับ Worldwide Section (หัวข้อที่ 6)
  const worldwideWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: worldwideScrollProgress } = useScroll({
    target: worldwideWrapperRef,
    offset: ["start end", "end start"],
  });
  
  // ✅ เอา useTransform ออกมาไว้นอก useScroll แบบนี้
  const worldwideX = useTransform(worldwideScrollProgress, [0, 1], ["-40%", "40%"]);
  const worldwideCardOpacity = useTransform(worldwideScrollProgress, [0.4, 0.6], [1, 0]);
  const worldwideCardY = useTransform(worldwideScrollProgress, [0.4, 0.6], [0, -50]);

  // State & Ref สำหรับ Hero Section
  const [heroBlur, setHeroBlur] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroTranslateY, setHeroTranslateY] = useState(0);

  const [isIdle, setIsIdle] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ระบบ Idle Detector
  useEffect(() => {
    const handleUserActivity = () => {
      setIsIdle(false);
      if (heroVideoRef.current) {
        heroVideoRef.current.pause();
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
        if (heroVideoRef.current) {
          heroVideoRef.current.play().catch(() => {});
        }
      }, 2500);
    };

    handleUserActivity();

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, []);

  const t = dictionary[lang] || dictionary.en;

  const sections = useMemo(() => [
    { id: "who-we-are", label: lang === "en" ? "Overview" : "ภาพรวม" },
    { id: "business-groups", label: lang === "en" ? "Business Groups" : "กลุ่มธุรกิจ" },
    { id: "what-we-offer", label: lang === "en" ? "Services" : "บริการ" },
    { id: "worldwide", label: lang === "en" ? "Network" : "เครือข่าย" },
    { id: "news", label: lang === "en" ? "Update" : "ข่าวสาร" },
  ], [lang]);

  const businessGroupBanners = useMemo(() => [
    {
      title: t.businessGroups.freightTitle.replace(/^[0-9.]+\s*/, ""),
      subtitle: t.businessGroups.freightSub,
      videoSrc: "/images/Untitled design.mp4",
      tag: "FREIGHT GROUP",
      logos: [
        { name: "H.I.T. INTERCON", src: "/images/1725e41.png", link: "/H-I-T-INTERCON" },
        { name: "CSL CONSOL LINK", src: "/images/consol-link.png", link: "/console-link" },
        { name: "HANDLE EXPRESS", src: "/images/handleinter express.png", link: "/" },
        { name: "HANDLE LOGISTICS", src: "/images/handle inter logistic.png", link: "/" },
        { name: "ALL INTER GLOBAL", src: "/images/all inter global.png", link: "/" },
        { name: "HANDLE inter CONSOLIDATION", src: "/images/handle inter con.png", link: "/handle-inter-consolidation" }
      ]
    },
    {
      title: t.businessGroups.shippingTitle.replace(/^[0-9.]+\s*/, ""),
      subtitle: t.businessGroups.shippingSub,
      videoSrc: "/images/shipgroup.mp4",
      tag: "SHIPPING GROUP",
      logos: [
        { name: "APS SHIPPING", src: "/images/aps.png", link: "siam-liners" },
        { name: "SIAM LINERS", src: "/images/siam liner.png", link: "siam-liners" },
      ]
    },
    {
      title: t.businessGroups.tradingTitle.replace(/^[0-9.]+\s*/, ""),
      subtitle: t.businessGroups.tradingSub,
      videoSrc: "/images/total trading.mp4",
      tag: "TRADING GROUP",
      logos: [
        { name: "/2 SUPPLLY", src: "/images/2usubply.png", link: "#" },
        { name: "ATE TOOLS", src: "/images/ate.png", link: "#" },
        { name: "APS", src: "/images/aps.png", link: "#" },
        { name: "ALL SUPLY", src: "/images/all suply.png", link: "#" },
      ]
    }
  ], [t]);

  const serviceCardsData = [
    {
      title: lang === "en" ? "Sea Freight" : "ขนส่งทางทะเล",
      desc: lang === "en" ? "Comprehensive ocean freight solutions with international container tracking." : "บริการขนส่งสินค้าทางเรือครอบคลุมทั่วโลก ปลอดภัย พร้อมระบบติดตาม",
      bg: "/images/shipcard.png",
      video: "images/shipcard.mp4"
    },
    {
      title: lang === "en" ? "Air Freight" : "ขนส่งทางอากาศ",
      desc: lang === "en" ? "Express air cargo services for time-critical international deliveries." : "จัดส่งสินค้ารวดเร็วทันใจทางเครื่องบิน ตอบโจทย์ทุกเวลาเร่งด่วน",
      bg: "/images/cardair.png",
      video: "images/aircard.mp4"
    },
    {
      title: lang === "en" ? "Land Transport" : "ขนส่งทางบก",
      desc: lang === "en" ? "Cross-border and domestic trucking network with maximum safety." : "เครือข่ายรถบรรทุกขนส่งภายในประเทศและข้ามแดนอย่างมีประสิทธิภาพ",
      bg: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
      video: "images/containnercard.mp4"
    },
    {
      title: lang === "en" ? "Warehousing" : "คลังสินค้า",
      desc: lang === "en" ? "Modern warehouse management with real-time inventory control." : "ระบบจัดเก็บและบริหารคลังสินค้าอัจฉริยะ ตรวจสอบได้แบบเรียลไทม์",
      bg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      video: "images/inventorycard.mp4"
    },
    {
      title: lang === "en" ? "Customs Clearance" : "พิธีการศุลกากร",
      desc: lang === "en" ? "Seamless import-export documentation by certified specialists." : "จัดการเอกสารนำเข้า-ส่งออกอย่างถูกต้องรวดเร็ว โดยผู้เชี่ยวชาญ",
      bg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      video: "images/customscard.mp4"
    },
    {
      title: lang === "en" ? "Project Cargo" : "สินค้าโครงการ",
      desc: lang === "en" ? "Specialized heavy-lift and oversized cargo handling." : "การดูแลขนส่งเครื่องจักรขนาดใหญ่และสินค้าโครงการพิเศษครบวงจร",
      bg: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      video: "images/projectcard.mp4"
    }
  ];

  const youtubeNewsSlides = [
    {
      category: "HANDLE INTER GROUP",
      num: "01",
      title: lang === "en" ? "Handle Inter Group Official Corporate Overview" : "แนะนำบริษัท แฮนเดิล อินเตอร์ กรุ๊ป จำกัด",
      desc: lang === "en" 
        ? "Discover our 30+ years journey of delivering world-class total logistics and international supply chain solutions." 
        : "ทำความรู้จัก แฮนเดิล อินเตอร์ กรุ๊ป ผู้ให้บริการโลจิสติกส์ครบวงจรชั้นนำของไทย พร้อมเครือข่ายระดับโลก",
      youtubeId: "9DqG0ji2Ufo",
      tag: "OVERVIEW"
    },
    {
      category: "EXECUTIVE TEAM",
      num: "02",
      title: lang === "en" ? "Management Vision & Executive Leadership" : "HANDLE ทีมงานผู้บริหาร",
      desc: lang === "en" 
        ? "Experienced management teams dedicated to delivering seamless import & export consultation with high standards." 
        : "ทีมผู้บริหารบริษัทในเครือ แฮนเดิล อินเตอร์กรุ๊ป ที่มีความเชี่ยวชาญ พร้อมให้คำปรึกษาและเลือกสรรโซลูชันที่มีประสิทธิภาพสูงสุด",
      youtubeId: "Ebx_vXGqKDM",
      tag: "MANAGEMENT"
    },
    {
      category: "INTERNATIONAL LOGISTICS",
      num: "03",
      title: lang === "en" ? "Worldwide Shipping & Supply Chain Network" : "ระบบการจัดการโลจิสติกส์ระหว่างประเทศ",
      desc: lang === "en" 
        ? "Connecting strategic international trade routes with precise ocean, air, and land transportation solutions." 
        : "เชื่อมต่อทุกเส้นทางการค้าสำคัญทั่วโลก ขนส่งปลอดภัยด้วยมาตรฐานระดับสากล",
      youtubeId: "5s8dQ-3IDec",
      tag: "NETWORK"
    },
    {
      category: "SERVICES HUB",
      num: "04",
      title: lang === "en" ? "Total Integrated Freight Forwarding Services" : "บริการรับจัดการขนส่งสินค้าระหว่างประเทศ",
      desc: lang === "en" 
        ? "End-to-end cargo logistics handling including customs brokerage, warehousing, and door-to-door delivery." 
        : "บริการรับจัดการขนส่งสินค้าระหว่างประเทศแบบครอบคลุม พิธีการศุลกากร และระบบคลังสินค้าอัจฉริยะ",
      youtubeId: "uH8ld90yKU8",
      tag: "FREIGHT"
    },
    {
      category: "CONSOLIDATION",
      num: "05",
      title: lang === "en" ? "LCL Cargo Consolidation & Warehouse Operations" : "ศูนย์รวบรวมตู้สินค้า คอนโซลิเดชั่น",
      desc: lang === "en" 
        ? "Optimized LCL consolidation routes for SMEs with fixed weekly vessel sailing frequencies." 
        : "บริการรวบรวมสินค้าไม่เต็มตู้ (LCL) สำหรับธุรกิจ SMEs พร้อมตารางเรือออกตรงเวลาประจำสัปดาห์",
      youtubeId: "65UXKVDA_aA",
      tag: "CONSOLE"
    },
    {
      category: "FLEET & TRUCKING",
      num: "06",
      title: lang === "en" ? "Cross-Border & Domestic Trucking Logistics" : "ระบบการขนส่งทางบกและฟลีตรถบรรทุก",
      desc: lang === "en" 
        ? "Modern fleet operations supporting domestic distribution and cross-border transport across ASEAN." 
        : "ฟลีตรถบรรทุกและหัวลากคอนเทนเนอร์ รองรับการขนส่งภายในประเทศและข้ามแดนอย่างปลอดภัย",
      youtubeId: "9VciOx5jz-g",
      tag: "TRANSPORT"
    },
    {
      category: "HANDLE QUE SYSTEM",
      num: "07",
      title: lang === "en" ? "Handle QUE Container Smart Queue Management" : "Handle QUE ระบบจองคิวรับส่งสินค้า",
      desc: lang === "en" 
        ? "Innovative digital queue management platform optimizing container handling and reducing wait times." 
        : "นวัตกรรมระบบจองคิวการเข้ารับและส่งตู้สินค้าของ แฮนเดิล อินเตอร์ กรุ๊ป เพื่อความรวดเร็วและแม่นยำ",
      youtubeId: "cJils0Svzeo",
      tag: "INNOVATION"
    },
    {
      category: "OPERATIONS",
      num: "08",
      title: lang === "en" ? "High-Performance Logistics Standards" : "มาตรฐานการปฏิบัติงานและบริการระดับมืออาชีพ",
      desc: lang === "en" 
        ? "Excellence in operational handling, continuous human resource development, and customer-first care." 
        : "ยกระดับคุณภาพบริการ ความมุ่งมั่น และความใส่ใจในทุกขั้นตอนการขนส่งของลูกค้า",
      youtubeId: "hg82QdVCpU4",
      tag: "STANDARDS"
    }
  ];

  const itemsPerPage = 3;
  const newsPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < youtubeNewsSlides.length; i += itemsPerPage) {
      pages.push(youtubeNewsSlides.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [youtubeNewsSlides]);

  const handleNextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsPages.length);
  };

  const handlePrevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsPages.length) % newsPages.length);
  };

  useEffect(() => {
    const calcWrapperHeight = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxScrollableWidth = trackWidth - viewportWidth;
        setWrapperHeight(`${maxScrollableWidth + window.innerHeight}px`);
      }
    };

    calcWrapperHeight();
    window.addEventListener("resize", calcWrapperHeight);
    return () => window.removeEventListener("resize", calcWrapperHeight);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // 1. Scroll-driven Blur ใน Hero
          if (scrollY <= 600) {
            const blurVal = (scrollY / 600) * 16;
            const opacityVal = Math.max(0, 1 - scrollY / 500);
            const translateYVal = (scrollY / 600) * -80;

            setHeroBlur(blurVal);
            setHeroOpacity(opacityVal);
            setHeroTranslateY(translateYVal);
          }

          // 2. Pinned Horizontal Scroll การ์ดบริการ (หัวข้อที่ 4)
          if (serviceWrapperRef.current && trackRef.current) {
            const wrapperTop = serviceWrapperRef.current.offsetTop;
            const trackWidth = trackRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;
            const maxScrollX = trackWidth - viewportWidth;

            if (scrollY < wrapperTop) {
              setTranslateX(0);
              setProgressRatio(0);
            } else if (scrollY >= wrapperTop && scrollY <= wrapperTop + maxScrollX) {
              const moved = scrollY - wrapperTop;
              setTranslateX(-moved);
              setProgressRatio(moved / maxScrollX);
            } else {
              setTranslateX(-maxScrollX);
              setProgressRatio(1);
            }
          }

          // 3. Side Navigation Active State
          const scrollPosition = scrollY + 300;
          for (const section of sections) {
            const el = document.getElementById(section.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section.id);
                setVisitedSections((prev) => ({ ...prev, [section.id]: true }));
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsPages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, newsPages.length]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setVisitedSections((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="relative bg-slate-50 text-slate-800 cursor-default selection:bg-orange-500 selection:text-white">
      {/* Custom Cursor Circle */}
      <div 
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        className={`fixed w-8 h-8 pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-600/50 bg-orange-500/10 backdrop-blur-[1px] transition-transform duration-300 z-50 hidden lg:block ${
          isHovered ? "scale-150 border-orange-500 bg-orange-500/20" : "scale-100"
        }`}
      />

      {/* Side Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-6 items-end">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isVisited = visitedSections[section.id];

          return (
            <button 
              key={section.id} 
              onClick={() => scrollToSection(section.id)} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group flex items-center space-x-4 focus:outline-none cursor-pointer"
            >
              <span className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${
                isActive 
                  ? "text-orange-600 font-bold translate-x-0 opacity-100" 
                  : isVisited 
                    ? "text-slate-500 opacity-70 group-hover:opacity-100" 
                    : "text-slate-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
              }`}>{section.label}</span>
              
              <div className="relative w-8 h-8 flex items-center justify-end">
                <span className={`absolute transition-all duration-300 rounded-full ${
                  isActive 
                    ? "w-8 h-[2.5px] bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.6)]" 
                    : isVisited 
                      ? "w-4 h-[2px] bg-slate-400 group-hover:bg-orange-500 group-hover:w-6" 
                      : "w-2 h-[2px] bg-slate-300 group-hover:bg-slate-400 group-hover:w-5"
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: HERO */}
      <section
        id="who-we-are"
        className="min-h-screen flex items-center relative border-b border-slate-200/80 overflow-hidden"
      >
        {/* Background Image / Video */}
        <div className="absolute inset-0 z-0">

          {/* Background Image */}
          <img
            src="/images/shiphere2.jpeg"
            alt="Hero Background"
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              isIdle
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            }`}
          />

          {/* Background Video */}
          <video
            ref={heroVideoRef}
            src="/images/toppage.mp4"
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              isIdle
                ? "opacity-100 scale-105"
                : "opacity-0 scale-100"
            }`}
          />

        </div>

        {/* Hero Content */}
        <div
          style={{
            filter: `blur(${heroBlur + (isIdle ? 12 : 0)}px)`,
            opacity: isIdle ? 0 : heroOpacity,
            transform: `translateY(${
              heroTranslateY + (isIdle ? -30 : 0)
            }px)`,
            willChange: "filter, opacity, transform",
          }}
          className="max-w-7xl mx-auto px-6 py-28 relative z-20 w-full transition-all duration-1000 ease-in-out"
        >
          <div className="max-w-2xl space-y-8">

            {/* Label */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>

              <span className="text-xs font-mono tracking-wider text-orange-400 uppercase font-bold">
                {t.hero.sub}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] flex flex-col items-start">
              <TextReveal
                text={t.hero.title1}
                lang={lang}
              />

              <TextReveal
                text={t.hero.title2}
                lang={lang}
                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500"
                delayStep={0.03}
              />

              <TextReveal
                text={t.hero.title3}
                lang={lang}
                delayStep={0.02}
              />
            </h1>

            {/* Description */}
            <p className="text-slate-300 max-w-lg text-base leading-relaxed font-light">
              {t.hero.desc}
            </p>

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={() => scrollToSection("vision-journey")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-orange-600 hover:bg-orange-500 text-white px-9 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-2xl shadow-orange-600/40 inline-flex items-center space-x-3 cursor-pointer"
              >
                <span>{t.hero.cta}</span>
                <span className="text-xs animate-bounce">↓</span>
              </button>
            </div>

          </div>
        </div>

        {/* Cinematic Preview Indicator */}
        <div
          className={`absolute bottom-8 left-8 bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-700 z-30 ${
            isIdle
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />

          <span className="text-[10px] font-mono tracking-widest uppercase">
            CINEMATIC PREVIEW MODE
          </span>
        </div>
      </section>

      {/* 🌟 หัวข้อที่ 3: BUSINESS GROUPS */}
      <section 
        id="business-groups" 
        className="py-24 bg-gradient-to-b from-sky-100/60 via-blue-50/50 to-slate-100/80 text-slate-900 border-b border-sky-200/60 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-orange-500 text-white px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest">
                {t.businessGroups.sub}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              {t.businessGroups.title}
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl font-normal leading-relaxed">
              {t.businessGroups.desc}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {businessGroupBanners.map((banner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1], // ease-out curve แบบนุ่มนวล
                  delay: idx * 0.1, // ค่อยๆ โผล่ตามลำดับ (stagger effect)
                }}
              >
                <BusinessGroupVideoBannerCard
                  title={banner.title}
                  subtitle={banner.subtitle}
                  videoSrc={banner.videoSrc}
                  tag={banner.tag}
                  lang={lang}
                  surroundingLogos={banner.logos}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* หัวข้อที่ 4: SERVICES (PINNED HORIZONTAL SCROLL) */}
      <div 
        id="what-we-offer" 
        ref={serviceWrapperRef} 
        style={{ height: wrapperHeight }}
        className="relative border-b border-slate-200/80"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 w-full mb-6 shrink-0">
            <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-widest">{t.services.sub}</span>
            <div className="mt-2">
              <TextReveal text={t.services.title} lang={lang} className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight" delayStep={0.02} />
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <div 
              ref={trackRef}
              style={{ 
                transform: `translateX(${translateX}px)`,
                willChange: "transform"
              }}
              className="flex gap-8 px-6 md:px-24 w-max transition-transform duration-100 ease-out"
            >
              {serviceCardsData.map((item, idx) => (
                <FullVideoServiceCard
                  key={idx}
                  idx={idx}
                  service={item.title}
                  desc={item.desc}
                  bgImg={item.bg}
                  videoSrc={item.video}
                  lang={lang}
                  onHoverChange={setIsHovered}
                />
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full mt-8 shrink-0">
            <div className="w-full h-[3px] bg-slate-200 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.max(8, progressRatio * 100)}%` }} 
                className="h-full bg-orange-600 transition-all duration-150 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

     
  

      {/* 🌟 หัวข้อที่ 7: NEWS SLIDER */}
      <section 
        id="news" 
        className="min-h-screen py-24 flex flex-col justify-center items-center relative z-10 bg-slate-50 text-slate-900 overflow-hidden border-t border-slate-200/80"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="max-w-7xl mx-auto px-6 w-full space-y-12 my-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-3 text-left">
              <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-widest bg-orange-100 border border-orange-200 px-4 py-1.5 rounded-full inline-block shadow-sm">
                {t.news.sub}
              </span>
              <div className="mt-2">
                <TextReveal 
                  text={t.news.title} 
                  lang={lang} 
                  className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight" 
                  delayStep={0.03} 
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-auto">
              <button
                onClick={handlePrevNews}
                className="w-12 h-12 rounded-full bg-white hover:bg-orange-500 border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-white flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md hover:shadow-orange-500/30 hover:scale-105 active:scale-95 cursor-pointer"
                title="Previous Slide"
              >
                ←
              </button>
              <button
                onClick={handleNextNews}
                className="w-12 h-12 rounded-full bg-white hover:bg-orange-500 border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-white flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md hover:shadow-orange-500/30 hover:scale-105 active:scale-95 cursor-pointer"
                title="Next Slide"
              >
                →
              </button>
            </div>
          </div>

          <div className="relative min-h-[440px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNewsPageIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {newsPages[currentNewsPageIndex]?.map((slide, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col justify-between transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/15 hover:-translate-y-1.5 cursor-pointer"
                  >
                    <div className="relative w-full aspect-video bg-black overflow-hidden border-b border-slate-100">
                      <iframe
                        src={`https://www.youtube.com/embed/${slide.youtubeId}?rel=0`}
                        title={slide.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-white/20 text-orange-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {slide.category}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1 space-y-3 text-left bg-white">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono text-orange-600 font-bold">
                          <span>{slide.tag}</span>
                          <span>{slide.num}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {slide.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed font-normal line-clamp-2">
                          {slide.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center space-x-1.5 text-red-500 font-bold">
                          <span>▶</span>
                          <span>OFFICIAL VIDEO</span>
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform text-slate-900 group-hover:text-orange-600 font-bold">
                          PLAY ↗
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-4">
            {newsPages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentNewsIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentNewsPageIndex === dotIdx
                    ? "w-8 h-2.5 bg-orange-600 shadow-md shadow-orange-600/30"
                    : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                title={`Go to page ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}