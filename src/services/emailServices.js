import dotenv from "dotenv";
import transporter from "../config/mailer.js";

dotenv.config();



// 🔹 Send OTP Email (Only for registration)
export async function sendOtpEmail(email, otp) {
  try {
    const subject = "Verify your account – OTP for registration";
    const textContent = `Your OTP for registration is ${otp}. It will expire in ${
      process.env.OTP_EXPIRY_MINUTES || 5
    } minutes.`;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `✅ OTP email sent to ${email} (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
}
