import { apiPost } from './api.js';
import { showChangePasswordPage } from './ui.js';

const API_BASE_URL = 'https://kph-f581.onrender.com';

// 🔐 First Login
export async function firstLogin() {
  const contact = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  if (!contact || !password) {
    alert('Please enter contact and password');
    return;
  }

  const data = await apiPost('/first-login', { contact, password });

  if (!data || data.error) {
    alert(data?.error || 'Login failed');
    return;
  }

  // ✅ Save user data in localStorage
// ✅ Store contact for legacy compatibility
localStorage.setItem('loggedInContact', data.contact);

// ✅ Store user object (needed for role-based access)
localStorage.setItem('user', JSON.stringify(data.user || {
  contact: data.contact,
  role: data.role || 'enquiry',  // fallback
}));

// ✅ Store token if your backend returns it
if (data.token) {
  localStorage.setItem('token', data.token);
}

// ✅ Store access flags
localStorage.setItem('accessControls', JSON.stringify({
  enquiry: data.access_enquiry,
  demo: data.access_demo,
  student: data.access_student
}));

// ✅ First-time password change flow
if (data.first_login) {
  localStorage.setItem('first_login', JSON.stringify(true));
  showChangePasswordPage();
} else {
  localStorage.setItem('first_login', JSON.stringify(false));
  window.location.href = 'SelectAForm.html';
}


  if (data.first_login) {
    showChangePasswordPage();
  } else {
    window.location.href = 'SelectAForm.html';
  }
}

// 🔑 Password Change
export async function changePassword() {
  const contact = localStorage.getItem('loggedInContact');
  const oldPassword = document.getElementById('oldPassword')?.value.trim();
  const newPassword = document.getElementById('newPasswordChange')?.value.trim();
  const confirmPassword = document.getElementById('retypeNewPassword')?.value.trim();

  if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
    alert('Passwords do not match or are empty');
    return;
  }

  const data = await apiPost('/change-password', { contact, oldPassword, newPassword });

  if (!data || data.error) {
    alert(data?.error || 'Password change failed');
    return;
  }

  alert(data.message || 'Password changed successfully!');
  localStorage.setItem('first_login', JSON.stringify(false));

  if (data.access_enquiry !== undefined) {
    localStorage.setItem('accessControls', JSON.stringify({
      enquiry: data.access_enquiry,
      demo: data.access_demo,
      student: data.access_student
    }));
  }

  window.location.href = 'SelectAForm.html';
}

// 👤 Fetch user info (if needed elsewhere)
export async function fetchUserInfo() {
  const contact = localStorage.getItem('loggedInContact');
  if (!contact) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/account/${contact}`);
    if (!res.ok) throw new Error('User fetch failed');
    return await res.json();
  } catch (err) {
    console.error('⚠️ Failed to fetch user info:', err);
    return null;
  }
}

// 📦 Manual Access Refresh (optional)
export async function storeUserAccess(contact) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/account/${contact}`);
    if (!res.ok) throw new Error('User access fetch failed');
    const data = await res.json();

    localStorage.setItem('accessControls', JSON.stringify({
      enquiry: data.access_enquiry,
      demo: data.access_demo,
      student: data.access_student
    }));
  } catch (err) {
    console.error('⚠️ Failed to fetch user access:', err);
  }
}
