'use client';

import { SignedIn, SignedOut } from "@clerk/nextjs";
import SlapApp from "./components/SlapApp";
import LandingPage from "./components/LandingPage";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#e6e2dd] text-[#2c3e50] relative">
      <SignedIn>
        <SlapApp />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </main>
  );
}
