"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center text-center max-w-lg space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
        <AlertCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("public.error.title")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("public.error.desc")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => reset()}
          className="rounded-xl px-5 py-2.5 inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{t("public.error.retry")}</span>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-xl px-5 py-2.5 inline-flex items-center gap-2"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            <span>{t("public.notFound.backHome")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
