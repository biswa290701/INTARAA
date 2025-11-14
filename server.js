const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb+srv://biswa290701:Biswa%406226@cluster0.evxomlf.mongodb.net/INTARAA",
  collection: "sessions"
});

store.on("error", function(error) {
  console.error("SESSION STORE ERROR:", error);
});

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://biswa290701:Biswa%406226@cluster0.evxomlf.mongodb.net/INTARAA?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: "supersecretintaraa123", // change to anything strong
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


// POST route for contact form
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  // 1. Create email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // you can also use Outlook, Yahoo, etc.
    auth: {
      user: "biswa290701@gmail.com",   // replace with your Gmail
      pass: "atcj zvgr seft cqba"      // NOT your Gmail password — see note below
    }
  });

  // 2. Set email content
  const mailOptions = {
    from: email,
    to: "biswa290701@gmail.com",      // where you want to receive messages
    subject: `New message from ${name}`,
    text: `You got a new message from:
Name: ${name}
Email: ${email}
Message: ${message}`
  };

  // 3. Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Something went wrong. Please try again later.");
    }
    console.log("Email sent: " + info.response);
    res.redirect('/thankyou.html');
  });
});

app.post("/demo", (req, res) => {
  const { name, email, company, role, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "biswa290701@gmail.com",
      pass: "atcj zvgr seft cqba"
    }
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
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Something went wrong. Please try again later.");
    }
    console.log("Demo Booking Email Sent: " + info.response);
    res.redirect("/thankyou.html");
  });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("❌ No account found with this email.");
    }

    // 2. Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send("❌ Incorrect password.");
    }

    console.log("User logged in:", email);

    // ⭐⭐⭐ STEP 5 — SAVE SESSION HERE ⭐⭐⭐
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log("SESSION CREATED:", req.session.user);
    console.log("FULL SESSION OBJECT:", req.session);

    // 3. Redirect after creating session
    return res.redirect("/index.html");

  } catch (err) {
    console.error(err);
    return res.status(500).send("❌ Something went wrong.");
  }
  console.log("SESSION CREATED:", req.session.user);
});


app.post("/signup", async (req, res) => {
  console.log("📩 SIGNUP ROUTE HIT");
  const { name, email, password, confirm } = req.body;

  if (password !== confirm) {
    return res.send("❌ Passwords do not match.");
  }

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.send("❌ Email is already registered.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    console.log("New user created:", email);

    // Redirect to Sign In page after successful sign-up
    res.redirect("/signin.html");

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Something went wrong.");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signin.html");
  });
});

app.get("/session-user", (req, res) => {
  if (req.session.user) {
    return res.json({
      loggedIn: true,
      name: req.session.user.name
    });
  }
  res.json({ loggedIn: false });
});


app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  console.log("Password reset requested for:", email);

  // TODO: Later: check if email exists in DB
  // TODO: Generate reset token
  // TODO: Send password reset email

  res.redirect("/thankyou.html");
});



app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
