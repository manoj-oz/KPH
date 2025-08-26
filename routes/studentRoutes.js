// 📁 studentRoutes.js
const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // ✅ Generate next student ID
  async function generateStudentId() {
    const result = await pool.query(`
      SELECT student_id 
      FROM students 
      WHERE student_id LIKE 'STU%' 
      ORDER BY CAST(SUBSTRING(student_id, 4) AS INTEGER) DESC 
      LIMIT 1
    `);

    let newNumber = 1;
    if (result.rows.length > 0) {
      const lastId = result.rows[0].student_id;
      const lastNumber = parseInt(lastId.replace("STU", ""), 10);
      newNumber = lastNumber + 1;
    }

    // STU0001, STU0002, etc.
    return `STU${String(newNumber).padStart(4, "0")}`;
  }

  // ✅ POST /api/students → create a new student
  router.post("/students", async (req, res) => {
    try {
      const {
        fullName,
        phone,
        email,
        course,
        totalFee,
        paidAmount,
        pendingAmount,
        paymentType,
        tutorName,
      } = req.body;

      // Validation
      if (
        !fullName ||
        !phone ||
        !email ||
        !course ||
        !totalFee ||
        !paidAmount ||
        !pendingAmount ||
        !paymentType ||
        !tutorName
      ) {
        return res
          .status(400)
          .json({ error: "Missing required student fields" });
      }

      // Generate ID
      const studentId = await generateStudentId();

      // Insert into DB
      const result = await pool.query(
        `INSERT INTO students (
          student_id, full_name, phone, email, course, 
          total_fee, paid_amount, pending_amount, 
          payment_type, tutor_name, created_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()
        ) RETURNING *`,
        [
          studentId,
          fullName,
          phone,
          email,
          course,
          totalFee,
          paidAmount,
          pendingAmount,
          paymentType,
          tutorName,
        ]
      );

      return res.status(201).json({
        message: "✅ Student created successfully",
        student: result.rows[0],
      });
    } catch (err) {
      console.error("❌ Error inserting student:", err);
      return res
        .status(500)
        .json({ error: "Database error while inserting student" });
    }
  });

  return router;
};
