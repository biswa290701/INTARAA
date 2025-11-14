const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  console.log("User attempting login:", email);

  // For now, just redirect
  res.redirect("/thankyou.html");
});

app.post("/signup", (req, res) => {
  const { name, email, password, confirm } = req.body;

  // Simple validation
  if (password !== confirm) {
    return res.send("Passwords do not match.");
  }

  console.log("New user signed up:", email);

  // For now, just redirect
  res.redirect("/thankyou.html");
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
