import axios from "axios";

export async function getCoordinates({
  name = "",
  address = "",
  city = "",
  state = "",
  latitude,
  longitude,
}) {
  // 1️⃣ If user manually provides lat/lng → use it
  if (latitude && longitude) {
    return [parseFloat(longitude), parseFloat(latitude)];
  }

  async function fetchCoordinates(query) {
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query
      )}&limit=1`;

      const res = await axios.get(url);

      const features = res.data?.features;
      if (
        Array.isArray(features) &&
        features.length > 0 &&
        features[0].geometry?.coordinates
      ) {
        const [lon, lat] = features[0].geometry.coordinates;
        return [parseFloat(lon), parseFloat(lat)];
      }

      // No match → fallback
      return [0, 0];
    } catch (error) {
      console.log("Photon error:", error.message);
      return [0, 0]; // Always fallback
    }
  }

  // 2️⃣ Waterfall queries (most specific → least specific)
  const queries = [
    `${name}, ${address}, ${city}, ${state}`,
    `${address}, ${city}, ${state}`,
    `${city}, ${state}`,
  ];

  for (const q of queries) {
    const coords = await fetchCoordinates(q);

    // Return if valid
    if (!(coords[0] === 0 && coords[1] === 0)) {
      return coords;
    }
  }

  // 3️⃣ Final fallback
  return [0, 0];
}
