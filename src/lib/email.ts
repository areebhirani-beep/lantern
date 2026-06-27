import "server-only";

// ---------------------------------------------------------------------------
// Transactional email. OPTIONAL, like the rest of the auth stack: when
// RESEND_API_KEY is set we POST to the Resend REST API; when it isn't (local
// dev), we print a clearly-formatted block to the console with the subject and
// the magic link so verification/reset flows are fully exercisable without a
// key. Sends never throw in a way that breaks the calling route — we log and
// return { ok: false } instead.
// ---------------------------------------------------------------------------

const FROM = process.env.EMAIL_FROM || "Lantern <onboarding@resend.dev>";

/** Pull the first http(s) link out of an HTML body, for the dev console log. */
function firstLink(html: string): string | null {
  const m = html.match(/href="(https?:\/\/[^"]+)"/i);
  return m ? m[1] : null;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;

  // Dev fallback: no provider key, so surface the email in the server log.
  if (!key) {
    const link = firstLink(html);
    console.log(
      [
        "",
        "┌─ ✉  Lantern email (dev — no RESEND_API_KEY) ───────────────",
        `│ To:      ${to}`,
        `│ Subject: ${subject}`,
        link ? `│ Link:    ${link}` : "│ (no link in this email)",
        "└────────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend send failed (${res.status}): ${body}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send threw:", err);
    return { ok: false };
  }
}

// ---- On-brand HTML --------------------------------------------------------

/** Shared dark, lantern-amber shell. Inlined styles for email-client safety. */
function shell({
  heading,
  body,
  cta,
  link,
  footer,
}: {
  heading: string;
  body: string;
  cta: string;
  link: string;
  footer: string;
}): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background-color:#0a0908;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;">
      <tr>
        <td style="padding:0 0 24px 0;">
          <span style="display:inline-block;font-size:18px;font-weight:600;color:#f4eee3;letter-spacing:-0.01em;">
            <span style="color:#ffb454;">●</span>&nbsp; Lantern
          </span>
        </td>
      </tr>
      <tr>
        <td style="background:#100e0a;border:1px solid #2e2820;border-radius:18px;padding:32px;">
          <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.25;color:#f4eee3;font-weight:600;">${heading}</h1>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#c4bdb0;">${body}</p>
          <a href="${link}" style="display:inline-block;background:#ffb454;color:#0a0908;font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:999px;">${cta}</a>
          <p style="margin:24px 0 0 0;font-size:12px;line-height:1.6;color:#8b8475;">
            ${footer}<br />
            Or paste this link into your browser:<br />
            <span style="color:#8b8475;word-break:break-all;">${link}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 4px 0 4px;">
          <p style="margin:0;font-size:11px;line-height:1.6;color:#8b8475;">
            Carry the light of a language forward.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendVerificationEmail(to: string, link: string) {
  return sendEmail({
    to,
    subject: "Verify your email for Lantern",
    html: shell({
      heading: "Confirm your email",
      body: "Welcome to Lantern. Confirm this address to secure your account and keep your progress in sync across devices.",
      cta: "Verify email",
      link,
      footer: "This link expires in 24 hours. If you didn't create a Lantern account, you can safely ignore this email.",
    }),
  });
}

export async function sendResetEmail(to: string, link: string) {
  return sendEmail({
    to,
    subject: "Reset your Lantern password",
    html: shell({
      heading: "Reset your password",
      body: "We received a request to reset your Lantern password. Choose a new one with the button below.",
      cta: "Choose a new password",
      link,
      footer: "This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email — your password won't change.",
    }),
  });
}
