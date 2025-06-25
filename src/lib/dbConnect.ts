import mongoose from "mongoose";

// check if the connection is already established
type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

// void means any data type can be returned
const connectDB = async () : Promise<void> => {
    if(connection.isConnected){
        console.log("Database is already connected");
        return;
    }else{
        try {
            const db = await mongoose.connect(process.env.MONGODB_URI || "");

            connection.isConnected = db.connections[0].readyState;

            console.log("DB connected successfully");

        } catch (error) {
            console.error("Database connection failed:", error);
            process.exit(1);
        }
    }
}

export default connectDB;