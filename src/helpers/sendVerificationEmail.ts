import { resend } from "@/lib/resend";
import { VerifyEmail } from "@/templates/VerifyEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
    email: string,
    username:string,
    verifyCode: string,
) : Promise<ApiResponse> => {
    try{
        const {data,error} = await resend.emails.send({
            from: 'Mystery Messaging <noreply@bhivanshu.me>',
            to: email,
            subject: 'Verify your email',
            react: VerifyEmail({username, otp:verifyCode})
        })

        

        return {
            success: true,
            message: "Verification email sent successfully.",
        }
    }catch(error){
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email. Please try again later.",
        };
    }
}