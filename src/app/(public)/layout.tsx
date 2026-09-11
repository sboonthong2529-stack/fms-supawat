import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { auth, resolveTenantSettings } from "@/features/identity/server";
import { PortalNavbar } from "./_components/portal-navbar";
import { PortalFooter } from "./_components/portal-footer";

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
      <PortalFooter
        brandName={brandName}
        brandSubtitle={brandSubtitle}
        brandLogo={settings?.logoUrl}
        locale={locale}
        isLoggedIn={!!session?.user}
        navLabels={navLabels}
      />
    </div>
  );
}
