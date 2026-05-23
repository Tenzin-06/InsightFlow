import { Link } from "react-router-dom";

import { useAuth } from "@/features/auth/context/auth-context";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/user-nav";

export function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't flash auth controls while hydrating from localStorage
  if (isLoading) return null;

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">Dashboard</Link>
        </Button>
        <UserNav />
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
