// 📁 public/js/main.js
import { firstLogin, changePassword } from './auth.js';
import { createAccount, generateEmail } from './account.js';
import { submitEnquiry } from './enquiry.js';

// ✅ FIRST LOGIN FORM (FirstLogin.html)
const firstLoginForm = document.getElementById('firstLoginForm');
if (firstLoginForm) {
  console.log('✅ First login form found');
  firstLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('🚀 Submitting first login form');
    await firstLogin();
  });
}

// ✅ CREATE ACCOUNT BUTTON (optional for button click case)
const createAccountBtn = document.getElementById('createAccountBtn');
if (createAccountBtn) {
  createAccountBtn.onclick = createAccount;
}

// ✅ SUBMIT ENQUIRY
const submitEnquiryBtn = document.getElementById('submitEnquiryBtn');
if (submitEnquiryBtn) {
  submitEnquiryBtn.onclick = submitEnquiry;
}

// ✅ FORGOT PASSWORD REDIRECT
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
if (forgotPasswordBtn) {
  forgotPasswordBtn.onclick = () => {
    window.location.href = 'ChangePassword.html';
  };
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
    const response = await fetch('http://localhost:3000/api/security-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Login successful!');
      window.location.href = 'CreateNewAccount.html';
    } else {
      alert(result.error || 'Login failed');
    }
  } catch (err) {
    alert('Login error: ' + err.message);
  }
}

// ✅ BIND DEFAULT LOGIN FORM (SecurityLogin.html)
const defaultLoginForm = document.getElementById('defaultLoginForm');
if (defaultLoginForm) {
  defaultLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    defaultLogin();
  });
}

// ✅ Show/hide password toggle
window.togglePassword = function (id) {
  const field = document.getElementById(id);
  field.type = field.type === 'password' ? 'text' : 'password';
};

// ✅ DOMContentLoaded: Bind form and generate email logic
document.addEventListener('DOMContentLoaded', () => {
  // 🔐 Change Password form
  const changePasswordForm = document.getElementById('changePasswordForm');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await changePassword();
    });
  }

  // 👤 Create Account form
  const createAccountForm = document.getElementById('createAccountForm');
  if (createAccountForm) {
    createAccountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      createAccount();
    });
  }

  // 📨 Auto-generate email when first or last name changes
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');

  if (firstNameInput) firstNameInput.addEventListener('input', generateEmail);
  if (lastNameInput) lastNameInput.addEventListener('input', generateEmail);
});
