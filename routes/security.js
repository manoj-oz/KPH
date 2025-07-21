const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // ✅ POST /api/security-login
  router.post('/security-login', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Fetch user from DB
      const query = 'SELECT * FROM security_logins WHERE username = $1';
      const result = await pool.query(query, [username]);

      // If user not found
      if (result.rows.length === 0) {
        return res.status(400).json({ error: '❌ User not found' });
      }

      const user = result.rows[0];

      // Check password match
      if (user.password !== password) {
        return res.status(401).json({ error: '❌ Invalid credentials' });
      }

      // ✅ Return access permissions along with success message
      return res.json({
        message: '✅ Login successful',
        accessEnquiry: user.access_enquiry || false,
        accessDemo: user.access_demo || false,
        accessStudent: user.access_student || false
      });

    } catch (err) {
      console.error('❌ Security login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
