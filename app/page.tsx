"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import Image from "next/image";
import SignInButton from "./(components)/SignInButton";

export default function Home() {
  const { jwt } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (jwt) {
      router.push("/console/collections");
    }
  }, [jwt, router]);

  if (jwt) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 items-center text-center">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="Loyalty Forge"
          width={320}
          height={320}
          priority
        />
        <h1 className="text-4xl font-bold">Loyalty Forge</h1>
        <p className="text-xl text-gray-600 max-w-md">
          Create and manage loyalty programs with NFTs
        </p>
        <SignInButton />
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500">
        <a href="/about" className="hover:text-gray-900">About</a>
        <a href="/contact" className="hover:text-gray-900">Contact</a>
        <a href="/privacy-policy" className="hover:text-gray-900">Privacy Policy</a>
        <a href="/terms-of-service" className="hover:text-gray-900">Terms of Service</a>
      </footer>
    </div>
  );
}