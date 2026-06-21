"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { userMarkerIcon, nearbyUserMarkerIcon } from "@/util/leafletIcon";
import "leaflet/dist/leaflet.css";
import "./map.scss";

const Map = ({ location, nearbyUsers, onLocationChange }) => {
  return (
    <MapContainer center={[location.latitude, location.longitude]} zoom={15} className="map">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Your location */}
      <Marker
        position={[location.latitude, location.longitude]}
        draggable
        icon={userMarkerIcon}
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            onLocationChange({ latitude: lat, longitude: lng });
          },
        }}
      >
        <Popup>Your Location</Popup>
      </Marker>

      {/* Nearby users */}
      {nearbyUsers.map((u) => (
        <Marker key={u.id} position={[u.latitude, u.longitude]} icon={nearbyUserMarkerIcon}>
          <Popup>
            <strong>
              {u.firstName} {u.lastName}
            </strong>
            <br />
            {u.email}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
