// 📁 public/js/enquiry.js
import { apiPost } from './api.js';

// ✅ Submit Enquiry Form
export async function submitEnquiry() {
  const contact = localStorage.getItem('loggedInContact');
  if (!contact) return alert('User not logged in');

  const phone = document.getElementById('phone').value.trim();
  const year = document.getElementById('passedOutYear').value.trim();
  const dob = document.getElementById('enquiryDob').value;

  // ✅ Basic client-side validations
  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("❌ Enter a valid 10-digit mobile number.");
    return;
  }

  if (!/^\d{4}$/.test(year)) {
    alert("❌ Passed out year must be exactly 4 digits.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  if (dob > today) {
    alert("❌ DOB cannot be a future date.");
    return;
  }

  try {
    const enquiryData = {
      contact,
      fullName: document.getElementById('fullName').value,
      phone: document.getElementById('countryCode').value + phone,
      enquiryEmail: document.getElementById('enquiryEmail').value,
      enquiryDob: dob,
      course: document.getElementById('course').value,
      source: document.getElementById('source').value,
      education: document.getElementById('education').value,
      passedOutYear: year,
      about: document.getElementById('about').value,
      mode: document.getElementById('mode').value,
      batchTiming: document.getElementById('batchTiming').value,
      language: document.getElementById('language').value,
  
    };

    const response = await apiPost('/enquiry', enquiryData);

    if (response?.enquiryId) {
      showPopup(); // 👈 Show the popup instead of alert
        setTimeout(() => {
          window.location.href = 'enquiryform.html';
        }, 3000); // Redirect after 3 seconds
      document.getElementById('enquiryForm').reset();
    } else {
      alert(`❌ Error: ${result.message || 'Submission failed'}`);
    }
  } catch (err) {
    alert('❌ Error submitting enquiry: ' + err.message);
  }

  /////////////
 
  function showPopup() {
    document.getElementById('successPopup').style.display = 'flex';
  }

  function closePopup() {
    document.getElementById('successPopup').style.display = 'none';
    document.getElementById('enquiryForm').reset();
  }
}

// ✅ DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiryForm');
  const dobInput = document.getElementById('enquiryDob');

  // ✅ Set max date for DOB to today
  const today = new Date().toISOString().split("T")[0];
  if (dobInput) {
    dobInput.setAttribute("max", today);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitEnquiry();
    });
  }
});
