import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

interface IfunctionInterface {
    email: string,
    username: string,
    verifyCode: string
}
export async function sendVerificationEmail({ email, username, verifyCode }: IfunctionInterface): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: "onboarding@resend.com",
            to: email,
            subject: "Mystry message Verify code",
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "Verificatoin email send successfully" }

    } catch (error) {
        console.log("Error sending while sending verificatoin email:", error);
        return { success: false, message: "Failed to send verification email" }
    }
}