const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /dashboard/enquiries — fetch all enquiries
router.get('/dashboard/enquiries', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM enquiries order by id desc');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching enquiries:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
