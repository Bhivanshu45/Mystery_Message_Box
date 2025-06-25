import { getServerSession, User } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

// POST request for update isAccepting Message status
export const POST = async (req: Request) => {
    await connectDB();
    const session = await getServerSession(authOptions);

    const user = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized User"
        },{status: 401});
    }

    const userId = user._id;
    const {acceptMessage} = await req.json();
    
    try{
        const updatedUser =await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessage}, {new: true});
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }

        return Response.json({
            success: true,
            message: "User acceptance status updated successfully",
            user: updatedUser
        }, {status: 200});

    }catch(error){
        console.error("Error updating user acceptance status:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500});
    }


}

// GET request for checking isAccepting Message status
export const GET = async () => {
    await connectDB();
    const session = await getServerSession(authOptions);

    const user = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized User"
        },{status: 401});
    }

    const userId = user._id;
    try{
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }

        return Response.json({
            success: true,
            message: "User acceptance status fetched successfully",
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, {status: 200});

    }catch(error){
        console.error("Error fetching user acceptance status:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500});
    }
}