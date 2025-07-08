const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // === POST /api/first-login ===
  router.post('/first-login', async (req, res) => {
    const { contact, password } = req.body;

    try {
      const query = 'SELECT * FROM accounts WHERE contact = $1';
      const result = await pool.query(query, [contact]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isFirstLogin = user.first_login === true;

      // ✅ Return contact to store in localStorage
      res.json({
        message: 'Login successful',
        firstLogin: isFirstLogin,
        contact: user.contact
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // === POST /api/change-password ===
  router.post('/change-password', async (req, res) => {
    const { contact, oldPassword, newPassword } = req.body;

    try {
      const result = await pool.query('SELECT * FROM accounts WHERE contact = $1', [contact]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      if (user.password !== oldPassword) {
        return res.status(403).json({ error: 'Old password is incorrect' });
      }

      await pool.query(
        'UPDATE accounts SET password = $1, first_login = false WHERE contact = $2',
        [newPassword, contact]
      );

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error during password change:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
