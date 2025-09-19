import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    hasValidOtpForAction: {
      type: Boolean,
      default: false,
    },
    otpVerifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to reset hasValidOtpForAction after 5 minutes
userSchema.pre("save", function (next) {
  if (this.hasValidOtpForAction && this.otpVerifiedAt) {
    const otpVerificationWindow = 5 * 60 * 1000; // 5 minutes
    if (Date.now() - this.otpVerifiedAt.getTime() > otpVerificationWindow) {
      this.hasValidOtpForAction = false;
      this.otpVerifiedAt = null;
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;