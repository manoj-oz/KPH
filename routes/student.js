// ✅ routes/student.js
const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/student', async (req, res) => {
    const { enquiryId, fullName, phone, email, subject, totalFee, paidAmount, pendingAmount, paymentMode, trainerName, comment } = req.body;

    if (!enquiryId || !fullName || !phone || !email || !subject || !totalFee) {
      return res.status(400).json({ error: 'Missing required student fields' });
    }

    try {
      await pool.query(
        `INSERT INTO students (enquiry_id, full_name, phone, email, subject, total_fee, paid_amount, pending_amount, payment_mode, trainer_name, comment)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [enquiryId, fullName, phone, email, subject, totalFee, paidAmount, pendingAmount, paymentMode, trainerName, comment]
      );
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
