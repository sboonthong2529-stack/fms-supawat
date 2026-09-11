import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ShieldCheck,
  LogIn,
  LayoutDashboard,
} from "lucide-react";

export interface PortalFooterProps {
  brandName: string;
  brandSubtitle: string;
  brandLogo?: string | null;
  locale: string;
  isLoggedIn: boolean;
  navLabels: {
    home: string;
    news: string;
    programs: string;
    staff: string;
    requests: string;
    facilities: string;
    dashboard: string;
    login: string;
  };
}

export function PortalFooter({
  brandName,
  brandSubtitle,
  brandLogo,
  locale,
  isLoggedIn,
  navLabels,
}: PortalFooterProps) {
  const isThai = locale === "th";

  return (
    <footer className="mt-16 border-t border-[var(--glass-border)] bg-[var(--ink-band)] text-[var(--ink-band-text)] transition-colors">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Identity (5 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl bg-[var(--brand)] text-[var(--on-brand)] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md ring-2 ring-white/10 group-hover:scale-105 transition-transform duration-200">
                {brandLogo ? (
                  <Image
                    src={brandLogo}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="h-full w-full object-contain p-1"
                    unoptimized
                  />
                ) : (
                  <GraduationCap className="h-6 w-6" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base tracking-tight text-[var(--ink-band-text)] leading-snug">
                  {brandName}
                </span>
                <span className="text-xs text-[var(--ink-band-muted)] leading-tight">
                  {brandSubtitle}
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-[var(--ink-band-muted)] max-w-sm">
              {isThai
                ? "มุ่งเน้นการผลิตบัณฑิตคุณภาพชั้นนำ พัฒนานวัตกรรมและการวิจัยดิจิทัล เพื่อตอบสนองการเปลี่ยนแปลงของเทคโนโลยีและขับเคลื่อนสังคมอย่างยั่งยืน"
                : "Committed to educating world-class graduates, advancing cutting-edge research, and fostering digital innovations for sustainable societal advancement."}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[var(--ink-band-muted)]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-light)]" />
              <span>{isThai ? "มาตรฐานการศึกษาและวิจัยดิจิทัล" : "Digital Education & Research Standards"}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2.5 cols on lg) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-band-text)] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              <span>{isThai ? "เมนูหลักและบริการ" : "Navigation & Services"}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { href: "/", label: navLabels.home },
                { href: "/announcements", label: navLabels.news },
                { href: "/programs", label: navLabels.programs },
                { href: "/staff", label: navLabels.staff },
                { href: "/requests", label: navLabels.requests },
                { href: "/facilities", label: navLabels.facilities },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[var(--ink-band-muted)] hover:text-[var(--ink-band-text)] transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal Access (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-band-text)] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              <span>{isThai ? "ระบบออนไลน์" : "Online Systems"}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {isLoggedIn ? (
                <li>
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center gap-2 text-[var(--ink-band-muted)] hover:text-[var(--ink-band-text)] transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[var(--brand-light)]" />
                    <span>{navLabels.dashboard}</span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-2 text-[var(--ink-band-muted)] hover:text-[var(--ink-band-text)] transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5 text-[var(--brand-light)]" />
                    <span>{navLabels.login}</span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/requests"
                  className="group inline-flex items-center gap-1.5 text-[var(--ink-band-muted)] hover:text-[var(--ink-band-text)] transition-colors"
                >
                  <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>{isThai ? "ติดตามสถานะคำร้อง" : "Track Requests"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="group inline-flex items-center gap-1.5 text-[var(--ink-band-muted)] hover:text-[var(--ink-band-text)] transition-colors"
                >
                  <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>{isThai ? "สมัครเข้าศึกษาต่อ" : "Admissions"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-band-text)] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              <span>{isThai ? "ข้อมูลการติดต่อ" : "Contact & Hours"}</span>
            </h4>
            <div className="space-y-2.5 text-xs text-[var(--ink-band-muted)]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--brand-light)] opacity-80" />
                <span className="leading-snug">
                  {isThai
                    ? "123 ถ.มหาวิทยาลัย แขวง/ตำบล เมือง กรุงเทพฯ 10400"
                    : "123 University Rd., Sub-District, Bangkok 10400"}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-shrink-0 text-[var(--brand-light)] opacity-80" />
                <span>02-123-4567, 02-123-4568</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-shrink-0 text-[var(--brand-light)] opacity-80" />
                <a
                  href="mailto:contact@faculty.ac.th"
                  className="hover:text-[var(--ink-band-text)] transition-colors underline-offset-2 hover:underline"
                >
                  contact@faculty.ac.th
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--brand-light)] opacity-80" />
                <span className="text-[11px] leading-tight">
                  {isThai
                    ? "เวลาทำการ: จันทร์ - ศุกร์ 08:30 - 16:30 น. (เว้นวันหยุดราชการ)"
                    : "Office Hours: Mon - Fri 08:30 - 16:30 (Excl. Public Holidays)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink-band-muted)]">
          <p className="text-center sm:text-left">
            © 2026 {brandName}. {isThai ? "สงวนลิขสิทธิ์ทุกประการ" : "All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by VibeCore</span>
            <span className="opacity-40">•</span>
            <span>Liyon Design System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
