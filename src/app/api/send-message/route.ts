import connectDB from "@/lib/dbConnect"
import UserModel, { Message } from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";

export const POST = async(req: Request) => {
    await connectDB();

    // as anyone can send messages so no need to check session

    const { username, content } = await req.json();

    console.log("Received data:", { username, content });

    // validate the input using zod
    const validation = messageSchema.safeParse({ content });
    if (!validation.success) {
        return Response.json({
            success: false,
            message: "Invalid input type or missing fields"
        }, { status: 400 });
    }

    try{
        const user = await UserModel.findOne({ username, isVerified: true });
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404});
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages at the moment"
            },{status: 403});
        }

        // create a new message and also update the user's messages array
        const newMessage = {
            content,
            createdAt: new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();

        // return response
        return Response.json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        }, { status: 200 });

    }catch(error){
        console.error("Error sending message:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
    
}