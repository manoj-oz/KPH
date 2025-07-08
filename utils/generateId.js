const pool = require('../db');

async function generateEnquiryId() {
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.query('SELECT * FROM enquiry_ids WHERE date = $1', [today]);

  if (result.rows.length === 0) {
    await pool.query('INSERT INTO enquiry_ids (date, count) VALUES ($1, 1)', [today]);
    return 'KPH1600';
  } else {
    const newCount = result.rows[0].count + 1;
    await pool.query('UPDATE enquiry_ids SET count = $1 WHERE date = $2', [newCount, today]);
    return 'KPH' + (1600 + newCount - 1);
  }
}

module.exports = generateEnquiryId;
