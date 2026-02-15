require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `Portfolio Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

    res.status(200).json({ success: true });

  } catch (error) {
    console.log("MAIL ERROR:", error);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
