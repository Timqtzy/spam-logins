require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // To generate reset token

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

const corsOptions = {
  origin: "https://spam-admin.vercel.app", // or use your frontend URL here
  methods: "GET,POST",
};

app.use(cors(corsOptions));

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(async () => {
    console.log("MongoDB connected");

    // Check if the database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      // Create a default user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("defaultpassword", salt);
      const defaultUser = new User({
        email: "timothytenido@gmail.com",
        password: hashedPassword,
      });
      await defaultUser.save();
      console.log(
        "Default user created with email: timothytenido@gmail.com and password: defaultpassword"
      );
    }
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  resetToken: String, // Store reset token
  resetTokenExpiration: Date, // Store token expiration time
});

const User = mongoose.model("Users", userSchema);

// POST /api/login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  // Create and send JWT token
  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  return res.json({
    success: true,
    message: "Login successful",
    token,
  });
});

app.post("/api/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token and set expiration time
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Send email (Nodemailer logic)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app-specific password
      },
    });
    const PORT = process.env.PORT || 5000;

    const resetUrl = `${PORT}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.error("Error during forgot-password request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error sending email" });
  }
});

// POST /api/reset-password (Step 2: Reset password with token)
app.post("/api/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Find user by reset token
  const user = await User.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the user's password and clear the reset token
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successfully" });
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
