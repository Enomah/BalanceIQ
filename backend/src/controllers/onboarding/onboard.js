import User from "../../models/Users.js";
import Goal from "../../models/Goals.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const onboard = async (req, res) => {
  try {
    const {
      currency,
      monthlyIncome,
      incomeSource,
      primaryGoal,
      targetAmount,
      targetDate,
      spendingCategories,
      budgetingStyle,
    } = req.body;

    let avatarUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      avatarUrl = result.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }

    let categories = [];
    if (spendingCategories) {
      try {
        categories = JSON.parse(spendingCategories);
      } catch (err) {
        console.error("Failed to parse spendingCategories:", err);
        categories = [];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: avatarUrl,
        currency,
        monthlyIncome,
        incomeSource,
        spendingCategories: categories,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const goal = await Goal.create({
      userId: req.user.id,
      title: primaryGoal,
      targetAmount,
      targetDate,
      budgetingStyle,
      currentAmount: 0,
      progress: 0,
      status: "active",
    });

    return res.json({
      message: "Onboarding successful",
      proceed: true,
      user: updatedUser,
      goal,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({ message: "Onboarding failed", error });
  }
};
