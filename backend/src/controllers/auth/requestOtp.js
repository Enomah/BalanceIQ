import { Resend } from "resend";
import User from "../../models/Users.js";
import Otp from "../../models/otpModel.js";

// @desc    Request OTP with email
// @route   POST /api/auth/request-otp
// @access  Public
export const requestOtp = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      userId: user._id,
      otp: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log("Attempting to send OTP email to:", email);
    console.log("OTP Code generated:", otpCode);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return res.status(500).json({ message: "Email service not configured" });
    }

    const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "OTP verification code",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">Welcome to BalanceIQ!</h2>
        <p>Hello ${user.fullName},</p>
        <p>This is the OTP you requested:</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otpCode}</h1>
        </div>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
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

    return res.status(200).json({ message: `An OTP has been sent to ${email}` });
  } catch (error) {
    console.error("❌ Error requesting OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};