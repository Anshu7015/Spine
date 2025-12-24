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
};

// 2. Send ManagerID and password to manager(After approving by the admin)
//This method of sending the credentials is temporary, we need another method to do this thing.

// services/email/managerCredentialsEmail.js
export async function managerCredentialsEmail(email, MID, tempPassword) {
  try {
    const subject = "Manager Account Approved";

    const text = `
Your manager account has been approved.

Manager ID: ${MID}
Temporary Password: ${tempPassword}

IMPORTANT:
- This password expires in 24 hours
- You MUST change it on first login
- Do NOT share these credentials
`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject,
      text,
    });

    console.log(`TEMP CREDS email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send manager credentials email", error);
    throw error;
  }
}

