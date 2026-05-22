import { UserButton } from "@clerk/react";

export function UserNav() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-8 w-8",
        },
      }}
    />
  );
}
