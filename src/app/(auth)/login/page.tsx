import { oauthProviderIds, isGoogleOAuthConfigured } from "@/features/identity/server";
import { LoginPanel } from "./_components/login-panel";

export default async function LoginPage() {
  return (
    <LoginPanel
      providers={oauthProviderIds()}
      googleConfigured={isGoogleOAuthConfigured()}
    />
  );
}
