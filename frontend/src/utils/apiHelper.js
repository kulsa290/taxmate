const BASE_URL =
  process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "";

const buildUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return BASE_URL ? `${BASE_URL}${normalizedPath}` : normalizedPath;
};

const fetchJson = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed ${response.status}: ${errorText}`);
  }

  return response.json();
};

export const getHealth = async () => {
  return fetchJson("/health");
};

export default {
  getHealth,
};
