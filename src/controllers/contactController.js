import dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function contactForm(req, res) {
  const { name, email, message } = req.body;

  transporter.sendMail(
    {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    },
    (err) => {
      if (err) return res.status(500).send("Something went wrong.");
      res.redirect("/thankyou.html");
    }
  );
}

export function demoForm(req, res) {
  const { name, email, company, role, message } = req.body;

  transporter.sendMail(
    {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Demo Booking From ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nRole: ${role}\nMessage: ${message}`,
    },
    (err) => {
      if (err) return res.status(500).send("Something went wrong.");
      res.redirect("/thankyou.html");
    }
  );
}
