export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  console.log(response);

  let data = null;

  // Safely parse JSON if present
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  return {
    status: response.status,
    data
  };
}

export const apiHelper = {
  get: (url) => apiRequest(url),
  post: (url, body) =>
    apiRequest(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (url, body) =>
    apiRequest(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  del: (url) =>
    apiRequest(url, {
      method: "DELETE",
    }),
};