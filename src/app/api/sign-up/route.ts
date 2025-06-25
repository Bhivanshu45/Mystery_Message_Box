import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import connectDB from "@/lib/dbConnect"
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

// signup api route handler
export const POST = async(request: Request) => {
    await connectDB();
    try{
        const {username,email,password} = await request.json();

        // zod validation can be done here

        // check if user exists with this username
        const existingUsername = await UserModel.findOne({username,isVerified: true});
        if(existingUsername){
            return  Response.json({
                success: false,
                message: "Username already exists. Please choose a different username.",
            },{status: 409})
        }

        // check if user exists with this email
        const existingEmail = await UserModel.findOne({email});    

        // generate a random verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        // if user exists with this email then we have two conditions to check , he is verified or not i.e. (isVerified)
        if(existingEmail){
            if(existingEmail.isVerified){ // email exists and verified
                return Response.json({
                    success: false,
                    message: "Email already exists. Please choose a different email.",
                },{status: 409})

            }else{ // email exist but not verified

                const hashedPassword = await bcrypt.hash(password,10);

                // update the existing user with new  credentials
                existingEmail.password = hashedPassword;
                existingEmail.verifyCode = verifyCode;
                existingEmail.verifyCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);
                existingEmail.isVerified = false;

                await existingEmail.save();
                // now send verification email

            }
        }else{
            // if email not exists then we can create a new user
            const hashedPassword = await bcrypt.hash(password,10)

            // keep 30 min expiry for verification code
            const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })

            await newUser.save();
            // now send verificatin email

        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,
            },{status: 500})
        }

        // return success response
        return Response.json({
            success: true,
            message: "User registered successfully. Please check your email for verification code.",
        },{status: 201})

    }catch(error){
        console.error("Error in Registering User", error);
        return Response.json({
            success: false,
            message: "Failed to register user. Please try again later.",
        },{status: 500})
    }
}