import nodemailer from "nodemailer";

// Log environment variables for debugging
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email with HTML content (for clickable links).
 * @param {string} email - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} htmlMessage - HTML content of the email
 */
const sendNotification = async (email, subject, htmlMessage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: htmlMessage, // Use HTML for clickable links
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendNotification;