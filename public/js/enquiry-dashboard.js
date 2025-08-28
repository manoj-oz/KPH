import { apiAuthGet } from './api-auth.js'; // Auth GET requests

let enquiries = [];

document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('dateFilter').value = today;

    fetchDataFromDatabase().then(() => {
        displayEnquiries();
        document.getElementById('searchInput').addEventListener('input', displayEnquiries);
        document.getElementById('dateFilter').addEventListener('change', displayEnquiries);
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadToPDF);
    });
});

// ✅ Fetch from backend (token-authenticated)
async function fetchDataFromDatabase() {
    try {
        const data = await apiAuthGet('/dashboard/enquiries');
        if (data.error) throw new Error(data.error);

        enquiries = data.map(item => ({
            enquiry_id: item.enquiry_id,
            full_name: item.full_name,
            phone: item.phone,
            emailId: item.email,
            dateOfBirth: item.dob,
            courseOfEnquiry: item.course,
            selectSource: item.source,
            selectEducation: item.education,
            passed_out_year: item.passed_out_year,
            selectAbout: item.about,
            selectMode: item.mode,
            selectbatch_timing: item.batch_timing,
            selectLanguage: item.language,
            formDate: item.created_at ? item.created_at.slice(0, 10) : '',
        }));
    } catch (error) {
        console.error('Failed to fetch enquiries:', error);
        alert('Error loading data from server.');
    }
}

function displayEnquiries() {
    const tableBody = document.getElementById('enquiryTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterDate = document.getElementById('dateFilter').value;
    tableBody.innerHTML = '';

    const filtered = enquiries.filter(enquiry => {
        const formDate = enquiry.formDate || '';
        const matchDate = !filterDate || formDate === filterDate;
        const matchName = enquiry.full_name?.toLowerCase().includes(searchTerm);
        const matchEmail = enquiry.emailId?.toLowerCase().includes(searchTerm);
        const matchPhone = enquiry.phone?.toLowerCase().includes(searchTerm);
        return matchDate && (matchName || matchEmail || matchPhone);
    });

    if (filtered.length === 0) {
        const noDataRow = document.createElement('div');
        noDataRow.className = 'row';
        noDataRow.innerHTML = `<div class="cell" colspan="14">No matching enquiries found.</div>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    filtered.forEach((enquiry, idx) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `
            <div class="cell">${idx + 1}</div>
            <div class="cell">${enquiry.enquiry_id || '-'}</div>
            <div class="cell">${enquiry.full_name || '-'}</div>
            <div class="cell">${enquiry.phone || '-'}</div>
            <div class="cell">${enquiry.emailId || '-'}</div>
            <div class="cell">${enquiry.dateOfBirth?.slice(0, 10) || '-'}</div>
            <div class="cell">${enquiry.courseOfEnquiry || '-'}</div>
            <div class="cell">${enquiry.selectSource || '-'}</div>
            <div class="cell">${enquiry.selectEducation || '-'}</div>
            <div class="cell">${enquiry.passed_out_year || '-'}</div>
            <div class="cell">${enquiry.selectAbout || '-'}</div>
            <div class="cell">${enquiry.selectMode || '-'}</div>
            <div class="cell">${enquiry.selectbatch_timing || '-'}</div>
            <div class="cell">${enquiry.selectLanguage || '-'}</div>
        `;
        tableBody.appendChild(row);
    });
}

function downloadToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    let y = 18;
    const leftMargin = 10;
    const fieldGap = 7;
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(17);
    doc.text('ENQUIRY FORM DASHBOARD DATA', leftMargin, y);
    y += 12;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterDate = document.getElementById('dateFilter').value;

    const filtered = enquiries.filter(enquiry => {
        const matchDate = !filterDate || enquiry.formDate === filterDate;
        const matchName = enquiry.full_name?.toLowerCase().includes(searchTerm);
        const matchEmail = enquiry.emailId?.toLowerCase().includes(searchTerm);
        const matchPhone = enquiry.phone?.toLowerCase().includes(searchTerm);
        return matchDate && (matchName || matchEmail || matchPhone);
    });

    filtered.forEach((enquiry, idx) => {
        y += (idx === 0) ? 2 : 8;
        doc.setFontSize(14);
        doc.text(`Entry ${idx + 1}:`, leftMargin, y);
        y += 10;
        doc.setFontSize(12);

        const FIELDS = [
            ["S.NO", idx + 1],
            ["Enquiry Id", enquiry.enquiry_id],
            ["Full Name", enquiry.full_name],
            ["Phone Number", enquiry.phone],
            ["Email ID", enquiry.emailId],
            ["Date of Birth", enquiry.dateOfBirth?.slice(0, 10)],
            ["Course of Enquiry", enquiry.courseOfEnquiry],
            ["Source of Enquiry", enquiry.selectSource],
            ["Education Qualification", enquiry.selectEducation],
            ["Passed Out Year", enquiry.passed_out_year],
            ["About", enquiry.selectAbout],
            ["Mode of Classes", enquiry.selectMode],
            ["Batch Timings", enquiry.selectbatch_timing],
            ["Language", enquiry.selectLanguage]
        ];

        for (let i = 0; i < FIELDS.length; ++i) {
            const label = FIELDS[i][0];
            const value = FIELDS[i][1] || "-";
            const lines = doc.splitTextToSize(`${label}: ${value}`, 280);

            if (y + lines.length * fieldGap > pageHeight - 15) {
                doc.addPage();
                y = 15;
            }

            doc.text(lines, leftMargin + 6, y);
            y += fieldGap * lines.length;
        }
    });

    doc.save('enquiry_form_dashboard_data.pdf');
}
