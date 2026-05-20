import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

// Placeholder — replaced with real auth state in Unit 6
const isAuthenticated = false;

export function Navigation() {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">Dashboard</Link>
        </Button>
        <button
          className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User account"
        >
          <span className="text-xs font-semibold text-primary-700">U</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/login">Login</Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/register">Sign Up</Link>
      </Button>
    </div>
  );
}
