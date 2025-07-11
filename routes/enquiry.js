// 📁 routes/enquiry.js
const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // ✅ Generate next enquiry ID in format KPH0001, KPH0002, ...
  async function generateEnquiryId() {
    const result = await pool.query(`
      SELECT enquiry_id 
      FROM enquiries 
      WHERE enquiry_id LIKE 'KPH%' 
      ORDER BY CAST(SUBSTRING(enquiry_id, 4) AS INTEGER) DESC 
      LIMIT 1
    `);

    let newNumber = 1; // Default if table is empty

    if (result.rows.length > 0) {
      const lastId = result.rows[0].enquiry_id; // e.g., 'KPH0162'
      const lastNumber = parseInt(lastId.replace('KPH', ''));
      newNumber = lastNumber + 1;
    }

    return `KPH${String(newNumber).padStart(4, '0')}`; // e.g., 'KPH0001'
  }

  // ✅ POST /api/enquiry - Create a new enquiry entry
  router.post('/enquiry', async (req, res) => {
    const {
      contact,
      fullName,
      phone,
      enquiryEmail,
      enquiryDob,
      course,
      source,
      education,
      passedOutYear,
      about,
      mode,
      batchTiming,
      language,
      status,
      comment
    } = req.body;

    // Validate required fields
    if (!contact || !fullName || !phone || !enquiryEmail || !enquiryDob || !course) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const enquiryId = await generateEnquiryId();
      const date = new Date().toISOString().slice(0, 10); // today's date

      await pool.query(
        `INSERT INTO enquiries (
          enquiry_id, date, full_name, phone, email, dob,
          course, source, education, passed_out_year, about,
          mode, batch_timing, language, status, comment
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16
        )`,
        [
          enquiryId, date, fullName, phone, enquiryEmail, enquiryDob,
          course, source, education, passedOutYear, about,
          mode, batchTiming, language, status, comment
        ]
      );

      res.status(200).json({ message: 'Enquiry submitted', enquiryId });
    } catch (err) {
      console.error('❌ Error inserting enquiry:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ✅ GET /api/enquiries - Fetch all enquiry records
  router.get('/enquiries', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT 
          enquiry_id, date, full_name, phone, email, dob,
          course, source, education, passed_out_year, about,
          mode, batch_timing, language, status, comment
         FROM enquiries
         ORDER BY date DESC, enquiry_id DESC`
      );

      res.json(result.rows);
    } catch (err) {
      console.error('❌ Error fetching enquiries:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
