// 📁 routes/enquiry.js
const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // ✅ Generate enquiry ID based on date and incrementing count
  async function generateEnquiryId() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const result = await pool.query(
      'SELECT count FROM enquiry_ids WHERE date = $1',
      [today]
    );

    let newCount;

    if (result.rows.length === 0) {
      newCount = 1;
      await pool.query(
        'INSERT INTO enquiry_ids (date, count) VALUES ($1, $2)',
        [today, newCount]
      );
    } else {
      newCount = result.rows[0].count + 1;
      await pool.query(
        'UPDATE enquiry_ids SET count = $1 WHERE date = $2',
        [newCount, today]
      );
    }

    return 'KPH' + (1600 + newCount - 1);
  }

  // ✅ POST /api/enquiry - create a new enquiry entry
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
    const date = new Date().toISOString().slice(0, 10); // today’s date

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


  // ✅ GET /api/enquiry-id - preview enquiry ID and today's date
  router.get('/enquiry-id', async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    try {
      const result = await pool.query('SELECT count FROM enquiry_ids WHERE date = $1', [today]);

      let count = 1;
      if (result.rows.length > 0) {
        count = result.rows[0].count + 1;
      }

      const enquiryId = 'KPH' + (1600 + count - 1);
      res.json({ enquiryId, date: today });
    } catch (err) {
      console.error('Error generating enquiry ID:', err);
      res.status(500).json({ error: 'Failed to generate enquiry ID' });
    }
  });

  // ✅ GET /api/enquiries - fetch all enquiry records
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
