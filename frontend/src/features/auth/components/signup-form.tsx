import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useSignUp } from "@clerk/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./password-input";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupValues) {
    if (!signUp) return;
    setIsLoading(true);
    setAuthError(null);
    try {
      const nameParts = values.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || undefined;

      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName,
        lastName,
      });
      // AuthenticationLayout detects isSignedIn and redirects to /dashboard
    } catch (err: any) {
      setAuthError(err?.errors?.[0]?.message ?? "Could not create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div id="clerk-captcha" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Jane Smith"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-xs text-danger" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="name@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="signup-email-error" className="text-xs text-danger" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            id="signup-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "signup-password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="signup-password-error" className="text-xs text-danger" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-xs text-danger" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {authError && (
          <p className="text-xs text-danger" role="alert">
            {authError}
          </p>
        )}

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
}
