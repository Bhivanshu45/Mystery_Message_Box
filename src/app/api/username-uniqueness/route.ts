import connectDB from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { signUpSchema} from "@/schemas/signUpSchema";

export const GET = async(request: Request) => {
    await connectDB();
    
    try{
        const {searchParams} = new URL(request.url);

        const username = searchParams.get("username");

        if (!username || username.trim().length <= 2) {
          return Response.json({
            success: false,
            message: "Provide a username at least 2 characters long.",
          }, { status: 400 });
        }

        // check if user exists with this username
        const existingUsername = await UserModel.findOne({username,isVerified: true});
        if(existingUsername){
            return Response.json({
                success: false,
                message: "Username already taken. Try another"
            },{status: 409})
        }

        return Response.json({
            success: true,
            message: "Username is available.",
        },{status: 200})

    }catch(error){
        console.error("Error in checking username validation:", error);
        return Response.json({
            success: false,
            message: "Failed to check username uniqueness. Please try again later.",
        },{status: 500})
    }
}