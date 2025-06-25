import { Message } from "@/model/User";

// API response types for allrequired APIs

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}