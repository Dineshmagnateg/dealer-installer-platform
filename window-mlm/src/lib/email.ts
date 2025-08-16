import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail(to: string, subject: string, html: string) {
	if (!resend) return { skipped: true } as const;
	const from = process.env.RESEND_FROM_EMAIL as string;
	return await resend.emails.send({ from, to, subject, html });
}