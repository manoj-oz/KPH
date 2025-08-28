let Demo = [];

document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('dateFilter').value = today;

    fetchDataFromDatabase().then(() => {
        displayDemo();
        document.getElementById('searchInput').addEventListener('input', displayDemo);
        document.getElementById('filterStatus').addEventListener('change', displayDemo);
        document.getElementById('dateFilter').addEventListener('change', displayDemo);
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadToPDF);
    });
});

// ✅ Fetch from backend
async function fetchDataFromDatabase() {
    try {
        const baseURL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://kphforms-d4hvekaegqd2fgcd.centralus-01.azurewebsites.net';

        const response = await fetch(`${baseURL}/api/dashboard/demo`);
        if (!response.ok) {
            throw new Error('Failed to fetch Demo details');
        }

        const data = await response.json();
        console.log("Fetched demo:", data);

        Demo = data.map(item => ({
            id: item.idx,
            demo_id: item.demo_id,
            enquiry_id: item.enquiry_id,
            full_name: item.full_name,
            phone: item.phone,
            emailId: item.email,
            course: item.course,
            demo_date: item.demo_date ? new Date(item.demo_date).toISOString().split('T')[0] : '-',
            tutor_name: item.tutor_name,
            demo_time: item.demo_time,
            created_at: item.created_at ? item.created_at.slice(0, 10) : ''
        }));

    } catch (error) {
        console.error('Failed to fetch demo details:', error);
        alert('Error loading data from server.');
    }
}

function displayDemo() {
    const tableBody = document.getElementById('DemoTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterDate = document.getElementById('dateFilter').value;
    tableBody.innerHTML = '';

    const filtered = Demo.filter(demo => {
        const formDate = demo.created_at || '';
        const matchDate = !filterDate || formDate === filterDate;
        const matchName = demo.full_name?.toLowerCase().includes(searchTerm);
        const matchEmail = demo.emailId?.toLowerCase().includes(searchTerm);
        const matchStatus = !filterStatus || demo.status === filterStatus;
        return matchDate && (matchName || matchEmail) && matchStatus;
    });

    if (filtered.length === 0) {
        const noDataRow = document.createElement('div');
        noDataRow.className = 'row';
        noDataRow.innerHTML = `<div class="cell" colspan="15">No matching demo records found.</div>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    filtered.forEach((demo, idx) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `
            <div class="cell">${idx + 1}</div>
            <div class="cell">${demo.demo_id || '-'}</div>
            <div class="cell">${demo.enquiry_id || '-'}</div>
            <div class="cell">${demo.full_name || '-'}</div>
            <div class="cell">${demo.phone || '-'}</div>
            <div class="cell">${demo.emailId || '-'}</div>
            <div class="cell">${demo.course || '-'}</div>
            <div class="cell">${demo.demo_date || '-'}</div>
            <div class="cell">${demo.tutor_name || '-'}</div>
            <div class="cell">${demo.demo_time || '-'}</div>
            <div class="cell">${demo.created_at || '-'}</div>
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
    doc.text('DEMO DASHBOARD DATA', leftMargin, y);
    y += 12;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterDate = document.getElementById('dateFilter').value;

    const filtered = Demo.filter(demo => {
        const matchDate = !filterDate || demo.created_at === filterDate;
        const matchName = demo.full_name?.toLowerCase().includes(searchTerm);
        const matchEmail = demo.emailId?.toLowerCase().includes(searchTerm);
        const matchStatus = !filterStatus || demo.status === filterStatus;
        return matchDate && (matchName || matchEmail) && matchStatus;
    });

    filtered.forEach((demo, idx) => {
        y += (idx === 0) ? 2 : 8;
        doc.setFontSize(14);
        doc.text(`Entry ${idx + 1}:`, leftMargin, y);
        y += 10;
        doc.setFontSize(12);

        const FIELDS = [
            ["S.NO", idx + 1],
            ["Demo Id", demo.demo_id],
            ["Enquiry Id", demo.enquiry_id],
            ["Full Name", demo.full_name],
            ["Phone Number", demo.phone],
            ["Email ID", demo.emailId],
            ["Course", demo.course],
            ["Demo Date", demo.demo_date],
            ["Tutor Name", demo.tutor_name],
            ["Time", demo.demo_time],
            ["Created At", demo.created_at]
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

    doc.save('Demo_data.pdf');
}
