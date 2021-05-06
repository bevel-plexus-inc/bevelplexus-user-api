import crypto from "crypto";

export function getEmailVerificationUrl(email: string, otp: string): string {
    const { WEB_URL } = process.env;
    if (!WEB_URL) {
        throw new Error("Internal server error: environment setup");
    }

    return `${WEB_URL}/verify-email/${email}/${otp}`;
}

export function getHashOTP(otp: string): string {
    const md5sum = crypto.createHash("md5");

    return md5sum.update(otp).digest("hex");
}
