import axios from "axios";

export async function getCoordinates({
  name = "",
  address = "",
  city = "",
  state = "",
  latitude,
  longitude,
}) {
  // 1️⃣ Manual override
  if (latitude && longitude) {
    return [parseFloat(longitude), parseFloat(latitude)];
  }

  async function fetchCoordinates(query) {
    try {
      // Respect Nominatim 1 req/sec rule
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;

      const res = await axios.get(url, {
        headers: {
          "User-Agent":
            "SheherJaano/1.0 (contact: itsekanshgupta@gmail.com)", 
          "Accept-Language": "en",
        },
        timeout: 8000,
      });

      // If no results → return [0,0]
      if (!Array.isArray(res.data) || res.data.length === 0) {
        console.warn("Nominatim empty response for:", query);
        return [0, 0];
      }

      const loc = res.data[0];
      return [parseFloat(loc.lon), parseFloat(loc.lat)];
    } catch (err) {
      console.error("Geocode error:", err.message);
      return [0, 0]; // ALWAYS return fallback
    }
  }

  // 2️⃣ Waterfall queries
  const queries = [
    `${name}, ${address}, ${city}, ${state}`,
    `${address}, ${city}, ${state}`,
    `${city}, ${state}`,
  ];

  for (const q of queries) {
    const coords = await fetchCoordinates(q);
    if (!(coords[0] === 0 && coords[1] === 0)) {
      return coords; // found real coords
    }
  }

  // 3️⃣ Final fallback
  return [0, 0];
}
