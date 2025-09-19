import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/Users.js";
import Otp from "../../models/otpModel.js";
import { Resend } from "resend";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { fullName, nickname, email, password } = req.body;

    const errors = {};

    const existingEmail = await User.findOne({ email });
    const existingNickname = await User.findOne({ nickname });

    if (!fullName?.trim()) errors.fullName = "Full name is required";
    if (!nickname?.trim()) errors.nickname = "Nickname is required";
    if (!email?.trim()) errors.email = "Email is required";
    if (!password?.trim()) errors.password = "Password is required";

    if (existingEmail) errors.email = `${email} is already taken`;
    if (existingNickname) errors.nickname = `${nickname} is already taken`;

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      nickname,
      email,
      password: hashedPassword,
      isVerified: false, 
    });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      userId: user._id,
      otp: otpCode,
      expiresAt: Date.now() + 1 * 60 * 1000,
    });

    console.log("Attempting to send email to:", email);
    console.log("OTP Code generated:", otpCode);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return res.status(500).json({ message: "Email service not configured" });
    }

    const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your BalanceIQ account",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">Welcome to BalanceIQ!</h2>
        <p>Hello ${fullName},</p>
        <p>Thanks for signing up! Please verify your email using this OTP:</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otpCode}</h1>
        </div>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <p>Best regards,<br/>The BalanceIQ Team</p>
      </div>`,
    });

    if (emailResult.error) {
      console.error("Resend API Error:", emailResult.error);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    console.log("Resend API Response:", {
      status: "Success",
      messageId: emailResult.data?.id,
    });

    res.status(201).json({
      message: "User registered. OTP sent to email.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        nickname: user.nickname,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};