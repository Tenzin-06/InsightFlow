import { SignIn } from "@clerk/react";

import { clerkAppearance } from "@/lib/clerk-appearance";

export default function LoginPage() {
  return (
    <SignIn
      routing="path"
      path="/login"
      forceRedirectUrl="/dashboard"
      signUpUrl="/register"
      appearance={clerkAppearance}
    />
  );
}
