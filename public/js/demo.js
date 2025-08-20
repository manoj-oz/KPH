import { apiPost } from './api.js';           // Only use apiPost from api.js
import { apiAuthGet } from './api-auth.js';   // Use authenticated GETs

const enquiryDropdown = document.getElementById('studentEnquiryId');
const demoForm = document.getElementById('demoForm');

// 1️⃣ Populate enquiry ID dropdown
async function populateEnquiryIds() {
  try {
    const enquiries = await apiAuthGet('/enquiry');  // ✅ Token-based GET

    if (enquiries.error) {
      throw new Error(enquiries.error);
    }

    enquiries.forEach((enq) => {
      const option = document.createElement('option');
      option.value = enq.id;
      option.textContent = `ID ${enq.id} - ${enq.full_name}`;
      enquiryDropdown.appendChild(option);
    });
  } catch (err) {
    alert('Failed to load enquiries: ' + err.message);
  }
}

// 2️⃣ Auto-fill form fields on enquiry ID selection
enquiryDropdown.addEventListener('change', async () => {
  const selectedId = enquiryDropdown.value;
  if (!selectedId) return;

  try {
    const enquiry = await apiAuthGet(`/enquiry/${selectedId}`);  // ✅ Auth GET

    if (enquiry.error) {
      throw new Error(enquiry.error);
    }

    document.getElementById('demoFullName').value = enquiry.full_name || '';
    document.getElementById('phone').value = enquiry.phone || '';
    document.getElementById('demoEmail').value = enquiry.email || '';
    document.getElementById('course').value = enquiry.course || '';
  } catch (err) {
    alert('Failed to fetch enquiry details: ' + err.message);
  }
});

// 3️⃣ Handle form submission
demoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    enquiryId: enquiryDropdown.value,
    fullName: document.getElementById('demoFullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('demoEmail').value,
    course: document.getElementById('course').value,
    demoDate: document.getElementById('demoDate').value,
    tutorName: document.getElementById('tutorName').value,
    demoTime: document.getElementById('demoTime').value,
  };

  if (!data.enquiryId || !data.fullName || !data.phone || !data.email || !data.course || !data.demoDate) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    await apiPost('/api/demo', data);  // ✅ Unchanged POST
    showPopup(); // 👈 Show the popup instead of alert
        setTimeout(() => {
          window.location.href = 'demoform.html';
        }, 3000);
   // alert('Demo submitted successfully!');
    demoForm.reset();
  } catch (err) {
    alert('Demo submission failed: ' + err.message);
  }

  function showPopup() {
    document.getElementById('successPopup').style.display = 'flex';
  }

  function closePopup() {
    document.getElementById('successPopup').style.display = 'none';
    document.getElementById('demoForm').reset();
  }
});

// 4️⃣ Initialize
populateEnquiryIds();