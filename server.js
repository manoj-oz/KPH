const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./db'); // PostgreSQL pool

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS setup
app.use(cors({
  origin: 'http://localhost:3000', // 🔁 Replace with production URL as needed
  credentials: true
}));

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 30 // 30 mins
  }
}));

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Modular Routes
app.use('/api', require('./routes/auth')(pool));
app.use('/api', require('./routes/account')(pool));
app.use('/api', require('./routes/enquiry')(pool));
app.use('/api', require('./routes/demo')(pool));
app.use('/api', require('./routes/student')(pool));
app.use('/api', require('./routes/security')(pool));
app.use('/api', require('./routes/dashboard'));
 // placed after pool is available


// ✅ Default route to login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ Catch-all route
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
