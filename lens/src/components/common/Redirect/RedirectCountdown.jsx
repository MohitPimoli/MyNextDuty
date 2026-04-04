import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "../Paper/index";

function RedirectCountdown({ redirectPath, location }) {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) {
      navigate(redirectPath);
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  return (
    <Paper>
      <h2>
        Redirecting to {location} in {count} sec...
      </h2>
    </Paper>
  );
}

export default RedirectCountdown;
