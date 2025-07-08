const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // ✅ POST /api/security-login
  router.post('/security-login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const query = 'SELECT * FROM security_logins WHERE username = $1';
      const result = await pool.query(query, [username]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({ message: 'Login successful' });
    } catch (err) {
      console.error('Security login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
