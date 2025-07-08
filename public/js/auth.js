// 📁 auth.js
import { apiPost } from './api.js';
import { showChangePasswordPage, showFormsPage } from './ui.js';

export async function firstLogin() {
    const contact = document.getElementById('email').value.trim(); // Input still named email
    const password = document.getElementById('password').value.trim();

    if (!contact || !password) {
        alert('Please enter contact and password');
        return;
    }

    const data = await apiPost('/first-login', { contact, password });

    if (data.error) {
        alert(data.error || 'Login failed');
        return;
    }

    // ✅ Save contact to localStorage for future use
    localStorage.setItem('loggedInContact', data.contact);

    if (data.firstLogin) {
        showChangePasswordPage(); // First-time login
    } else {
        window.location.href = 'SelectAForm.html'; // Returning users
    }
}

export async function changePassword() {
    const contact = localStorage.getItem('loggedInContact'); // Fixed from 'userContact'
    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPasswordChange').value.trim();
    const confirmPassword = document.getElementById('retypeNewPassword').value.trim();

    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
        alert('Passwords do not match or are empty');
        return;
    }

    const data = await apiPost('/change-password', { contact, oldPassword, newPassword });

    if (data.error) {
        alert(data.error);
    } else {
        alert(data.message || 'Password changed!');
        window.location.href = 'SelectAForm.html';
    }
}

export async function fetchUserInfo() {
    const contact = localStorage.getItem('loggedInContact');
    if (!contact) return null;

    try {
        const res = await fetch(`http://localhost:3000/api/account/${contact}`);
        if (!res.ok) throw new Error('User fetch failed');

        const data = await res.json();
        return data;
    } catch (err) {
        console.error('⚠️ Failed to fetch user info:', err);
        return null;
    }
}
