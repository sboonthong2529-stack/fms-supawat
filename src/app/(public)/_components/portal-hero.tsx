"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Heart,
  Sun,
  Compass,
  LayoutDashboard,
  LogIn,
  Award,
  CheckCircle2,
  Flower2,
} from "lucide-react";

export interface PortalHeroProps {
  locale: string;
  brandName: string;
  brandLogo?: string | null;
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
  brandName,
  brandLogo,
  isLoggedIn = false,
  navLabels,
}: PortalHeroProps) {
  const isThai = locale === "th";

  // Sunset Marquee Items (Digital Naturalism & Human-Centric Philosophy)
  const marqueeItems = [
    isThai ? "✦ นวัตกรรมการเรียนรู้ที่อบอุ่นและยั่งยืน (Human-Centric Innovation)" : "✦ Human-Centric Educational Innovation",
    isThai ? "✦ สมดุลแห่งชีวิตและปัญญา (Balanced Living & Wisdom)" : "✦ Balanced Living & Creative Wisdom",
    isThai ? "✦ ชุมชนวิชาการที่สร้างสรรค์และเปี่ยมสุขภาวะ" : "✦ Inspiring & Flourishing Academic Community",
    isThai ? "✦ เทคโนโลยีดิจิทัลที่เข้าถึงง่ายและเป็นมิตร" : "✦ Calm, Accessible & Thoughtful Technology",
    isThai ? "✦ การศึกษาเพื่อการพัฒนาที่ยั่งยืนระดับสากล" : "✦ Sustainable & World-Class Education",
    isThai ? "✦ บ่มเพาะศักยภาพบัณฑิตด้วยความอบอุ่นและเอาใจใส่" : "✦ Nurturing Tomorrow's Visionary Leaders",
    isThai ? "✦ รับรองมาตรฐานคุณภาพการศึกษาระดับดีเยี่ยม 100%" : "✦ 100% Accredited Academic Excellence",
  ];

  return (
    <div className="relative overflow-hidden pt-10 md:pt-16 pb-14 border-b border-[var(--glass-border)] bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-background dark:from-amber-500/15 dark:via-rose-950/20 dark:to-background">
      {/* ═══ Sunset Atmospheric Glow (Golden Hour / Digital Naturalism) ═══ */}
      {/* Golden Sun Orb in center background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-[560px] w-[900px] max-w-full rounded-full bg-gradient-to-tr from-amber-400/35 via-rose-400/25 to-purple-500/20 blur-[130px] opacity-80 animate-sunset-glow"
      />

      {/* Radiant Peach/Coral side orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-32 right-[-5%] h-[420px] w-[500px] rounded-full bg-gradient-to-br from-rose-400/20 to-amber-300/15 blur-[110px] opacity-70"
      />

      {/* Lavender Twilight side orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 left-[-8%] h-[400px] w-[480px] rounded-full bg-gradient-to-br from-purple-400/20 via-indigo-300/15 to-rose-300/10 blur-[110px] opacity-65"
      />

      {/* Soft Sunset Ripple Wave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[12%] -translate-y-1/2 h-[450px] w-[450px] rounded-full border border-amber-400/20 dark:border-amber-300/10 animate-sunset-ripple"
      />

      {/* Main Container */}
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center min-h-[590px]">
          {/* ═══ Left Column: Editorial & Human-Centric Narrative (7 cols on lg) ═══ */}
          <div className="lg:col-span-7 space-y-7 z-10 text-center lg:text-left">
            {/* Sunset Pill Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/35 dark:border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <Flower2 className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
              <span className="tracking-wide">
                {isThai
                  ? "ปญฺญา โลกสฺมิ ปชฺโชโต • ปัญญาเป็นแสงสว่างในโลก"
                  : "Paññā Lokasmi Pajjoto • Wisdom is the Light of the World"}
              </span>
            </div>

            {/* Poetic & Elegant Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.14]">
              {isThai ? (
                <>
                  เทคโนโลยีการศึกษาที่อบอุ่น{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 dark:from-amber-400 dark:via-rose-400 dark:to-purple-300">
                    ดั่งแสงตะวันยามเย็น
                  </span>
                </>
              ) : (
                <>
                  Educational Innovation That{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 dark:from-amber-400 dark:via-rose-400 dark:to-purple-300">
                    Feels Like a Sunset
                  </span>
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {isThai
                ? "จัดการศึกษาพระพุทธศาสนา บูรณาการกับศาสตร์สมัยใหม่ พัฒนาจิตใจและสังคม บ่มเพาะศักยภาพบัณฑิตด้วยสมดุลแห่งชีวิตและปัญญาอันเป็นเลิศ พร้อมก้าวสู่อนาคตอย่างมั่นคงและสง่างาม"
                : "Educating Buddhism, integrating with modern sciences, developing mind and society. Nurturing tomorrow's visionary leaders in an inspiring digital ecosystem where wisdom shines like the light of the world."}
            </p>

            {/* Call to Action Buttons (Sunset Warmth Pill & Frosted Glass) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/programs"
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Compass className="h-4 w-4" />
                <span>{navLabels.programs}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 dark:border-white/15 bg-white/30 dark:bg-white/5 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-xl px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm hover:border-amber-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>{navLabels.announcements}</span>
              </Link>

              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-transparent bg-white/10 hover:bg-white/20 px-5 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  <LayoutDashboard className="h-4 w-4 text-amber-500" />
                  <span>{navLabels.dashboard}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-transparent bg-white/10 hover:bg-white/20 px-5 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  <LogIn className="h-4 w-4 text-amber-500" />
                  <span>{navLabels.login}</span>
                </Link>
              )}
            </div>

            {/* Trust & Tranquility Strip */}
            <div className="pt-4 border-t border-[var(--glass-border)]/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    "bg-gradient-to-br from-amber-400 to-orange-500",
                    "bg-gradient-to-br from-rose-400 to-pink-500",
                    "bg-gradient-to-br from-purple-400 to-indigo-500",
                    "bg-gradient-to-br from-teal-400 to-emerald-500",
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
                    {isThai ? "นิสิต & ศิษย์เก่า" : "Students & Alumni"}
                  </span>
                </div>
              </div>

              <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-foreground">100%</span>
                <span>{isThai ? "มาตรฐานการศึกษา" : "Accredited"}</span>
              </div>

              <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-rose-500" />
                <span>
                  {isThai ? "ปัญญาเป็นแสงสว่างในโลก" : "Wisdom is the Light"}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ Right Column: Sunset Arch Portal Featuring the Uploaded Logo & University Motto ═══ */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[500px] lg:min-h-[550px] select-none">
            {/* Centerpiece: Elegant Sunset Arch Portal */}
            <div className="relative w-full max-w-[440px] rounded-[44px] border border-white/40 dark:border-white/15 bg-gradient-to-b from-white/40 via-white/20 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-transparent backdrop-blur-2xl p-7 sm:p-9 shadow-2xl shadow-rose-950/10 flex flex-col items-center text-center">
              {/* Top Arch Label: Motto in English and Pali */}
              <div className="flex items-center justify-between w-full pb-4 border-b border-white/20 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold">
                  <Sun className="h-4 w-4" />
                  <span className="tracking-wider uppercase text-[11px]">WISDOM IS THE LIGHT</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>PAÑÑĀ LOKASMI PAJJOTO</span>
                </div>
              </div>

              {/* Radiant Sunset Backdrop behind the Logo */}
              <div className="relative my-6 flex items-center justify-center h-64 w-full">
                {/* Glowing Setting Sun Disk */}
                <div className="absolute h-52 w-52 rounded-full bg-gradient-to-tr from-amber-400/40 via-rose-400/35 to-purple-400/20 blur-2xl opacity-90 animate-sunset-glow" />

                {/* Soft Orbiting Golden Rings */}
                <div className="absolute h-64 w-64 rounded-full border border-dashed border-amber-300/40 dark:border-amber-400/25 pointer-events-none animate-hero-float-1" />
                <div className="absolute h-56 w-56 rounded-full border border-rose-300/30 dark:border-rose-400/20 pointer-events-none animate-hero-float-2" />

                {/* 🌟 The Uploaded Logo Centerpiece 🌟 */}
                <div className="relative z-10 h-40 w-40 sm:h-44 sm:w-44 rounded-full bg-gradient-to-br from-white/75 via-white/45 to-white/20 dark:from-white/30 dark:via-white/15 dark:to-white/5 border-2 border-white/70 dark:border-white/25 shadow-2xl backdrop-blur-xl flex items-center justify-center p-6 group hover:scale-105 transition-transform duration-500">
                  {brandLogo ? (
                    <div className="relative h-full w-full flex items-center justify-center">
                      <Image
                        src={brandLogo}
                        alt={brandName}
                        width={150}
                        height={150}
                        className="h-full w-full object-contain filter drop-shadow-[0_12px_24px_rgba(249,115,22,0.35)] transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-amber-600 dark:text-amber-400 drop-shadow-md">
                      <GraduationCap className="h-16 w-16 mb-1" />
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                        {brandName}
                      </span>
                    </div>
                  )}

                  {/* Sunset Specular Sheen on Pedestal */}
                  <div className="absolute top-2 left-6 h-12 w-12 rounded-full bg-white/45 blur-[10px] pointer-events-none" />
                </div>
              </div>

              {/* Brand Title & Official University Motto below Logo */}
              <div className="space-y-1.5 pt-3 border-t border-white/20 dark:border-white/10 w-full">
                <h3 className="font-bold text-base text-foreground tracking-tight">
                  {brandName}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-200">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>&ldquo;Wisdom is the Light of the World&rdquo;</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium pt-0.5">
                  ปญฺญา โลกสฺมิ ปชฺโชโต • บูรณาการศาสตร์สมัยใหม่ พัฒนาจิตใจและสังคม
                </p>
              </div>
            </div>

            {/* ═══ 4 Lunera-Style Floating Glass Panels: UNIVERSITY MOTTO BESIDE THE LOGO ═══ */}

            {/* Panel 1: Top-Left (Motto: Paññā Lokasmi Pajjoto) */}
            <div className="absolute -top-4 -left-4 sm:-left-10 z-20 animate-hero-float-1 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/15 bg-card/90 backdrop-blur-xl px-4 py-2.5 shadow-xl shadow-rose-950/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 flex-shrink-0">
                  <Sun className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-tight flex items-center gap-1.5">
                    <span>Paññā Lokasmi Pajjoto</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ปญฺญา โลกสฺมิ ปชฺโชโต
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 2: Top-Right (Motto: Wisdom is the Light of the World) */}
            <div className="absolute -top-5 -right-3 sm:-right-8 z-20 animate-hero-float-2 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/15 bg-card/90 backdrop-blur-xl px-4 py-2.5 shadow-xl shadow-rose-950/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/30 flex-shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">Wisdom is the Light</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    ปัญญาเป็นแสงสว่างในโลก
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 3: Bottom-Left (Motto: Modern Sciences Integration) */}
            <div className="absolute -bottom-5 -left-4 sm:-left-8 z-20 animate-hero-float-4 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/15 bg-card/90 backdrop-blur-xl px-4 py-2.5 shadow-xl shadow-rose-950/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/30 flex-shrink-0">
                  <Compass className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Modern Sciences Integration
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    บูรณาการศาสตร์สมัยใหม่
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 4: Bottom-Right (Motto: Developing Mind & Society) */}
            <div className="absolute -bottom-5 -right-3 sm:-right-8 z-20 animate-hero-float-3 pointer-events-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/15 bg-card/90 backdrop-blur-xl px-4 py-2.5 shadow-xl shadow-rose-950/10 hover:scale-105 transition-transform duration-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30 flex-shrink-0">
                  <Heart className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Developing Mind & Society
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    พัฒนาจิตใจและสังคม
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Sunset Marquee Ribbon ═══ */}
      <div className="mt-14 pt-4 pb-4 border-y border-[var(--glass-border)]/80 bg-[var(--surface-sunken)]/30 backdrop-blur-md overflow-hidden select-none">
        <div className="animate-hero-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center mx-6 text-xs font-medium tracking-wider text-muted-foreground/80 hover:text-foreground transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
