import fetch from "node-fetch";

const BASE_URL = "https://rb209-api-v1.ahdb.org.uk/api";

/**
 * Creates a Basic Auth header from username and licence key.
 */
function makeAuthHeader(username, licenceKey) {
  const credentials = Buffer.from(`${username}:${licenceKey}`).toString(
    "base64"
  );
  return `Basic ${credentials}`;
}

/**
 * Performs a GET request to the RB209 API.
 */
async function get(path, username, licenceKey) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: makeAuthHeader(username, licenceKey),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `RB209 API GET ${path} failed: ${response.status} ${response.statusText} — ${text}`
    );
  }

  return response.json();
}

/**
 * Performs a POST request to the RB209 API.
 */
async function post(path, body, username, licenceKey) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: makeAuthHeader(username, licenceKey),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `RB209 API POST ${path} failed: ${response.status} ${response.statusText} — ${text}`
    );
  }

  return response.json();
}

/**
 * GET /api/arable/cropgroups — list all arable crop groups.
 */
export async function getCropGroups(username, licenceKey) {
  return get("/arable/cropgroups", username, licenceKey);
}

/**
 * GET /api/arable/croptypes/{cropGroupId} — list crop types for a group.
 */
export async function getCropTypes(cropGroupId, username, licenceKey) {
  return get(`/arable/croptypes/${cropGroupId}`, username, licenceKey);
}

/**
 * GET /api/soil/soiltypes — list all soil types.
 */
export async function getSoilTypes(username, licenceKey) {
  return get("/soil/soiltypes", username, licenceKey);
}

/**
 * GET /api/previouscropping/previouscrops — list previous crop options for SNS.
 */
export async function getPreviousCrops(username, licenceKey) {
  return get("/previouscropping/previouscrops", username, licenceKey);
}

/**
 * POST /api/main/recommendations — calculate nutrient recommendations.
 *
 * @param {object} fieldData - Full field data object as per the RB209 API spec.
 * @param {string} username
 * @param {string} licenceKey
 */
export async function getRecommendations(fieldData, username, licenceKey) {
  return post("/main/recommendations", fieldData, username, licenceKey);
}
