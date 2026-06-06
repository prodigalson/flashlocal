const detailsFields = [
  "place_id",
  "name",
  "formatted_address",
  "geometry",
  "rating",
  "user_ratings_total",
  "opening_hours",
  "photos",
  "url"
].join(",");

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
  response.end(JSON.stringify(payload));
}

async function googleJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Places request failed with ${response.status}`);
  }
  return response.json();
}

async function findPlaceId(query, key) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", query);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id");
  url.searchParams.set("key", key);

  const data = await googleJson(url);
  return data.candidates?.[0]?.place_id || "";
}

async function getPlaceDetails(placeId, key) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", detailsFields);
  url.searchParams.set("key", key);

  const data = await googleJson(url);
  return data.result || null;
}

function photoUrl(photoReference, key) {
  if (!photoReference) return "";
  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("maxwidth", "700");
  url.searchParams.set("photo_reference", photoReference);
  url.searchParams.set("key", key);
  return url.toString();
}

module.exports = async function handler(request, response) {
  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  const requestUrl = new URL(request.url, `https://${request.headers.host || "flashlocal.local"}`);
  const query = requestUrl.searchParams.get("query") || "";
  const requestedPlaceId = requestUrl.searchParams.get("place_id") || "";

  if (!key) {
    sendJson(response, 200, { error: "missing_google_maps_api_key" });
    return;
  }

  if (!query && !requestedPlaceId) {
    sendJson(response, 400, { error: "query_or_place_id_required" });
    return;
  }

  try {
    const placeId = requestedPlaceId || await findPlaceId(query, key);
    if (!placeId) {
      sendJson(response, 404, { error: "place_not_found" });
      return;
    }

    const place = await getPlaceDetails(placeId, key);
    if (!place) {
      sendJson(response, 404, { error: "place_details_not_found" });
      return;
    }

    sendJson(response, 200, {
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      open_now: place.opening_hours?.open_now,
      google_maps_url: place.url,
      photo_url: photoUrl(place.photos?.[0]?.photo_reference, key)
    });
  } catch (error) {
    sendJson(response, 502, { error: "google_places_unavailable" });
  }
};
