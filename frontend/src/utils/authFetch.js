// authFetch.js
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  const response = await fetch(url, { ...options, headers });

  // 🔥 Si el token es inválido o expiró
  if (response.status === 401 || response.status === 403) {
    console.warn("Token inválido o expirado. Redirigiendo al login...");

    localStorage.clear();
    window.location.href = "/login"; // redirección inmediata
    return;
  }

  return response;
};
