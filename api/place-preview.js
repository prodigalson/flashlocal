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
  // Only successful lookups are worth caching; a cached failure would hide a fix for a day.
  response.setHeader("Cache-Control", statusCode === 200 && !payload.error
    ? "s-maxage=86400, stale-while-revalidate=604800"
    : "no-store");
  response.end(JSON.stringify(payload));
}

async function googleJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Places request failed with ${response.status}`);
  }
  const data = await response.json();
  // Google answers 200 even when it refuses the key, and says why in `status`.
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    const refusal = new Error("Google Places refused the request");
    refusal.googleStatus = String(data.status);
    refusal.googleMessage = String(data.error_message || "");
    throw refusal;
  }
  return data;
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

// Google's photo endpoint needs the API key in its URL, so that URL must never
// reach the browser. Ask Google where the image lives and return that address,
// which carries no key.
async function photoUrl(photoReference, key) {
  if (!photoReference) return "";
  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("maxwidth", "700");
  url.searchParams.set("photo_reference", photoReference);
  url.searchParams.set("key", key);
  try {
    const response = await fetch(url, { redirect: "manual" });
    const location = response.headers.get("location") || "";
    return location.startsWith("https://") && !location.includes(key) ? location : "";
  } catch (error) {
    return "";
  }
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
      photo_url: await photoUrl(place.photos?.[0]?.photo_reference, key)
    });
  } catch (error) {
    if (error.googleStatus) {
      sendJson(response, 502, {
        error: "google_places_refused",
        google_status: error.googleStatus,
        // The key never appears in Google's messages; strip it anyway.
        google_message: error.googleMessage.split(key).join("[key]").slice(0, 300)
      });
      return;
    }
    sendJson(response, 502, { error: "google_places_unavailable" });
  }
};
