import { apiPost } from './api.js';
import { showFirstLogin } from './ui.js';

// ✅ Detect environment automatically
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocalhost ? 'http://localhost:3000' : window.location.origin;

// ✅ Create New Account
export async function createAccount() {
    const body = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        contact: document.getElementById('contact').value,
        education: document.getElementById('education').value,
        maritalStatus: document.getElementById('maritalStatus').value,
        password: document.getElementById('newPassword').value,
        accessEnquiry: document.getElementById('access-enquiry').checked,
        accessDemo: document.getElementById('access-demo').checked,
        accessStudent: document.getElementById('access-student').checked
    };

    try {
        const result = await fetch(`${API_BASE}/api/create-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then(res => res.json());

        if (result.message) {
            showPopup();
            setTimeout(() => {
                showFirstLogin();
            }, 3000);
        } else {
            alert('Failed: ' + (result.error || 'Unknown'));
        }
    } catch (err) {
        console.error('Create account error:', err);
        alert('❌ Server error. Please try again.');
    }

    function showPopup() {
        document.getElementById('successPopup').style.display = 'flex';
    }

    function closePopup() {
        document.getElementById('successPopup').style.display = 'none';
        document.getElementById('enquiryForm').reset();
    }
}

// ✅ Auto-generate email from first & last name
export function generateEmail() {
    const firstName = document.getElementById('firstName')?.value.trim().toLowerCase();
    const lastName = document.getElementById('lastName')?.value.trim().toLowerCase();

    if (firstName && lastName) {
        const email = `${firstName}.${lastName}@kph.com`;
        const contactInput = document.getElementById('contact');
        if (contactInput) contactInput.value = email;
    }
}
