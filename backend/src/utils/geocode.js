import axios from "axios";

export async function getCoordinates({
  name = "",
  address = "",
  city = "",
  state = "",
  latitude,
  longitude,
}) {
  // 1️⃣ Manual override (highest priority)
  if (latitude && longitude) {
    return [parseFloat(longitude), parseFloat(latitude)];
  }

  async function fetchCoordinates(query) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;

      const res = await axios.get(url, {
        headers: { "User-Agent": "SheherJaano/1.0" },
      });

      if (res.data && res.data.length > 0) {
        return res.data[0];
      }
      return null;
    } catch (err) {
      console.error("Geocode error:", err.message);
      return null;
    }
  }

  // 2️⃣ Smart waterfall (same as FamousSpot)
  const queries = [
    `${name}, ${address}, ${city}, ${state}`,
    `${address}, ${city}, ${state}`,
    `${city}, ${state}`,
  ];

  for (const q of queries) {
    const data = await fetchCoordinates(q);
    if (data) {
      return [parseFloat(data.lon), parseFloat(data.lat)];
    }
  }

  // 3️⃣ Fallback
  return [0, 0];
}
