"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROUTE_PATHS } from "@/config/RoutePath";

export const Header = () => {
  const { logout, user } = useAuth();

  const initial = user ? user[0]?.toUpperCase() : "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href={ROUTE_PATHS.HOME}
          className="flex items-center gap-2 text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          aria-label="MyNextDuty home"
        >
          <span className="text-lg font-bold tracking-tight">MyNextDuty</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="flex size-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
            aria-label={`Logged in as ${user ?? "user"}`}
          >
            {initial}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            aria-label="Log out"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};
