const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // === ✅ POST /api/first-login ===
  router.post('/first-login', async (req, res) => {
    const { contact, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM accounts WHERE contact = $1', [contact]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      // ❌ Plain-text comparison (temporary)
      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.user = {
        contact: user.contact,
        name: `${user.first_name} ${user.last_name}`,
        access: []
      };

      if (user.access_enquiry) req.session.user.access.push('enquiry');
      if (user.access_demo) req.session.user.access.push('demo');
      if (user.access_student) req.session.user.access.push('student');

      res.json({
        message: 'First login successful',
        firstLogin: user.first_login === true,
        contact: user.contact,
        name: `${user.first_name} ${user.last_name}`,
        access_enquiry: user.access_enquiry,
        access_demo: user.access_demo,
        access_student: user.access_student
      });

    } catch (error) {
      console.error('Error during first login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // === ✅ POST /api/change-password ===
  router.post('/change-password', async (req, res) => {
    const { contact, oldPassword, newPassword } = req.body;

    try {
      const result = await pool.query('SELECT * FROM accounts WHERE contact = $1', [contact]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      if (oldPassword !== user.password) {
        return res.status(403).json({ error: 'Old password is incorrect' });
      }

      // Save new password as plain text (temporarily)
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

  // === ✅ POST /api/forgot-password ===
  router.post('/forgot-password', async (req, res) => {
    const { contact, dob, new_password } = req.body;

    if (!contact || !dob || !new_password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const result = await pool.query(
        'SELECT * FROM accounts WHERE contact = $1 AND dob = $2',
        [contact, dob]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found with provided contact and DOB.' });
      }

      // Save new password as plain text
      await pool.query(
        'UPDATE accounts SET password = $1 WHERE contact = $2 AND dob = $3',
        [new_password, contact, dob]
      );

      res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
      console.error('Error in /forgot-password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // === ✅ POST /api/logout ===
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  // === ✅ POST /api/login ===
  router.post('/login', async (req, res) => {
    const { contact, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM accounts WHERE contact = $1', [contact]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      req.session.user = {
        contact: user.contact,
        name: `${user.first_name} ${user.last_name}`,
        access: []
      };

      if (user.access_enquiry) req.session.user.access.push('enquiry');
      if (user.access_demo) req.session.user.access.push('demo');
      if (user.access_student) req.session.user.access.push('student');

      const userData = {
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        contact: user.contact,
        first_login: user.first_login,
        access_enquiry: !!user.access_enquiry,
        access_demo: !!user.access_demo,
        access_student: !!user.access_student
      };

      res.json({ success: true, user: userData });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
