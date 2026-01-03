import { Resend } from "resend";

export const createEmailTemplate = (title, content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BalanceIQ</h1>
        </div>
        <div class="content">
          <h2 style="color: #1f2937; margin-top: 0;">${title}</h2>
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} BalanceIQ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments,
  fromName = "BalanceIQ",
}) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    throw new Error("Email service not configured");
  }

  // Construct efficient HTML if not provided but text is
  const finalHtml =
    html || (text ? createEmailTemplate(subject, `<p>${text}</p>`) : null);

  try {
    const data = await resend.emails.send({
      from: `${fromName} <onboarding@resend.dev>`,
      to,
      subject,
      text,
      html: finalHtml,
      attachments,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
