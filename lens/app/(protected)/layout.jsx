"use client";

import { Footer } from "@/components/Hooter/Footer";

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </div>
      <Footer />
    </div>
  );
}
