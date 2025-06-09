import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text }) {
    console.log(process.env.GMAIL_USER)
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.GMAIL_HOST,
      port: process.env.GMAIL_PORT,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `JobiVerse.co`,
      to,
      subject,
      text,
    });

    // console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
