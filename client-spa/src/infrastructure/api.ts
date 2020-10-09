export interface ProfileData {
  id: string;
  userPrincipalName: string;
  givenName: string;
  surname: string;
  jobTitle: string;
  mobilePhone: string;
  preferredLanguage: string;
}

let authHeaders = {
  "Content-Type": "application/json",
  Authorization: "",
};

export function setBearerToken(token: string) {
  authHeaders.Authorization = `Bearer ${token}`;
}

/**
 * Example for a call that is not marked requiring auth on the server
 */
export async function getEnv(): Promise<string> {
  const response = await fetch("/api/environment");
  const json = await response.json();
  return json.env;
}

export async function getProfileData() : Promise<ProfileData> {
  ensureTokenIsSet();
  const response = await fetch("/api/profile/me", {
    method: "GET",
    headers: authHeaders,
  });
  return await checkResponse(response);
}

function ensureTokenIsSet() {
  if (!authHeaders.Authorization) {
    throw Error("Missing bearer token.");
  }
}

async function checkResponse(response: Response) {
  if (response.status === 200) {
    return await response.json();
  }
  else if (response.status === 401) {
    const message = response.headers.get("www-authenticate")!;
    throw Error(`Unauthorized: ${message}`);
  }
  else {
    throw Error(`Status ${response.status}`);
  }
}