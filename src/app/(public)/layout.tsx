import Link from "next/link";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { auth } from "@/features/identity/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { GraduationCap, LogIn, LayoutDashboard } from "lucide-react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getT();
  const locale = await getLocale();
  const session = await auth().catch(() => null);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight tracking-tight text-foreground">
                  {locale === "th" ? "คณะเทคโนโลยีและนวัตกรรม" : "Faculty of Technology & Innovation"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {locale === "th" ? "มหาวิทยาลัยแห่งการเรียนรู้" : "University Portal"}
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/announcements"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("news.portal.title")}
              </Link>
              <Link
                href="/programs"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("curriculum.publicTitle")}
              </Link>
              <Link
                href="/staff"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("personnel.portal.title")}
              </Link>
              <Link
                href="/requests"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("edocs.publicTitle")}
              </Link>
              <Link
                href="/facilities"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("facilities.publicTitle")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="lang" />

            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t("nav.dashboard")}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
              >
                <LogIn className="h-4 w-4" />
                <span>{locale === "th" ? "เข้าสู่ระบบบุคลากร" : "Staff Login"}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 text-sm text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-base text-foreground">
                {locale === "th" ? "คณะเทคโนโลยีและนวัตกรรม" : "Faculty of Technology & Innovation"}
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md">
              {locale === "th"
                ? "มุ่งเน้นการผลิตบัณฑิตคุณภาพ พัฒนางานวิจัย และสร้างสรรค์นวัตกรรมเพื่อการพัฒนาสังคมอย่างยั่งยืน"
                : "Committed to educating world-class graduates, advancing research, and creating sustainable innovations for society."}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              {locale === "th" ? "เมนูด่วน" : "Quick Links"}
            </h4>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-primary transition-colors">
                  {t("news.portal.title")}
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-primary transition-colors">
                  {t("curriculum.publicTitle")}
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-primary transition-colors">
                  {t("personnel.portal.title")}
                </Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-primary transition-colors">
                  {t("edocs.publicTitle")}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-primary transition-colors">
                  {t("facilities.publicTitle")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  {locale === "th" ? "เข้าสู่ระบบบุคลากร" : "Staff Login"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              {locale === "th" ? "ติดต่อเรา" : "Contact"}
            </h4>
            <p className="text-xs">
              123 ถ.มหาวิทยาลัย แขวง/ตำบล เมือง<br />
              โทรศัพท์: 02-123-4567<br />
              Email: contact@faculty.ac.th
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          © 2026 Faculty Web Platform. Built on VibeCore Modular Monolith Framework.
        </div>
      </footer>
    </div>
  );
}
