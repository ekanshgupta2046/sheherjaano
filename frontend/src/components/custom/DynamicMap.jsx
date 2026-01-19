// src/components/DynamicMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
};

// ADDED: defaultLat and defaultLng props
const DynamicMap = ({ state, city, address, defaultLat, defaultLng }) => {
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 });
  const [zoom, setZoom] = useState(5);
  const [displayName, setDisplayName] = useState("India");

  useEffect(() => {
    // STRATEGY 1: Use provided coordinates (Database/Manual)
    if (defaultLat && defaultLng) {
        setCoords({ lat: defaultLat, lng: defaultLng });
        setDisplayName(address || city);
        setZoom(15); // Detailed view
        return; 
    }

    // STRATEGY 2: Search via API (Auto-detect)
    let query = "";
    if (address && address.trim() !== "") {
      query = `${address}, ${city}, ${state}`;
      setZoom(16);
    } else {
      query = `${city}, ${state}`;
      setZoom(12);
    }

    if (!city && !state) return;

    const fetchCoordinates = async () => {
      try {
        // Remember to add &email=your@email.com for production!
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          const location = data[0];
          setCoords({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
          setDisplayName(location.display_name);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
        fetchCoordinates();
    }, 1000);

    return () => clearTimeout(delayDebounce);

  }, [city, state, address, defaultLat, defaultLng]);

  return (
    <div className="h-full w-full rounded-[2rem] overflow-hidden">
      <MapContainer 
        center={[coords.lat, coords.lng]} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={coords.lat} lng={coords.lng} zoom={zoom} />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>{displayName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DynamicMap;