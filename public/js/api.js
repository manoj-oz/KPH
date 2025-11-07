// 📁 public/js/api.js

// ✅ Detect environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// ✅ Backend base URL
// - Local dev → points to Express server (port 3000)
// - Production (Azure App Service) → use your Azure URL

export const API_BASE = isLocal 
  ? 'http://localhost:3000' 
  : 'https://kphtrainings-dhcff0c6dsbbcff0.canadacentral-01.azurewebsites.net';


// ✅ Normalize API path (avoids double /api/api)
function normalizePath(path) {
  return path.startsWith('/api') ? path : `/api${path}`;
}

// ✅ POST request
export async function apiPost(path, data) {
  const fullPath = normalizePath(path);
  try {
    const res = await fetch(`${API_BASE}${fullPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ POST ${fullPath} failed:`, err);
    return { error: 'Network or server error' };
  }
}

// ✅ GET request
export async function apiGet(path) {
  const fullPath = normalizePath(path);
  try {
    const res = await fetch(`${API_BASE}${fullPath}`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ GET ${fullPath} failed:`, err);
    return { error: 'Network or server error' };
  }
}
