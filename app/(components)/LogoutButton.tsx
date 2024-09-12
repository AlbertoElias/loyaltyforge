"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Button onClick={handleLogout} variant="secondary" className="w-full">
      Logout
    </Button>
  );
}