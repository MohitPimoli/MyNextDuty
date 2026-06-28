"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setRouter } from "@/service/navigation.service";

/**
 * Captures the Next.js router instance and stores it in the navigation service.
 * Must be mounted inside a client boundary (e.g., StoreProvider in root layout).
 * Renders nothing — exists only to bridge useRouter into the service layer.
 */
const NavigationSetter = () => {
  const router = useRouter();

  // Store immediately on render (not just in useEffect) so the router
  // is available synchronously before any effect fires.
  setRouter(router);

  useEffect(() => {
    setRouter(router);
  }, [router]);

  return null;
};

export default NavigationSetter;
