import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * Sends a notification email for a new contact-form submission.
 * Falls back to console logging when RESEND_API_KEY is not configured,
 * so local development works without an email provider.
 */
export async function sendContactNotification(payload: ContactPayload) {
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; line-height:1.6;">
      <h2 style="margin:0 0 12px;">New portfolio message</h2>
      <p><strong>From:</strong> ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt;</p>
      <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
      <p style="white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
    </div>
  `;

  if (!resend || !to) {
    console.info("[email] Contact notification (dry-run — no RESEND_API_KEY):", payload);
    return { delivered: false as const };
  }

  await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject: `[Portfolio] ${payload.subject}`,
    html,
  });

  return { delivered: true as const };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
