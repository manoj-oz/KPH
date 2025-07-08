// 📁 public/js/ui.js

export function hideAllSections() {
  document.querySelectorAll('.form-section').forEach(sec => {
    sec.style.display = 'none';
  });
}

export function showFirstLogin() {
  hideAllSections();
  const section = document.getElementById('firstLoginSection');
  if (section) section.style.display = 'block';
}

export function showChangePasswordPage() {
  hideAllSections();
  const section = document.getElementById('changePasswordSection');
  if (section) section.style.display = 'block';
}

export function showFormsPage() {
  hideAllSections();
  const section = document.getElementById('formsSection');
  if (section) section.style.display = 'block';
}

// ✅ Add more sections as needed
export function showCreateAccountPage() {
  hideAllSections();
  const section = document.getElementById('createAccountSection');
  if (section) section.style.display = 'block';
}
