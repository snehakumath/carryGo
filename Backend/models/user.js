const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
    user_type: { type: String, enum: ['customer', 'transporter', 'admin'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
    address: { type: String },
    city: { type: String },
    salt: { type: String },
    status: {
        type: String,
        enum: ["Active", "Suspended"],
        default: "Active",
      },      
    profilePicture: { 
        type: String, 
        default: 'C:\Users\asus\OneDrive\My-project\carryGo\Frontend\frontend\public\Images\avatar.jpeg' // Default profile picture path
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.salt = salt;
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (user_type, email, password) {
    const user = await this.findOne({ email, user_type });
    if (!user) throw new Error("User not found!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect Password");

    const token = jwt.sign({ email: user.email, user_type: user.user_type }, process.env.JWT_SECRET , { expiresIn: '1h' });
    return token;
});

module.exports = model('User', userSchema);


// const { randomBytes, createHmac } = require('crypto');
// const { Schema, model } = require('mongoose');
// const { v4: uuidv4 } = require('uuid');
// const { createTokenForUser } = require("../services/authentication");
// const jwt = require('jsonwebtoken');


// const bcrypt = require('bcryptjs');


// const userSchema = new Schema({
//     user_type: {
//         type: String,
//         enum: ['customer', 'transporter', 'admin'], 
//         required: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6, // Add a minimum length for password
//     },
//     phone: {
//         type: String,
//         required: true,
//         unique: true,
//         match: /^[0-9]{10}$/, // Regex for 10-digit phone numbers
//     },
//     address: {
//         type: String,
//     },
//     city: {
//         type: String,
//     },
//     salt:{
//         type:String,
//     },
// }, 
// {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
// });

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();

//     const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
//     this.salt = salt; // Save the salt
//     this.password = await bcrypt.hash(this.password, salt); // Hashes the password with the salt
//     console.log("Password hashed:", this.password);
//     next();
// });

  
// userSchema.static("matchPasswordAndGenerateToken", async function (user_type, email, password) {
//   const user = await this.findOne({ email ,user_type});
//   if (!user) throw new Error("User not found!");

//   const isMatch = await bcrypt.compare(password, user.password); // Compares entered password with stored hash
//   if (!isMatch) throw new Error("Incorrect Password");
//   const token = jwt.sign({  email: user.email, user_type: user.user_type }, process.env.JWT_SECRET || '$uperMan@123 ', { expiresIn: '1h' });
//  // const token = createTokenForUser(user); // Ensure `createTokenForUser` is implemented
//   return token;
// });
  


// const User = model('User', userSchema);
// module.exports = User;
