// ✅ routes/demo.js
const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/demo', async (req, res) => {
    const { enquiryId, fullName, phone, email, subject, demoDate, tutorName, demoTime, feedback, enrollStatus } = req.body;

    if (!enquiryId || !fullName || !phone || !email || !subject || !demoDate) {
      return res.status(400).json({ error: 'Missing required demo fields' });
    }

    try {
      await pool.query(
        `INSERT INTO demos (enquiry_id, full_name, phone, email, subject, demo_date, tutor_name, demo_time, feedback, enroll_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [enquiryId, fullName, phone, email, subject, demoDate, tutorName, demoTime, feedback, enrollStatus]
      );
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};


