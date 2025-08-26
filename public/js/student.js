// ✅ student.js
import { apiPost } from './api.js';

console.log("✅ student.js loaded");

// Navigate back
function goBack() {
  window.location.href = 'SelectAForm.html';
}

// Close popup
function closePopup() {
  document.getElementById("successPopup").style.display = "none";
  document.getElementById("studentForm").reset();
}

// Handle form submission
async function submitForm(event) {
  event.preventDefault();

  const data = {
    fullName: document.getElementById('studentFullName').value,
    phone: document.getElementById('countryCode').value + document.getElementById('phone').value,
    email: document.getElementById('studentEmail').value,
    course: document.getElementById('course').value,
    totalFee: Number(document.getElementById('totalFee').value),
    paymentType: document.getElementById('paymentType').value,
    paidAmount: Number(document.getElementById('paidAmount').value),
    pendingAmount: Number(document.getElementById('pendingAmount').value),
    tutorName: document.getElementById('tutorName').value
  };

  console.log("📦 Data to send:", data);

  try {
    // Use apiPost from api.js
    const res =  await apiPost('/students', data);
    console.log("✅ Server response:", res);
    document.getElementById("successPopup").style.display = "flex";
  } catch (err) {
    alert("❌ Error submitting form. Check console for details.");
  }
}

// Attach listener
document.getElementById('studentForm').addEventListener('submit', submitForm);

// Expose global functions
window.goBack = goBack;
window.closePopup = closePopup;
