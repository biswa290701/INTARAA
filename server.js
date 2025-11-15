const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const crypto = require("crypto");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb+srv://biswa290701:Biswa%406226@cluster0.evxomlf.mongodb.net/INTARAA",
  collection: "sessions"
});

store.on("error", function (error) {
  console.error("SESSION STORE ERROR:", error);
});

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://biswa290701:Biswa%406226@cluster0.evxomlf.mongodb.net/INTARAA?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

//Middleware
// Unity MIME types for ALL builds in ANY folder
app.use((req, res, next) => {
  if (req.url.endsWith(".unityweb")) {
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Encoding", "identity"); // IMPORTANT
  }
  if (req.url.endsWith(".wasm")) {
    res.setHeader("Content-Type", "application/wasm");
    res.setHeader("Content-Encoding", "identity");
  }
  next();
});



app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "supersecretintaraa123", // change to env variable later
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// CONTACT ROUTE
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "biswa290701@gmail.com",
      pass: "atcj zvgr seft cqba",
    },
  });

  const mailOptions = {
    from: email,
    to: "biswa290701@gmail.com",
    subject: `New message from ${name}`,
    text: `You got a new message from:
    Name: ${name}
    Email: ${email}
    Message: ${message}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Something went wrong.");
    }
    return res.redirect("/thankyou.html");
  });
});

// DEMO BOOKING
app.post("/demo", (req, res) => {
  const { name, email, company, role, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "biswa290701@gmail.com",
      pass: "atcj zvgr seft cqba",
    },
  });

  const mailOptions = {
    from: email,
    to: "biswa290701@gmail.com",
    subject: `New Demo Booking From ${name}`,
    text: `
    New Demo Booking:

    Name: ${name}
    Email: ${email}
    Company: ${company}
    Role: ${role}
    Message: ${message}
        `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Something went wrong.");
    }
    res.redirect("/thankyou.html");
  });
});

// SIGN IN
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "No account found with this email." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password." });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.json({
      success: true,
      redirect: "/index.html",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// SIGN UP
app.post("/signup", async (req, res) => {
  const { name, email, password, confirm } = req.body;

  if (password !== confirm) {
    return res.status(400).send("Passwords do not match.");
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send("Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signin.html");
  });
});

// SESSION STATUS
app.get("/session-user", (req, res) => {
  if (req.session.user) {
    return res.json({
      loggedIn: true,
      name: req.session.user.name,
    });
  }
  res.json({ loggedIn: false });
});

// FORGOT PASSWORD
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "No account found with this email." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `http://localhost:3000/reset_password.html?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "biswa290701@gmail.com",
        pass: "atcj zvgr seft cqba",
      },
    });

    const mailOptions = {
      from: "INTARAA Support <noreply@intaraa.com>",
      to: email,
      subject: "Password Reset Request",
      text: `Click the link below to reset your password.\nThis link is valid for 15 minutes.\n\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Reset link sent to your email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  const { token, password, confirm } = req.body;

  try {
    if (password !== confirm) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// START SERVER
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));