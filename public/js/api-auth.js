// 📁 public/js/api-auth.js

const isLocalhost = window.location.hostname === 'localhost';
export const API_BASE = isLocalhost ? 'http://localhost:3000' : '';

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
        Authorization: `Bearer ${token}`
      }
    });

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid JSON response');
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ Auth GET ${fullPath} failed:`, err);
    return { error: 'Network or server error' };
  }
}
