/**
 * Server-side email provider wrapper
 * Supports multiple providers via EMAIL_PROVIDER env var
 * 
 * SECURITY: Only use in server contexts (API routes, scheduled functions)
 */

type EmailParams = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Send email via configured provider
 */
export async function sendEmail({ to, from, subject, text, html }: EmailParams): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase() || "resend";
  const apiKey = process.env.EMAIL_API_KEY;

  if (!apiKey) {
    throw new Error("EMAIL_API_KEY is not configured");
  }

  switch (provider) {
    case "resend":
      await sendViaResend({ to, from, subject, text, html }, apiKey);
      break;
    
    case "postmark":
      await sendViaPostmark({ to, from, subject, text, html }, apiKey);
      break;
    
    case "sendgrid":
      await sendViaSendGrid({ to, from, subject, text, html }, apiKey);
      break;
    
    default:
      throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`);
  }
}

/**
 * Resend.com implementation
 */
async function sendViaResend(params: EmailParams, apiKey: string): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} ${error}`);
  }
}

/**
 * Postmark implementation
 */
async function sendViaPostmark(params: EmailParams, apiKey: string): Promise<void> {
  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "X-Postmark-Server-Token": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      From: params.from,
      To: params.to,
      Subject: params.subject,
      TextBody: params.text,
      HtmlBody: params.html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Postmark API error: ${response.status} ${error}`);
  }
}

/**
 * SendGrid implementation
 */
async function sendViaSendGrid(params: EmailParams, apiKey: string): Promise<void> {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: params.to }] }],
      from: { email: params.from },
      subject: params.subject,
      content: [
        { type: "text/plain", value: params.text },
        ...(params.html ? [{ type: "text/html", value: params.html }] : []),
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${response.status} ${error}`);
  }
}
