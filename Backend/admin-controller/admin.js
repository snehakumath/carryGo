// admin.js
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // your signup logic
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // your login logic
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};



// const Admin = require('../models/admin');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Signup
// exports.signup = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = new Admin({ name, email, password: hashedPassword });
//     await newAdmin.save();

//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Signup failed" });
//   }
// };


// exports.login = async (req, res) => {

//   const { email, password } = req.body;
//  // console.log("Email , pass",email,password);
//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(400).json({ message: "Invalid email" });
//   // console.log("Admin",admin);
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });
//   // console.log("isMatch",isMatch);
//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//    // console.log("Token",token);

//     // ✅ Set token in cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'Lax'
//     });
//     return res.status(200).json({ success: true });
  
//   } catch (error) {
//     res.status(500).json({ error: "Login failed" });
//   }
// };
