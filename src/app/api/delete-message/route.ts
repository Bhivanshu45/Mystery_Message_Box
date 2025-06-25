import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export const DELETE = async (req: Request) => {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized User"
        }, { status: 401 });
    }

    // Extract messageId from query parameters
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    if (!messageId) {
        return Response.json({
            success: false,
            message: "Message ID is required"
        }, { status: 400 });
    }

    const userId = session.user._id;

    try{
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Check if the message exists in the user's messages
        foundUser.messages = foundUser.messages.filter((message) => message._id.toString() !== messageId);

        await foundUser.save();
        
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });

    }catch(error){
        console.error("Error deleting message:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}