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

  async function fetchPhoton(query, requireCityMatch = false) {
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query
      )}&limit=10`;

      const res = await axios.get(url);
      const features = res.data?.features;

      if (!Array.isArray(features) || features.length === 0) {
        return [0, 0];
      }

      // Normalize input
      const cityLower = city.toLowerCase();
      const stateLower = state.toLowerCase();

      // 🔥 STRICT FILTER: same city + state
      if (requireCityMatch) {
        const match = features.find(f => {
          const p = f.properties || {};
          return (
            p.city?.toLowerCase() === cityLower ||
            p.county?.toLowerCase() === cityLower
          ) && p.state?.toLowerCase() === stateLower;
        });

        if (!match) return [0, 0];

        const [lon, lat] = match.geometry.coordinates;
        return [parseFloat(lon), parseFloat(lat)];
      }

      // Loose match (fallback)
      const [lon, lat] = features[0].geometry.coordinates;
      return [parseFloat(lon), parseFloat(lat)];
    } catch (err) {
      console.log("Photon error:", err.message);
      return [0, 0];
    }
  }

  // ===============================
  // 1️⃣ STRICT spot-in-city search
  // ===============================
  const strictQueries = [
    `${name}, ${address}, ${city}, ${state}, India`,
    `${name}, ${city}, ${state}, India`,
  ];

  for (const q of strictQueries) {
    const coords = await fetchPhoton(q, true);
    if (!(coords[0] === 0 && coords[1] === 0)) {
      return coords;
    }
  }

  // ===============================
  // 2️⃣ FALLBACK → city center
  // ===============================
  const cityCoords = await fetchPhoton(
    `${city}, ${state}, India`,
    false
  );

  if (!(cityCoords[0] === 0 && cityCoords[1] === 0)) {
    return cityCoords;
  }

  // ===============================
  // 3️⃣ FINAL FALLBACK
  // ===============================
  return [0, 0];
}
