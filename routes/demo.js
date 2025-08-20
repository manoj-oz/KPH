const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // ✅ Generate next demo ID
  async function generateDemoId() {
    const result = await pool.query(`
      SELECT demo_id 
      FROM demo 
      WHERE demo_id LIKE 'DEMO%' 
      ORDER BY CAST(SUBSTRING(demo_id, 5) AS INTEGER) DESC 
      LIMIT 1
    `);

    let newNumber = 1;
    if (result.rows.length > 0) {
      const lastId = result.rows[0].demo_id;
      const lastNumber = parseInt(lastId.replace('DEMO', ''));
      newNumber = lastNumber + 1;
    }

    return `DEMO${String(newNumber).padStart(4, '0')}`;
  }

  // ✅ GET /api/enquiry → Fetch all enquiry IDs for dropdown (no auth)
  router.get('/enquiry', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT enquiry_id AS id, full_name, 
               RIGHT(REGEXP_REPLACE(phone, '\\D', '', 'g'), 10) AS phoneNumber 
        FROM enquiries 
        ORDER BY enquiry_id DESC
      `);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('❌ Error fetching all enquiry IDs:', err.message);
      res.status(500).json({ error: 'Database error while fetching enquiries' });
    }
  });

  // ✅ GET /api/enquiry/:id → Fetch enquiry details to pre-fill demo form (no auth)
  router.get('/enquiry/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'SELECT * FROM enquiries WHERE enquiry_id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('❌ Error fetching enquiry by ID:', err.message);
      res.status(500).json({ error: 'Database error while fetching enquiry' });
    }
  });

  // ✅ POST /api/demo → Create new demo (no auth)
  router.post('/demo', async (req, res) => {
    const { enquiryId, fullName, phone, email, course, demoDate, tutorName, demoTime } = req.body;

    if (!enquiryId || !fullName || !phone || !email || !course || !demoDate) {
      return res.status(400).json({ error: 'Missing required demo fields' });
    }

    try {
      const demoId = await generateDemoId();

      const result = await pool.query(
        `INSERT INTO demo (
          demo_id, enquiry_id, full_name, phone, email, course, demo_date, tutor_name, demo_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [demoId, enquiryId, fullName, phone, email, course, demoDate, tutorName, demoTime]
      );

      res.status(200).json({ message: 'Demo created successfully', demo: result.rows[0] });
    } catch (err) {
      console.error('❌ Error inserting demo:', err.message);
      res.status(500).json({ error: 'Database error while inserting demo' });
      
    }
  });

  // ✅ GET /api/dashboard/demo → Fetch all demo records for dashboard
router.get('/dashboard/demo', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT demo_id, enquiry_id, full_name, phone, email, course, demo_date, tutor_name, demo_time, created_at
      FROM demo
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching demo dashboard data:", err.message);
    res.status(500).json({ error: "Database error while fetching demo dashboard data" });
  }
});


  return router;
};
