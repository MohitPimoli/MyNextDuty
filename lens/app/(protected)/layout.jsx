"use client";

import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Hooter/Footer";

export default function ProtectedLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
