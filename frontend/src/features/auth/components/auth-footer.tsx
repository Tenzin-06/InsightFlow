export function AuthFooter() {
  return (
    <p className="mt-6 text-center text-xs text-text-muted">
      By continuing, you agree to our{" "}
      <a
        href="#"
        className="text-primary-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="#"
        className="text-primary-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        Privacy Policy
      </a>
    </p>
  );
}
