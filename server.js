const express = require('express'); 
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

// ✅ Route imports (functions that accept pool)
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const enquiryRoutes = require('./routes/enquiry');
const demoRoutes = require('./routes/demo');
const securityRoutes = require('./routes/security');
const dashboardRoutes = require('./routes/dashboard'); // pass pool if needed
const studentRoutes = require('./routes/studentRoutes'); 

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS setup
app.use(cors({
  origin: '*',
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

// ✅ DB connection test
pool.query(
  "SELECT current_database(), current_user, inet_server_addr(), inet_server_port()", 
  (err, result) => {
    if (err) {
      console.error("❌ DB Test Failed:", err);
    } else {
      console.log("✅ Connected DB Info:", result.rows[0]);
    }
  }
);

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Modular Routes (pass pool if route needs DB)
app.use('/api', authRoutes(pool));
app.use('/api', accountRoutes(pool));
app.use('/api', enquiryRoutes(pool));
app.use('/api', demoRoutes(pool));
app.use('/api', securityRoutes(pool));
app.use('/api', dashboardRoutes(pool)); // pass pool for DB access
app.use('/api', studentRoutes(pool));

// ✅ Default route → login.html
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
