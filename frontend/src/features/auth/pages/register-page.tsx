import { Link } from "react-router-dom";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function RegisterPage() {
  return (
    <AuthCard>
      {/* Tab switcher */}
      <div className="flex border-b border-border-default mb-6">
        <Link
          to="/login"
          className="pb-3 px-1 mr-6 text-sm font-medium text-text-muted hover:text-text-secondary transition-colors focus-visible:outline-none"
        >
          Login
        </Link>
        <span className="pb-3 px-1 text-sm font-semibold text-primary-600 border-b-2 border-primary-600 cursor-default">
          Sign Up
        </span>
      </div>

      <SignupForm />
      <AuthFooter />
    </AuthCard>
  );
}
