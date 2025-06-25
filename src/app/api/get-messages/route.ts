import connectDB from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export const GET = async () => {
    await connectDB();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    // console.log("Session User:", user);

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized User"
        }, { status: 401 });
    }

    const userId = user._id;

    // console.log("Fetching messages for user:", userId);
    try{
        // using aggregation pipeline to fetch respective message in object format
        const userData = await UserModel.findById(userId ).select('messages');

        // console.log("Fetched User data:", userData);

        const userMessages = userData?.messages || [];

        if(!userMessages || userMessages.length === 0){
            return Response.json({
                success: false,
                message: "No Messages found for this user"
            }, { status: 404 });
        }

        // console.log("Fetched User messages:", userMessages);

        return Response.json({
            success: true,
            message: "Messages fetched successfully",
            messages: userMessages
        }, { status: 200 });

    }catch(error){
        console.error("Error fetching messages:", error);
        return Response.json({
            success: false,
            message: "Error in fetching messages"
        }, { status: 500 });
    }
    
}