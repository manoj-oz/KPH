// 📁 public/js/ui.js

// 🔒 Hide all sections on the page (used only for single-page UI flows)
export function hideAllSections() {
  document.querySelectorAll('.form-section').forEach(sec => {
    sec.style.display = 'none';
  });
}

// ✅ Redirect to login page after signup
export function showFirstLogin() {
  window.location.href = 'login.html';  // Change to 'login.html' if that's your login page
}

// 🔐 Redirect to change password page (optional)
export function showChangePasswordPage() {
  window.location.href = 'ChangePassword.html';  // Optional if using multiple pages
}

// 📄 Redirect to forms dashboard after login (optional)
export function showFormsPage() {
  window.location.href = 'Dashboard.html';  // Use your real dashboard page
}

// 🧾 Redirect to create account page (optional)
export function showCreateAccountPage() {
  window.location.href = 'CreateNewAccount.html';  // Or keep hiding logic if SPA
}
