export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  
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
  catch (err) {
    console.log(err);

    return {
      status: 999,
      data: null
    };
  }
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