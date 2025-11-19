const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "biswa290701@gmail.com",
    pass: "atcj zvgr seft cqba",
  },
});

exports.contactForm = (req, res) => {
  const { name, email, message } = req.body;

  transporter.sendMail(
    {
      from: email,
      to: "biswa290701@gmail.com",
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    },
    (err) => {
      if (err) return res.status(500).send("Something went wrong.");
      res.redirect("/thankyou.html");
    }
  );
};

exports.demoForm = (req, res) => {
  const { name, email, company, role, message } = req.body;

  transporter.sendMail(
    {
      from: email,
      to: "biswa290701@gmail.com",
      subject: `New Demo Booking From ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nRole: ${role}\nMessage: ${message}`,
    },
    (err) => {
      if (err) return res.status(500).send("Something went wrong.");
      res.redirect("/thankyou.html");
    }
  );
};
