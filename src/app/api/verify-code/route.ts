import connectDB from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export const POST = async (req: Request) => {
    await connectDB();

    try{
        const {username, code} = await req.json();

        const  decodedUsername = decodeURIComponent(username);

        // zod validation
        const validateCode = verifySchema.safeParse({code});
        if(!validateCode.success){
            const codeErrors = validateCode.error.format().code?._errors || [];
            return Response.json({
                success: false,
                message: codeErrors.length > 0 ? codeErrors[0] : "Invalid verification code format.",
            }, { status: 400 });
        }

        console.log("Decoded Username:", decodedUsername);
        console.log("Verification Code:", code);

        // check if user exists with this username
        const user = await UserModel.findOne({username: decodedUsername, isVerified: false});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found or already verified.",
            }, { status: 404 });
        }

        //check if the code matches
        console.log("verifyCodeExpiry from DB:", user.verifyCodeExpiry);
        console.log("Current Time:", new Date());
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();

            console.log("User verified successfully:", user.username);

            return Response.json({
                success: true,
                message: "Account verified successfully.",
            },{status: 200})

        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired. Please request a new code.",
            }, { status: 410 });
        }

        return Response.json({
            success: false,
            message: isCodeValid ? "Verification code has expired. Please request a new code." : "Invalid verification code. Please signup again.",
        }, { status: 400 });

    }catch(error){
        console.error("Error in User", error);
        return Response.json({
            success: false,
            message: "Failed to verify code. Please try again.",
        }, { status: 500 });
    }
}