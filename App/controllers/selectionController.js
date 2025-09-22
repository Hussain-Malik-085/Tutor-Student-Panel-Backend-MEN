const User = require("../Models/Users");

let abc = async (req, res) => {
  try {
    const { role } = req.body;

    // Role validation
    if (!["student", "tutor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,   // URL param se id aayegi
      { role },        // role update
      { new: true }    // updated document return karega
    );

   if (!updatedUser) {
  return res.status(404).json({
    success: false,
    message: "User not found",
    user: null
  });
}

res.json({
  success: true,
  message: "Role updated successfully",
  user: updatedUser
});


    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating role", error: err.message });
  }
};

module.exports = { abc };
