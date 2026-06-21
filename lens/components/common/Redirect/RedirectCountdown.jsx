"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Paper from "../Paper/index";

function RedirectCountdown({ redirectPath, location }) {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (count === 0) {
      router.push(redirectPath);
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, router, redirectPath]);

  return (
    <Paper>
      <h2>
        Redirecting to {location} in {count} sec...
      </h2>
    </Paper>
  );
}

export default RedirectCountdown;
