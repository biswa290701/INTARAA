const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "biswa290701@gmail.com",
    pass: "atcj zvgr seft cqba",
  },
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "No account found with this email." });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const link = `http://localhost:3000/reset_password.html?token=${token}`;

    await transporter.sendMail({
      from: "INTARAA Support <noreply@intaraa.com>",
      to: email,
      subject: "Password Reset Request",
      text: `Click the link below to reset your password:\n${link}`,
    });

    res.json({ success: true, message: "Reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password, confirm } = req.body;

  try {
    if (password !== confirm)
      return res.status(400).json({ error: "Passwords do not match." });

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired link." });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};
