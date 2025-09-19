import jwt from "jsonwebtoken";
import User from "../../models/Users.js";
import Otp from "../../models/otpModel.js";

// @desc    Verify OTP for user email verification
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!otp?.trim()) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await Otp.findOne({ userId: user._id, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.hasValidOtpForAction = true;
    user.otpVerifiedAt = new Date();
    await user.save();

    await Otp.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign(
      { id: user._id, email: user.email, nickname: user.nickname },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        nickname: user.nickname,
        email: user.email,
        isVerified: user.isVerified,
      },
      accessToken: token,
    });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};