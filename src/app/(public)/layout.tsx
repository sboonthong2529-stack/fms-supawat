import Link from "next/link";
import Image from "next/image";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { auth, resolveTenantSettings } from "@/features/identity/server";
import { GraduationCap } from "lucide-react";
import { PortalNavbar } from "./_components/portal-navbar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getT();
  const locale = await getLocale();
  const session = await auth().catch(() => null);
  const settings = await resolveTenantSettings();

  const brandName = settings ? (locale === "th" ? settings.nameTh : settings.nameEn) : t("faculty.name");
  const brandSubtitle = settings ? (locale === "th" ? settings.nameEn : settings.nameTh) : t("faculty.subtitle");

  const navLabels = {
    home: t("nav.home"),
    news: t("news.portal.title"),
    programs: t("curriculum.publicTitle"),
    staff: t("personnel.portal.title"),
    requests: t("edocs.publicTitle"),
    facilities: t("facilities.publicTitle"),
    dashboard: t("nav.dashboard"),
    profile: t("account.profile"),
    logout: t("account.logout"),
    login: locale === "th" ? "เข้าสู่ระบบบุคลากร" : "Staff Login",
    themeToggle: t("nav.themeToggle"),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <PortalNavbar
        brandName={brandName}
        brandSubtitle={brandSubtitle}
        brandLogo={settings?.logoUrl}
        locale={locale}
        sessionUser={session?.user ?? null}
        navLabels={navLabels}
      />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 text-sm text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground overflow-hidden p-0.5">
                {settings?.logoUrl ? (
                  <Image
                    src={settings.logoUrl}
                    alt={brandName}
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
                ) : (
                  <GraduationCap className="h-5 w-5" />
                )}
              </div>
              <span className="font-bold text-base text-foreground">
                {brandName}
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
