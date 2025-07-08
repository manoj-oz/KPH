// 📁 public/js/enquiry.js
import { apiPost, apiGet } from './api.js';

// ✅ Submit Enquiry Form
export async function submitEnquiry() {
  const contact = localStorage.getItem('loggedInContact');
  if (!contact) return alert('User not logged in');

  try {
    const enquiryData = {
  contact,
  fullName: document.getElementById('fullName').value,
  phone: document.getElementById('countryCode').value + document.getElementById('phone').value,
  enquiryEmail: document.getElementById('enquiryEmail').value,
  enquiryDob: document.getElementById('enquiryDob').value,
  course: document.getElementById('course').value,
  source: document.getElementById('source').value,
  education: document.getElementById('education').value,
  passedOutYear: document.getElementById('passedOutYear').value,
  about: document.getElementById('about').value,
  mode: document.getElementById('mode').value,
  batchTiming: document.getElementById('batchTiming').value,
  language: document.getElementById('language').value,
  status: document.getElementById('status').value,
  comment: document.getElementById('comment').value
};


    const response = await apiPost('/enquiry', enquiryData);

    if (response?.enquiryId) {
      alert(`✅ Enquiry submitted successfully!`);
      document.getElementById('enquiryForm').reset();
    } else {
      alert('❌ Enquiry submission failed.');
    }
  } catch (err) {
    alert('❌ Error submitting enquiry: ' + err.message);
  }
}

// ✅ Attach listener on load
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitEnquiry();
    });
  }
});
