"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useT } from "@/shared/lib/i18n/client";
import { GoogleIcon } from "../../_components/icons";
import {
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonDialogCloseButton,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";

const PROVIDER_ID = { google: "google", microsoft: "microsoft-entra-id" } as const;

export function OAuthButtons({
  providers = ["google"],
  googleConfigured = false,
}: {
  providers?: ("google" | "microsoft")[];
  googleConfigured?: boolean;
}) {
  const t = useT();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/callback/google`
      : "http://localhost:3010/api/auth/callback/google";

  const handleGoogleClick = () => {
    if (!googleConfigured) {
      setShowSetupModal(true);
      return;
    }
    setLoading("google");
    signIn(PROVIDER_ID.google, { callbackUrl: "/dashboard" });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="oauth">
        {providers.includes("google") && (
          <button
            key="google"
            type="button"
            className="btn-oauth"
            onClick={handleGoogleClick}
            disabled={loading !== null}
          >
            <GoogleIcon />
            <span>{loading === "google" ? t("auth.signingIn") : t("auth.signInWithGoogle")}</span>
          </button>
        )}
        {providers.includes("microsoft") && (
          <button
            key="microsoft"
            type="button"
            className="btn-oauth"
            onClick={() => {
              setLoading("microsoft");
              signIn(PROVIDER_ID.microsoft, { callbackUrl: "/dashboard" });
            }}
            disabled={loading !== null}
          >
            {t("auth.provider.microsoft")}
          </button>
        )}
      </div>

      <LiyonDialog open={showSetupModal} onOpenChange={setShowSetupModal} wide>
        <LiyonDialogCloseButton label={t("auth.oauthNotConfigured.close")} />
        <LiyonDialogHeader
          title={t("auth.oauthNotConfigured.title")}
          description={t("auth.oauthNotConfigured.desc")}
        />
        <LiyonDialogBody>
          <div className="space-y-4 text-sm text-[var(--text-2)]">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--brand-surface)] border border-[var(--brand-border)] text-[var(--brand-ink)]">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-[var(--text)]">
                  {t("auth.oauthNotConfigured.autoProvisionTitle")}
                </strong>
                <p className="mt-1 text-xs">
                  {t("auth.oauthNotConfigured.autoProvisionDesc")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-[var(--text)]">
                {t("auth.oauthNotConfigured.adminInstructions")}
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
                <li>
                  {t("auth.oauthNotConfigured.step1")}{" "}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--brand-ink)] underline font-medium"
                  >
                    Google Cloud Console <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>{t("auth.oauthNotConfigured.step2")}</li>
              </ol>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)]">
                {t("auth.oauthNotConfigured.redirectUriLabel")}
              </label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--bg-base)] border border-[var(--glass-border)] font-mono text-xs select-all break-all">
                <span className="flex-1 text-[var(--text)]">{redirectUri}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 px-2.5 text-xs flex items-center gap-1 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t("auth.oauthNotConfigured.copied") : t("auth.oauthNotConfigured.copy")}
                </Button>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-semibold text-[var(--text)]">
                {t("auth.oauthNotConfigured.step3")} (<code>.env.production</code>):
              </p>
              <pre className="p-2.5 rounded bg-[var(--bg-base)] border border-[var(--glass-border)] font-mono text-[11px] overflow-x-auto text-[var(--text)]">
{`GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"`}
              </pre>
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button
            type="button"
            onClick={() => setShowSetupModal(false)}
            className="w-full sm:w-auto"
          >
            {t("auth.oauthNotConfigured.close")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </>
  );
}
