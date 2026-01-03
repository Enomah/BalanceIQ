import User from "../../models/Users.js";

export const updateSettings = async (req, res) => {
  try {
    const { currency, monthlyIncome, incomeSource } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currency) user.currency = currency;
    if (monthlyIncome !== undefined) user.monthlyIncome = monthlyIncome;
    if (incomeSource) user.incomeSource = incomeSource;

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      message: "Settings updated successfully",
      user: userObject,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res
      .status(500)
      .json({ message: "Failed to update settings", error: error.message });
  }
};
