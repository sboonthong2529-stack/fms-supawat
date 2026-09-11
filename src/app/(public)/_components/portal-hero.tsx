"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Bot,
  GraduationCap,
  TrendingUp,
  FileCheck,
  Compass,
  LayoutDashboard,
  LogIn,
  Award,
  CheckCircle2,
} from "lucide-react";

export interface PortalHeroProps {
  locale: string;
  isLoggedIn?: boolean;
  navLabels: {
    announcements: string;
    programs: string;
    services: string;
    dashboard: string;
    login: string;
  };
}

export function PortalHero({
  locale,
  isLoggedIn = false,
  navLabels,
}: PortalHeroProps) {
  const isThai = locale === "th";

  // Interactive 3D tilt calculations for the central showcase card
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (-10 to 10 deg)
    const rotateY = ((mouseX / width) - 0.5) * 16;
    const rotateX = ((mouseY / height) - 0.5) * -16;

    setTilt({ x: rotateX, y: rotateY, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, active: false });
  }, []);

  // Marquee items
  const marqueeItems = [
    isThai ? "✦ นวัตกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล (AI & Data Science)" : "✦ AI & Data Science Innovations",
    isThai ? "✦ การจัดการธุรกิจดิจิทัลอัจฉริยะ (Smart Business)" : "✦ Smart Digital Business Ecosystem",
    isThai ? "✦ การเงินดิจิทัลและเทคโนโลยีบล็อกเชน (FinTech Lab)" : "✦ FinTech & Web3 Technologies",
    isThai ? "✦ โลจิสติกส์และการจัดการซัพพลายเชนแห่งอนาคต" : "✦ Next-Gen Logistics & Supply Chain",
    isThai ? "✦ วิจัยชั้นนำระดับนานาชาติ (Global Research)" : "✦ World-Class Research Publications",
    isThai ? "✦ ผลิตบัณฑิตคุณภาพสูงตอบสนองตลาดโลก" : "✦ Global Ready Graduates",
    isThai ? "✦ รับรองมาตรฐานคุณภาพการศึกษา 100%" : "✦ 100% Accredited Academic Standards",
  ];

  return (
    <div className="relative overflow-hidden pt-8 md:pt-14 pb-12 border-b border-[var(--glass-border)] bg-gradient-to-b from-[var(--surface-sunken)]/60 via-background to-background">
      {/* Ambient background lights (Glow Mesh) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[560px] w-[900px] max-w-full rounded-full bg-gradient-to-tr from-[var(--brand)]/20 via-indigo-500/15 to-cyan-400/20 blur-[120px] opacity-70 animate-hero-pulse-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-36 right-[-10%] h-[380px] w-[450px] rounded-full bg-purple-500/15 blur-[100px] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 left-[-10%] h-[350px] w-[420px] rounded-full bg-[var(--brand-light)]/15 blur-[100px] opacity-50"
      />

      {/* Tech Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06] [background-image:radial-gradient(rgba(0,0,0,0.8)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
      />

      {/* Main Container */}
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          {/* Left Column: Hero Text & Value Proposition (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-7 z-10 text-center lg:text-left">
            {/* Pill Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-4 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
              <span className="tracking-wide">
                {isThai
                  ? "เปิดรับสมัครนักศึกษาใหม่ ประจำปีการศึกษา 2569"
                  : "Now Accepting Applications for Academic Year 2026"}
              </span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
              {isThai ? (
                <>
                  ขับเคลื่อนสู่อนาคตด้วย{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-indigo-500 to-cyan-500 dark:via-indigo-400 dark:to-cyan-400">
                    นวัตกรรมดิจิทัล
                  </span>{" "}
                  และวิทยาการอัจฉริยะ
                </>
              ) : (
                <>
                  Pioneering the Future with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-indigo-500 to-cyan-500 dark:via-indigo-400 dark:to-cyan-400">
                    Intelligent Digital
                  </span>{" "}
                  & AI Innovations
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {isThai
                ? "ศูนย์กลางการศึกษา วิจัย และนวัตกรรมเทคโนโลยีชั้นนำ บ่มเพาะบัณฑิตสู่ผู้นำยุคใหม่ด้วยหลักสูตรมาตรฐานสากล พร้อมโครงสร้างพื้นฐานดิจิทัลและระบบนิเวศแห่งอนาคต"
                : "A world-class hub for digital education, cutting-edge research, and technological innovation. Empowering the next generation of visionary leaders with globally accredited curricula."}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/programs"
                className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)] px-6 py-3.5 text-sm font-bold text-[var(--on-brand)] shadow-lg shadow-[var(--brand)]/25 hover:shadow-[var(--brand)]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Compass className="h-4 w-4" />
                <span>{navLabels.programs}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] hover:bg-[var(--glass-strong)] backdrop-blur-md px-5 py-3.5 text-sm font-semibold text-foreground shadow-sm hover:border-[var(--brand)]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{navLabels.announcements}</span>
              </Link>

              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-white/5 hover:bg-white/10 px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  <LayoutDashboard className="h-4 w-4 text-[var(--brand)]" />
                  <span>{navLabels.dashboard}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-white/5 hover:bg-white/10 px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  <LogIn className="h-4 w-4 text-[var(--brand)]" />
                  <span>{navLabels.login}</span>
                </Link>
              )}
            </div>

            {/* Trust & Social Proof Strip */}
            <div className="pt-4 border-t border-[var(--glass-border)]/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    "bg-gradient-to-br from-blue-500 to-indigo-600",
                    "bg-gradient-to-br from-emerald-500 to-teal-600",
                    "bg-gradient-to-br from-purple-500 to-pink-600",
                    "bg-gradient-to-br from-amber-500 to-orange-600",
                  ].map((bg, idx) => (
                    <div
                      key={idx}
                      className={`h-7 w-7 rounded-full border-2 border-background ${bg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="font-bold text-foreground">10,000+</span>
                  <span className="ml-1">
                    {isThai ? "ศิษย์เก่า & นักศึกษา" : "Students & Alumni"}
                  </span>
                </div>
              </div>

              <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-foreground">100%</span>
                <span>{isThai ? "รับรองมาตรฐานสากล" : "Accredited"}</span>
              </div>

              <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>
                  {isThai ? "ประเมินคุณภาพระดับดีเยี่ยม" : "Excellence Rating"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: AICM 3D Animation & Floating Icons Showcase (5 cols on lg) */}
          <div
            className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] lg:min-h-[520px] select-none"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1100px" }}
          >
            {/* Central 3D Interactive Card */}
            <div
              className="relative w-full max-w-[420px] rounded-3xl border border-white/25 dark:border-white/10 bg-gradient-to-b from-white/30 via-white/15 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-2xl p-7 shadow-2xl transition-transform duration-200 ease-out"
              style={{
                transform: tilt.active
                  ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`
                  : "rotateX(0deg) rotateY(0deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Card Window Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/15 dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80 shadow-sm" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80 shadow-sm" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 shadow-sm" />
                </div>
                <span className="text-[11px] font-mono font-medium tracking-wider text-muted-foreground uppercase">
                  FACULTY OS // v2.6
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* 3D Central Graphic (Holographic Core with Orbiting Rings) */}
              <div className="relative h-64 flex items-center justify-center my-2">
                {/* Background Glow inside Card */}
                <div className="absolute h-44 w-44 rounded-full bg-gradient-to-tr from-[var(--brand)]/30 to-cyan-400/30 blur-2xl opacity-60" />

                {/* Outer Orbiting Ring 1 */}
                <div className="absolute h-56 w-56 rounded-full border border-dashed border-[var(--brand)]/30 dark:border-[var(--brand-light)]/25 animate-hero-orbit pointer-events-none">
                  {/* Orbiting Satellite Node */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/50 flex items-center justify-center text-white">
                    <Sparkles className="h-3 w-3" />
                  </div>
                </div>

                {/* Outer Orbiting Ring 2 (Reversed & Elliptical) */}
                <div
                  className="absolute h-48 w-48 rounded-full border border-white/20 dark:border-white/10 animate-hero-orbit-reverse pointer-events-none"
                  style={{ transform: "rotateX(60deg)" }}
                >
                  <div className="absolute -bottom-2 right-6 h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/50" />
                </div>

                {/* Central 3D Core Sphere / Emblem */}
                <div className="relative z-10 h-32 w-32 rounded-3xl bg-gradient-to-br from-[var(--brand)] via-indigo-600 to-cyan-600 p-1 shadow-2xl shadow-[var(--brand)]/40 hover:scale-105 transition-transform duration-300">
                  <div className="h-full w-full rounded-[22px] bg-gradient-to-tr from-black/40 via-transparent to-white/30 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-white text-center">
                    <GraduationCap className="h-10 w-10 drop-shadow-md text-white mb-1" />
                    <span className="text-[11px] font-black tracking-wider uppercase drop-shadow">
                      DIGITAL
                    </span>
                    <span className="text-[9px] opacity-80 font-mono">
                      EXCELLENCE
                    </span>
                  </div>

                  {/* Specular Highlight Sheen on Sphere */}
                  <div className="absolute top-2 left-3 h-10 w-10 rounded-full bg-white/30 blur-[6px] pointer-events-none" />
                </div>
              </div>

              {/* Bottom Mini Metrics inside Card */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/15 dark:border-white/10 text-center">
                <div className="p-2 rounded-xl bg-white/10 dark:bg-white/5 border border-white/10">
                  <div className="text-base font-black text-foreground">12+</div>
                  <div className="text-[10px] text-muted-foreground">
                    {isThai ? "หลักสูตร" : "Programs"}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/10 dark:bg-white/5 border border-white/10">
                  <div className="text-base font-black text-foreground">80+</div>
                  <div className="text-[10px] text-muted-foreground">
                    {isThai ? "คณาจารย์" : "Faculty"}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/10 dark:bg-white/5 border border-white/10">
                  <div className="text-base font-black text-emerald-500">100%</div>
                  <div className="text-[10px] text-muted-foreground">
                    {isThai ? "มาตรฐาน" : "Accredited"}
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ 4 AICM-Style Floating 3D Micro-Cards ═══ */}

            {/* Floating Card 1: Top-Left (AI Assistant) */}
            <div className="absolute -top-4 -left-4 sm:-left-8 z-20 animate-hero-float-1 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/30 dark:border-white/15 bg-card/85 backdrop-blur-xl px-3.5 py-2.5 shadow-xl shadow-black/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30 flex-shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-tight flex items-center gap-1.5">
                    <span>AI Assistant</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {isThai ? "พร้อมตอบคำถาม 24/7" : "Active & Ready"}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Top-Right (Admissions 2569) */}
            <div className="absolute -top-6 -right-2 sm:-right-6 z-20 animate-hero-float-2 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/30 dark:border-white/15 bg-card/85 backdrop-blur-xl px-3.5 py-2.5 shadow-xl shadow-black/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[var(--brand)] to-purple-600 flex items-center justify-center text-white shadow-md shadow-[var(--brand)]/30 flex-shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    {isThai ? "รับสมัคร TCAS 69" : "Admissions 2026"}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--brand)]">
                    {isThai ? "เปิดรับสมัครแล้ว" : "Now Open"}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Card 3: Bottom-Right (Employment Rate) */}
            <div className="absolute -bottom-6 -right-3 sm:-right-8 z-20 animate-hero-float-3 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/30 dark:border-white/15 bg-card/85 backdrop-blur-xl px-4 py-2.5 shadow-xl shadow-black/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 flex-shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-foreground">98.6%</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-1 rounded">
                      +4.2%
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {isThai ? "ได้งานทำทันที" : "Employment Rate"}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Card 4: Bottom-Left (Smart E-Services) */}
            <div className="absolute -bottom-5 -left-3 sm:-left-6 z-20 animate-hero-float-4 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/30 dark:border-white/15 bg-card/85 backdrop-blur-xl px-3.5 py-2.5 shadow-xl shadow-black/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 flex-shrink-0">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Smart E-Docs
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {isThai ? "คำร้องออนไลน์ 100%" : "100% Digital Flow"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ AICM / FANCY Signature Infinite Marquee Ribbon ═══ */}
      <div className="mt-14 pt-4 pb-4 border-y border-[var(--glass-border)]/80 bg-[var(--surface-sunken)]/40 backdrop-blur-md overflow-hidden select-none">
        <div className="animate-hero-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center mx-6 text-xs font-bold tracking-wider uppercase text-muted-foreground/80 hover:text-foreground transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
