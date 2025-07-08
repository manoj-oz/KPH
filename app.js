// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./db'); // ✅ Import your db pool here

// ✅ Import route functions
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const enquiryRoutes = require('./routes/enquiry');
const demoRoutes = require('./routes/demo');
const studentRoutes = require('./routes/student');
const userRoutes = require('./routes/user'); // if this is also function(pool)

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Call each route function with pool
app.use('/api', authRoutes(pool));
app.use('/api', accountRoutes(pool));
app.use('/api', enquiryRoutes(pool));
app.use('/api', demoRoutes(pool));
app.use('/api', studentRoutes(pool));
app.use('/api', userRoutes(pool)); // only if this also exports a function(pool)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
