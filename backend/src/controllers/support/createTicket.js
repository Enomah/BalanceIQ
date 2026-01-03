import SupportTicket from "../../models/SupportTicket.js";
import { Resend } from "resend";

const createTicket = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { subject, category, message } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;
    const nickname = req.user.nickname;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required" });
    }

    const newTicket = new SupportTicket({
      userId,
      subject,
      category,
      message,
    });

    await newTicket.save();

    // Send confirmation email to user
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "BalanceIQ Support <onboarding@resend.dev>",
          to: userEmail,
          subject: `Support Ticket Received: ${subject}`,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: #007bff; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Support Ticket Received</h1>
            </div>
            <div style="padding: 30px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Hello ${nickname},</p>
              <p>We've received your support ticket regarding <strong>"${subject}"</strong>. Our team has been notified and will review your request as soon as possible.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #6c757d;"><strong>Ticket Details:</strong></p>
                <p style="margin: 10px 0 5px 0; font-size: 14px;"><strong>Category:</strong> ${category}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Ticket ID:</strong> ${newTicket._id}</p>
              </div>

              <p>You don't need to do anything else for now. We'll reach out to this email address if we need more information.</p>
              
              <p style="margin-top: 30px;">Best regards,<br/>The BalanceIQ Support Team</p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #adb5bd;">
              <p>© 2026 BalanceIQ. All rights reserved.</p>
            </div>
          </div>`,
        });
        console.log(`Confirmation email sent to ${userEmail}`);
      } catch (emailError) {
        // We don't want to fail the whole request if the email fails, but we should log it
        console.error("Error sending support confirmation email:", emailError);
      }
    }

    res.status(201).json({
      message:
        "Support ticket created successfully. A confirmation email has been sent.",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createTicket;
