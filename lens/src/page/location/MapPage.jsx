"use client";

import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import Map from "@/components/Map/Map";
import { updateUserLocation, getNearbyUsers } from "@/service/location.service";

const MapPage = () => {
  const userId = Number(localStorage.getItem("userId"));
  const { location, error } = useGeolocation();

  const [selectedLocation, setSelectedLocation] = useState(location);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  const effectiveLocation = selectedLocation || location;

  const handleUpdateLocation = async () => {
    await updateUserLocation(userId, {
      latitude: effectiveLocation.latitude,
      longitude: effectiveLocation.longitude,
    });
    alert("Location updated successfully");
  };

  const handleGetNearbyUsers = async () => {
    const res = await getNearbyUsers(userId);
    setNearbyUsers(res.data.data);
  };

  if (error) return <p>{error}</p>;
  if (!effectiveLocation) return <p>Fetching location…</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nearby Users</h1>
        <p className="text-gray-500 text-sm">Set your location and discover users around you</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-5 space-y-4">
        <Map
          location={effectiveLocation}
          nearbyUsers={nearbyUsers}
          onLocationChange={setSelectedLocation}
        />

        <div className="flex justify-between text-sm text-gray-600">
          <span>Latitude: {effectiveLocation.latitude.toFixed(6)}</span>
          <span>Longitude: {effectiveLocation.longitude.toFixed(6)}</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleUpdateLocation}
            className="px-5 py-2 rounded-lg bg-green-600 text-white"
          >
            Update Location
          </button>

          <button
            onClick={handleGetNearbyUsers}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Get Nearby Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
