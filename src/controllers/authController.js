import User from "../models/User.js";
import { compare, hash } from "bcrypt";

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "No account found with this email." });

    const match = await compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Incorrect password." });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.json({
      success: true,
      userId: user._id,
      redirect: "/index.html",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
}

export async function signUp(req, res) {
  const { name, email, password, confirm } = req.body;

  if (password !== confirm)
    return res.status(400).send("Passwords do not match.");

  try {
    const existing = await findOne({ email });
    if (existing) return res.status(400).send("Email is already registered.");

    const hashedPassword = await hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.redirect("/signin.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/signin.html");
  });
}
