import { apiPost } from './api.js';

export async function submitDemoForm() {
    const data = {
        enquiryId: document.getElementById('demoEnquiryId').value,
        fullName: document.getElementById('demoFullName').value,
        phone: document.getElementById('demoCountryCode').value + document.getElementById('demoPhone').value,
        email: document.getElementById('demoEmail').value,
        subject: document.getElementById('subject').value,
        demoDate: document.getElementById('demoDate').value,
        tutorName: document.getElementById('tutorName').value,
        demoTime: document.getElementById('demoTime').value,
        feedback: document.getElementById('demoFeedback').value,
        enrollStatus: document.getElementById('enrollStatus').value
    };

    // Basic validation
    if (!data.enquiryId || !data.fullName || !data.phone || !data.email || !data.subject || !data.demoDate) {
        alert('Please fill in all required Demo fields.');
        return;
    }

    try {
        const res = await apiPost('/api/demo', data); // ✅ Corrected endpoint
        alert('Demo form submitted successfully!');
    } catch (err) {
        alert('Submission failed: ' + (err.message || 'Unknown error'));
    }
}
