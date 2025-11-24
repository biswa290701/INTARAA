import dotenv from "dotenv";
import User from "../models/User.js";
import { randomBytes } from "crypto";
import { createTransport } from "nodemailer";
import { hash } from "bcrypt";

dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "No account found with this email." });

    const token = randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const link = `${req.protocol}://${req.get("host")}/reset_password.html?token=${token}`;

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
}

export async function resetPassword(req, res) {
  const { token, password, confirm } = req.body;

  try {
    if (password !== confirm)
      return res.status(400).json({ error: "Passwords do not match." });

    const user = await findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired link." });

    user.password = await hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
