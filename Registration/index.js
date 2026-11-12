const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Student = require('./user_schema.js');


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Hello Register");
});


// REGISTER API  ->  POST /reg/register  (through API Gateway)
app.post(["/", "/register"], async (req, res) => {
    try {
        const {
            Student_id,
            Student_name,
            student_mobile,
            student_email,
            student_password
        } = req.body;

        if (!Student_id || !Student_name || !student_mobile || !student_email || !student_password) {
            return res.status(400).json({
                message: "Student_id, Student_name, student_mobile, student_email and student_password are required"
            });
        }

        const exists = await Student.findOne({
            $or: [{ Student_id }, { student_email: student_email.toLowerCase() }]
        });
        if (exists) {
            return res.status(409).json({
                message: "Student with this id or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(student_password, 10);

        const student = await Student.create({
            Student_id,
            Student_name,
            student_mobile,
            student_email,
            student_password: hashedPassword
        });

        const { student_password: _, ...studentData } = student.toObject();

        return res.status(201).json({
            message: "Registration successful",
            student: studentData
        });

    } catch (error) {
        console.error("REGISTRATION ERROR:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// GET ALL STUDENTS (for verification)
app.get("/students", async (req, res) => {
    const students = await Student.find({}, { student_password: 0 });
    res.json(students);
});


// START SERVER
const port = process.env.PORT || 5003;
app.listen(port, () => {
    console.log('EXPRESS Server Started at Port No: ' + port);
});
