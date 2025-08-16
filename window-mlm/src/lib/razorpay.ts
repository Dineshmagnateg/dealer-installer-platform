import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpay() {
	const key_id = process.env.RAZORPAY_KEY_ID as string;
	const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
	return new Razorpay({ key_id, key_secret });
}

export function verifyWebhookSignature(body: string, signature: string) {
	const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
	const expected = crypto
		.createHmac("sha256", secret)
		.update(body)
		.digest("hex");
	return expected === signature;
}