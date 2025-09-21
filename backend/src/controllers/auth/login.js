import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/Users.js";

// @desc    Authenticate user and return JWT token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password?.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        requiresVerification: true,
      });
    }

    if (user.isBanned || user.isSuspended) {
      return res.status(403).json({ message: "Account is not active" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        nickname: user.nickname,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
        currency: user.currency,
      },
      accessToken: token,
    });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};