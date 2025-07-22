import { apiPost } from './api.js';
import { showFirstLogin } from './ui.js';

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

    const result = await apiPost('/create-account', body);

    if (result.message) {
        alert('Account created!');
        showFirstLogin(); // Or redirect to login.html
    } else {
        alert('Failed: ' + (result.error || 'Unknown'));
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
