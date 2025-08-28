// 📁 public/js/api-auth.js

// ✅ Detect environment automatically
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_BASE = isLocalhost 
  ? 'http://localhost:3000'        // local dev
  : window.location.origin;       // Azure App Service / production

// ✅ Normalize path to avoid double /api
function normalizePath(path) {
  return path.startsWith('/api') ? path : `/api${path}`;
}

// ✅ Authenticated GET request
export async function apiAuthGet(path) {
  const fullPath = normalizePath(path);
  const token = localStorage.getItem('token'); // get token from storage

  try {
    const res = await fetch(`${API_BASE}${fullPath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // pass token for authentication
      }
    });

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid JSON response');
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ Auth GET ${fullPath} failed:`, err);
    return { error: 'Network or server error' };
  }
}
