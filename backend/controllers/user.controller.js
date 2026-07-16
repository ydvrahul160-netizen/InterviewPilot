import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("UserId:", req.userId);
    const user = await User.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(400).json({ message: "user dose not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `faild to get current user ${error}`, });
  }
};
