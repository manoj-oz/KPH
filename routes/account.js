const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // ✅ Create New Account
  router.post('/create-account', async (req, res) => {
    const {
      firstName, lastName, dob, gender, contact,
      education, maritalStatus, password,
      accessEnquiry, accessDemo, accessStudent
    } = req.body;

    if (!firstName || !lastName || !dob || !gender || !contact ||
        !education || !maritalStatus || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      await pool.query(
        `INSERT INTO accounts 
        (first_name, last_name, dob, gender, contact, education, marital_status, password, access_enquiry, access_demo, access_student)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [firstName, lastName, dob, gender, contact, education, maritalStatus, password, accessEnquiry, accessDemo, accessStudent]
      );
      res.status(200).json({ message: 'Account created successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create account: ' + err.message });
    }
  });

  // ✅ Fetch logged-in user info by contact (email)
  router.get('/account/:contact', async (req, res) => {
    const { contact } = req.params;

    try {
      const result = await pool.query(
        `SELECT first_name, last_name, dob, contact FROM accounts WHERE contact = $1`,
        [contact]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      res.json({
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.contact,
        dob: user.dob
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user: ' + err.message });
    }
  });

  return router;
};
