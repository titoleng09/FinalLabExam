const express = require('express');
const app = express();

const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Student = require('./user_schema.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Hello Login");
});


// LOGIN API  ->  POST /login/log  (through API Gateway)
app.post(["/", "/log"], async (req, res) => {
    try {
        const { student_email, student_password } = req.body;

        if (!student_email || !student_password) {
            return res.status(400).json({
                message: "student_email and student_password are required"
            });
        }

        const student = await Student.findOne({
            student_email: student_email.toLowerCase()
        });

        if (!student) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const passwordMatched = await bcrypt.compare(
            student_password,
            student.student_password
        );

        if (!passwordMatched) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                sub: student._id,
                Student_id: student.Student_id,
                student_email: student.student_email,
                role: "student"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            Student_id: student.Student_id,
            Student_name: student.Student_name,
            token
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error.message);
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// START SERVER
const port = process.env.PORT || 5004;
app.listen(port, () => {
    console.log('EXPRESS Server Started at Port No: ' + port);
});
