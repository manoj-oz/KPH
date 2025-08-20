window.addEventListener('DOMContentLoaded', () => {
  const access = JSON.parse(localStorage.getItem('accessControls'));

  if (!access) {
    alert('Access info missing!');
    return;
  }

  // Show/hide form options
  if (!access.enquiry) {
    document.getElementById('enquiryFormBtn').style.display = 'none';
  }
  if (!access.demo) {
    document.getElementById('demoFormBtn').style.display = 'none';
  }
  if (!access.student) {
    document.getElementById('studentFormBtn').style.display = 'none';
  }
});
