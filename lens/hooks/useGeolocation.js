"use client";

import { useEffect,useState } from "react";
export const useGeolocation = () => {const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) {setError("Geolocation is not supported by your browser");
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }, () => setError("Location access denied. Please allow location access to use this feature."),{enableHighAccuracy: true});
  }, []);
  return { location, error };
};