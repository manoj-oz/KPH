const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./db'); // PostgreSQL pool

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route modules
const authRoutes = require('./routes/auth')(pool);
const accountRoutes = require('./routes/account')(pool);
const enquiryRoutes = require('./routes/enquiry')(pool);
const demoRoutes = require('./routes/demo')(pool);
const studentRoutes = require('./routes/student')(pool);
const securityRoutes = require('./routes/security')(pool); // ✅ Add this

// ✅ Mount routes under /api
app.use('/api', authRoutes);
app.use('/api', accountRoutes);
app.use('/api', enquiryRoutes);
app.use('/api', demoRoutes);
app.use('/api', studentRoutes);
app.use('/api', securityRoutes); // ✅ Add this

// ✅ Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
