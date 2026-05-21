import { Link } from "react-router-dom";
import { Show, UserButton } from "@clerk/react";

import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <>
      <Show when="signed-out">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <UserButton />
        </div>
      </Show>
    </>
  );
}
