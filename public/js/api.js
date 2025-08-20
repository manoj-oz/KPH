// 📁 public/js/api.js

// Automatically handles same-origin or localhost:3000
const isLocalhost = window.location.hostname === 'localhost';
export const API_BASE = isLocalhost ? 'http://localhost:3000' : '';

// ✅ Ensures correct route prefixing (avoids double `/api/api`)
function normalizePath(path) {
  return path.startsWith('/api') ? path : `/api${path}`;
}

// ✅ POST request handler
export async function apiPost(path, data) {
  const fullPath = normalizePath(path);
  try {
    const res = await fetch(`${API_BASE}${fullPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid JSON response');
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ POST ${fullPath} failed:`, err);
    return { error: 'Network or server error' };
  }
}

// ✅ GET request handler
export async function apiGet(path) {
  const fullPath = normalizePath(path);
  try {
    const res = await fetch(`${API_BASE}${fullPath}`);

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid JSON response');
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ GET ${fullPath} failed:`, err);
    return { error: 'Network or server error' };
  }
}
