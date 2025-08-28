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

// ✅ Fetch from backend dynamically based on environment
async function fetchDataFromDatabase() {
    try {
        const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : window.location.origin;

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
            created_at: item.created_at ? item.created_at.slice(0, 10) : '',
            status: item.status || ''
        }));

    } catch (error) {
        console.error('Failed to fetch demo details:', error);
        alert('Error loading data from server.');
    }
}

// ✅ Remaining functions (displayDemo, downloadToPDF) remain unchanged
