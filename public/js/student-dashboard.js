let students = [];

document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('dateFilter').value = today;

    fetchDataFromDatabase().then(() => {
        displayStudents();
        document.getElementById('searchInput').addEventListener('input', displayStudents);
        document.getElementById('filterStatus').addEventListener('change', displayStudents);
        document.getElementById('dateFilter').addEventListener('change', displayStudents);
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadToPDF);
    });
});

// ✅ Fetch from backend
async function fetchDataFromDatabase() {
    try {
        const baseURL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://kph-f581.onrender.com'; // ✅ Azure deployed backend URL

        const response = await fetch(`${baseURL}/api/dashboard/students`);
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        console.log("Fetched Students:", data);

        students = data.map(item => ({
            student_id: item.student_id,
            full_name: item.full_name,
            phone: item.phone,
            emailId: item.email,
            course: item.course,
            totalFee: item.totalFee,
            paidAmount: item.paidAmount,
            pendingAmount: item.pendingAmount,
            paymentType: item.paymentType,
            tutorName: item.tutorName,
            formDate: item.created_at ? item.created_at.slice(0, 10) : '',
        }));

    } catch (error) {
        console.error('Failed to fetch student details:', error);
        alert('Error loading data from server.');
    }
}

function displayStudents() {
    const tableBody = document.getElementById('StudentTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterDate = document.getElementById('dateFilter').value;
    tableBody.innerHTML = '';

    const filtered = students.filter(student => {
        const formDate = student.formDate || '';
        const matchDate = !filterDate || formDate === filterDate;
        const matchName = student.full_name?.toLowerCase().includes(searchTerm);
        const matchEmail = student.emailId?.toLowerCase().includes(searchTerm);
        const matchStatus = !filterStatus || student.paymentType === filterStatus;
        return matchDate && (matchName || matchEmail) && matchStatus;
    });

    if (filtered.length === 0) {
        const noDataRow = document.createElement('div');
        noDataRow.className = 'row';
        noDataRow.innerHTML = `<div class="cell" colspan="15">No matching students found.</div>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    filtered.forEach((student, idx) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `
            <div class="cell">${idx + 1}</div>
            <div class="cell">${student.student_id || '-'}</div>
            <div class="cell">${student.full_name || '-'}</div>
            <div class="cell">${student.phone || '-'}</div>
            <div class="cell">${student.emailId || '-'}</div>
            <div class="cell">${student.course || '-'}</div>
            <div class="cell">${student.totalFee || '-'}</div>
            <div class="cell">${student.paidAmount || '-'}</div>
            <div class="cell">${student.pendingAmount || '-'}</div>
            <div class="cell">${student.paymentType || '-'}</div>
            <div class="cell">${student.tutorName || '-'}</div>
            <div class="cell">${student.formDate || '-'}</div>
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
    doc.text('STUDENT FORM DASHBOARD DATA', leftMargin, y);
    y += 12;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterDate = document.getElementById('dateFilter').value;

    const filtered = students.filter(student => {
        const matchDate = !filterDate || student.formDate === filterDate;
        const matchName = student.full_name?.toLowerCase().includes(searchTerm);
        const matchEmail = student.emailId?.toLowerCase().includes(searchTerm);
        const matchStatus = !filterStatus || student.paymentType === filterStatus;
        return matchDate && (matchName || matchEmail) && matchStatus;
    });

    filtered.forEach((student, idx) => {
        y += (idx === 0) ? 2 : 8;
        doc.setFontSize(14);
        doc.text(`Entry ${idx + 1}:`, leftMargin, y);
        y += 10;
        doc.setFontSize(12);

        const FIELDS = [
            ["Student ID", student.student_id],
            ["Full Name", student.full_name],
            ["Phone", student.phone],
            ["Email", student.emailId],
            ["Course", student.course],
            ["Total Fee", student.totalFee],
            ["Paid Amount", student.paidAmount],
            ["Pending Amount", student.pendingAmount],
            ["Payment Mode", student.paymentType],
            ["Tutor Name", student.tutorName],
            ["Form Date", student.formDate],
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

    doc.save('student_dashboard_data.pdf');
}
