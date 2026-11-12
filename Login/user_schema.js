// STUDENT SCHEMA (shared structure used by Registration & Login services)
const mongoose = require('./dbconnect.js');

const studentSchema = new mongoose.Schema(
  {
    Student_id: {
      type: String,
      required: true,
      unique: true
    },
    Student_name: {
      type: String,
      required: true,
      trim: true
    },
    student_mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Mobile number must be 10 digits']
    },
    student_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    student_password: {
      type: String,
      required: true
    }
  },
  { versionKey: false }
);

// Collection name: "students"
module.exports = mongoose.model('Student', studentSchema, 'students');
