import User from "../../models/Users.js";

export const updateProfile = async (req, res) => {
  try {
    const { fullName, nickname, avatar } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (nickname) user.nickname = nickname;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    // Return the updated user profile (excluding password)
    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userObject,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};
