/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Returns `true` when Turnstile is not configured (feature disabled),
 * so the contact form still works without a CAPTCHA.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // disabled

  if (!token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    },
  );

  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
