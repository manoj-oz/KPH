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

    return `STU${String(newNumber).padStart(4, "0")}`;
  }

  // ✅ POST /api/students
  router.post("/students", async (req, res) => {
    try {
      const {
        fullName,
        phone,
        email,
        course,
        totalFee,
        paidAmount = 0,
        pendingAmount = 0,
        paymentType = null,
        tutorName = null,
      } = req.body;

      // ✅ validate only essential fields
      if (!fullName || !phone || !email || !course || !totalFee) {
        return res
          .status(400)
          .json({ error: "Missing required student fields" });
      }

      const studentId = await generateStudentId();

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

      // ✅ return camelCase JSON
      const student = result.rows[0];
      res.status(201).json({
        message: "✅ Student created successfully",
        student: {
          studentId: student.student_id,
          fullName: student.full_name,
          phone: student.phone,
          email: student.email,
          course: student.course,
          totalFee: student.total_fee,
          paidAmount: student.paid_amount,
          pendingAmount: student.pending_amount,
          paymentType: student.payment_type,
          tutorName: student.tutor_name,
          createdAt: student.created_at,
        },
      });
    } catch (err) {
      console.error("❌ Error inserting student:", err);
      return res
        .status(500)
        .json({ error: "Database error while inserting student" });
    }
  });

  // ✅ GET /api/dashboard/students
  router.get("/dashboard/students", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT 
          student_id, full_name, phone, email, course, 
          total_fee, paid_amount, pending_amount, 
          payment_type, tutor_name, created_at
        FROM students
        ORDER BY created_at DESC`
      );

      // ✅ convert snake_case → camelCase before sending to frontend
      const students = result.rows.map((s) => ({
        studentId: s.student_id,
        fullName: s.full_name,
        phone: s.phone,
        email: s.email,
        course: s.course,
        totalFee: s.total_fee,
        paidAmount: s.paid_amount,
        pendingAmount: s.pending_amount,
        paymentType: s.payment_type,
        tutorName: s.tutor_name,
        createdAt: s.created_at,
      }));

      res.json(students);
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      return res.status(500).json({ error: "Database error fetching students" });
    }
  });

  return router;
};
