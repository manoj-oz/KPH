// 📁 student.js
import { apiPost } from './api.js';

export async function submitStudentForm() {
    const data = {
        enquiryId: document.getElementById('studentEnquiryId').value,
        fullName: document.getElementById('studentFullName').value,
        phone: document.getElementById('studentCountryCode').value + document.getElementById('studentPhone').value,
        email: document.getElementById('studentEmail').value,
        subject: document.getElementById('studentSubject').value,
        totalFee: document.getElementById('totalFee').value,
        paidAmount: document.getElementById('paidAmount').value,
        pendingAmount: document.getElementById('pendingAmount').value,
        paymentMode: document.getElementById('paymentMode').value,
        trainerName: document.getElementById('trainerName').value,
        comment: document.getElementById('studentComment').value
    };

    if (!data.enquiryId || !data.fullName || !data.phone || !data.email || !data.subject || !data.totalFee) {
        alert('Please fill in all required Student Info fields.');
        return;
    }

    try {
        await apiPost('/student', data);
        alert('Student info form submitted successfully!');
    } catch (err) {
        alert('Submission failed: ' + err.message);
    }
}
