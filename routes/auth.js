import express from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import crypto from "crypto";
import { sendResetCodeMail } from "../utilities/mailer.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.send("AUTH ROUTES WORKING");
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetCode = crypto.createHash("sha256").update(code).digest("hex");
  user.resetCodeExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendResetCodeMail(email, code);

  res.json({ msg: "Reset code sent to email" });
});
router.post("/verify-reset-code", async (req, res) => {
  const { email, code } = req.body;

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  const user = await User.findOne({
    email,
    resetCode: hashedCode,
    resetCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ msg: "Invalid or expired code" });
  }

  res.json({ msg: "Code verified" });
});
router.post("/reset-password", async (req, res) => {
  const { email, code, password } = req.body;

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  const user = await User.findOne({
    email,
    resetCode: hashedCode,
    resetCodeExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: "Invalid request" });

  user.password = await bcrypt.hash(password, 10);
  user.resetCode = undefined;
  user.resetCodeExpire = undefined;

  await user.save();

  res.json({ msg: "Password reset successful" });
});

export default router;