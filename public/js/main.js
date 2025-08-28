import { firstLogin, changePassword } from './auth.js';
import { createAccount, generateEmail } from './account.js';
import { submitEnquiry, API_BASE } from './api.js'; // ✅ import API_BASE

// ✅ Save access controls consistently
function saveAccessControls(data) {
  const access = {
    enquiry: data.access_enquiry,
    demo: data.access_demo,
    student: data.access_student
  };
  localStorage.setItem('accessControls', JSON.stringify(access));
  localStorage.setItem('userAccess', JSON.stringify(access));
}

// ✅ Save user session data
function saveUserSession(user) {
  localStorage.setItem('first_login', user.first_login);
  localStorage.setItem('user_id', user.user_id);
  localStorage.setItem('user_contact', user.contact);
  saveAccessControls(user);
  window.location.href = "SelectAForm.html";
}

// ✅ DEFAULT LOGIN (SecurityLogin.html)
async function defaultLogin() {
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('defaultPassword')?.value.trim();

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/security-login`, { // ✅ use API_BASE
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ Login successful!');

      localStorage.setItem('accessControls', JSON.stringify({
        enquiry: result.access_enquiry,
        demo: result.access_demo,
        student: result.access_student
      }));

      localStorage.setItem('securityUser', username);
      window.location.href = 'CreateNewAccount.html';
    } else {
      alert(`❌ ${result.error || 'Login failed'}`);
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('❌ Failed to connect to server. Please check your internet or backend.');
  }
}

// ✅ DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('defaultLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    defaultLogin();
  });

  document.getElementById('firstLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await firstLogin();
    if (result?.user) saveUserSession(result.user);
  });

  document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await changePassword();
  });

  document.getElementById('createAccountForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    createAccount();
  });

  document.getElementById('submitEnquiryBtn')?.addEventListener('click', submitEnquiry);
  document.getElementById('createAccountBtn')?.addEventListener('click', createAccount);

  document.getElementById('forgotPasswordBtn')?.addEventListener('click', () => {
    window.location.href = 'ChangePassword.html';
  });

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  if (firstNameInput) firstNameInput.addEventListener('input', generateEmail);
  if (lastNameInput) lastNameInput.addEventListener('input', generateEmail);

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
      const response = await fetch(`${API_BASE}/api/logout`, { // ✅ use API_BASE
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.clear();
        window.location.href = 'login.html';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  });

  // ✅ Forgot Password Form Handler
  document.getElementById('forgotPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contact = document.getElementById('forgotEmail').value.trim();
    const dob = document.getElementById('forgotDob').value.trim();
    const newPassword = document.getElementById('forgotNewPassword').value.trim();
    const confirmPassword = document.getElementById('forgotRetypePassword').value.trim();

    if (!contact || !dob || !newPassword || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/forgot-password`, { // ✅ use API_BASE
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, dob, new_password: newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Password reset successful!');
        window.location.href = 'login.html';
      } else {
        alert(`❌ ${result.error || 'Password reset failed.'}`);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      alert("❌ Server error. Please try again later.");
    }
  });
});

// ✅ Toggle Password Visibility
window.togglePassword = function (id) {
  const field = document.getElementById(id);
  field.type = field.type === 'password' ? 'text' : 'password';
};
