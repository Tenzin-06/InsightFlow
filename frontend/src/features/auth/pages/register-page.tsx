import { SignUp } from "@clerk/react";

import { clerkAppearance } from "@/lib/clerk-appearance";

export default function RegisterPage() {
  return (
    <SignUp
      routing="path"
      path="/register"
      forceRedirectUrl="/dashboard"
      signInUrl="/login"
      appearance={clerkAppearance}
    />
  );
}
