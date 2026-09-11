import Link from "next/link";
import { getT } from "@/i18n/server";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PublicNotFound() {
  const t = await getT();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center text-center max-w-lg space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground border border-border shadow-sm">
        <FileQuestion className="h-10 w-10 text-primary/70" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl font-extrabold tracking-tight text-primary">404</span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("public.notFound.title")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("public.notFound.desc")}
        </p>
      </div>

      <div>
        <Button asChild className="rounded-xl px-6 py-2.5">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{t("public.notFound.backHome")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
