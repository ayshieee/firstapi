const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());


/* a. GET ALL STUDENTS */
app.get('/students', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tbl_student");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* b. GET SINGLE STUDENT */
app.get('/students/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM tbl_student WHERE id = ?",
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* c. ADD NEW STUDENT */
app.post('/students', async (req, res) => {
    try {
        const {
            firstname, lastname, gender,
            age, course_id, department_id, status
        } = req.body;

        await db.query(
            `INSERT INTO tbl_student 
            (firstname, lastname, gender, age, course_id, department_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstname, lastname, gender, age, course_id, department_id, status]
        );

        res.status(201).json({ message: 'Student added successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

/* d. UPDATE STUDENT (ALL FIELDS) */
app.put('/students/:id', async (req, res) => {
    try {
        const {
            firstname, lastname, gender,
            age, course_id, department_id, status
        } = req.body;

        await db.query(
            `UPDATE tbl_student SET
            firstname=?, lastname=?, gender=?, age=?,
            course_id=?, department_id=?, status=?
            WHERE id=?`,
            [
                firstname, lastname, gender, age,
                course_id, department_id, status,
                req.params.id
            ]
        );

        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

/* e. UPDATE STUDENT STATUS ONLY */
app.patch('/students/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        await db.query(
            "UPDATE tbl_student SET status = ? WHERE id = ?",
            [status, req.params.id]
        );

        res.json({ message: 'Student status updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

/* f. DELETE STUDENT */
app.delete('/students/:id', async (req, res) => {
    try {
        await db.query(
            "DELETE FROM tbl_student WHERE id = ?",
            [req.params.id]
        );

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

/* SERVER */
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});