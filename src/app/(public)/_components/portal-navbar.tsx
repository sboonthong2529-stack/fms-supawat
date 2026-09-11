"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { signOut } from "next-auth/react";
import {
  GraduationCap,
  LogIn,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { cn } from "@/shared/lib/utils";

const emptySubscribe = () => () => {};

export interface PortalNavbarProps {
  brandName: string;
  brandSubtitle: string;
  brandLogo?: string | null;
  locale: string;
  sessionUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  navLabels: {
    home: string;
    news: string;
    programs: string;
    staff: string;
    requests: string;
    facilities: string;
    dashboard: string;
    profile: string;
    logout: string;
    login: string;
    themeToggle: string;
  };
}

export function PortalNavbar({
  brandName,
  brandSubtitle,
  brandLogo,
  sessionUser,
  navLabels,
}: PortalNavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMobileOpen(false);
  }

  const initials = (sessionUser?.name ?? "?").trim().charAt(0).toUpperCase() || "?";

  const navItems = [
    { href: "/", label: navLabels.home },
    { href: "/announcements", label: navLabels.news },
    { href: "/programs", label: navLabels.programs },
    { href: "/staff", label: navLabels.staff },
    { href: "/requests", label: navLabels.requests },
    { href: "/facilities", label: navLabels.facilities },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md shadow-xs transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Brand Block - styled like Admin .brand-blk */}
        <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-shrink-0 group">
          <div className="relative h-[34px] w-[34px] rounded-lg bg-primary text-primary-foreground flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs ring-1 ring-primary/20">
            {brandLogo ? (
              <Image
                src={brandLogo}
                alt={brandName}
                width={34}
                height={34}
                className="h-full w-full object-contain p-0.5"
                unoptimized
              />
            ) : (
              <GraduationCap className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col min-w-0 max-w-[190px] sm:max-w-[260px] md:max-w-[340px]">
            <b className="text-[0.92rem] font-bold tracking-tight text-foreground leading-snug truncate group-hover:text-primary transition-colors">
              {brandName}
            </b>
            <span className="text-[0.72rem] text-muted-foreground leading-tight truncate">
              {brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[0.88rem] px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap",
                  active
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageSwitcher className="lang" />

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={navLabels.themeToggle}
            title={navLabels.themeToggle}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* User Avatar Menu or Login Button */}
          {sessionUser ? (
            <div className="relative">
              <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 py-1 pl-1 pr-2.5 rounded-full hover:bg-muted/80 transition-colors border border-border/70 bg-card/60 shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                    aria-label="User Account Menu"
                  >
                    <span
                      className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-2xs overflow-hidden flex-shrink-0"
                      aria-hidden="true"
                    >
                      {sessionUser.image ? (
                        <Image
                          src={sessionUser.image}
                          alt=""
                          width={32}
                          height={32}
                          className="h-full w-full rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        initials
                      )}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-foreground max-w-[100px] sm:max-w-[140px] truncate hidden sm:inline">
                      {sessionUser.name || "Staff"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-70 transition-transform duration-200" aria-hidden="true" />
                  </button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuPrimitive.Portal>
                  <DropdownMenuPrimitive.Content
                    className="z-50 min-w-[210px] rounded-xl border border-border bg-popover/95 p-1.5 text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                    align="end"
                    sideOffset={8}
                  >
                    <DropdownMenuPrimitive.Label asChild>
                      <div className="px-3 py-2 border-b border-border/60 mb-1">
                        <p className="text-xs font-semibold text-foreground truncate">{sessionUser.name}</p>
                        {sessionUser.email && (
                          <p className="text-[11px] text-muted-foreground truncate">{sessionUser.email}</p>
                        )}
                      </div>
                    </DropdownMenuPrimitive.Label>

                    <DropdownMenuPrimitive.Item asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-none"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        <span>{navLabels.dashboard}</span>
                      </Link>
                    </DropdownMenuPrimitive.Item>

                    <DropdownMenuPrimitive.Item asChild>
                      <Link
                        href="/me"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-none"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{navLabels.profile}</span>
                      </Link>
                    </DropdownMenuPrimitive.Item>

                    <DropdownMenuPrimitive.Separator className="h-px bg-border/60 my-1" />

                    <DropdownMenuPrimitive.Item asChild onSelect={() => signOut({ callbackUrl: "/" })}>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer outline-none text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{navLabels.logout}</span>
                      </button>
                    </DropdownMenuPrimitive.Item>
                  </DropdownMenuPrimitive.Content>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenuPrimitive.Root>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground shadow-xs transition hover:bg-accent hover:text-accent-foreground"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">{navLabels.login}</span>
            </Link>
          )}

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-lg px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {sessionUser ? (
            <div className="pt-2 border-t border-border/60 mt-2 space-y-2">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/40">
                <span className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs bg-gradient-to-br from-primary/90 to-primary text-primary-foreground overflow-hidden">
                  {sessionUser.image ? (
                    <Image src={sessionUser.image} alt="" width={32} height={32} className="h-full w-full object-cover" unoptimized />
                  ) : (
                    initials
                  )}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate">{sessionUser.name}</span>
                  {sessionUser.email && (
                    <span className="text-[10px] text-muted-foreground truncate">{sessionUser.email}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/60 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>{navLabels.dashboard}</span>
                </Link>
                <Link
                  href="/me"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/60 transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{navLabels.profile}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors text-left w-full cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{navLabels.logout}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-border/60 mt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/60 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>{navLabels.login}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
