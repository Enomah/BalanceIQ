import bcrypt from "bcrypt";
import User from "../../models/Users.js";

// @desc    Reset user password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password?.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.hasValidOtpForAction || !user.otpVerifiedAt) {
      return res.status(403).json({ message: "OTP not verified" });
    }
    const otpVerificationWindow = 5 * 60 * 1000;
    if (Date.now() - user.otpVerifiedAt.getTime() > otpVerificationWindow) {
      user.hasValidOtpForAction = false;
      user.otpVerifiedAt = null;
      await user.save();
      return res.status(403).json({ message: "OTP verification expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.hasValidOtpForAction = false;
    user.otpVerifiedAt = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};