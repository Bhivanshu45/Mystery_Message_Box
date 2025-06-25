import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" },

            },
            async authorize(credentials: any): Promise<any>{
                // credentials.identifier.email will provide you the email
                await connectDB();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with these credentials");
                    }

                    // check if user is verified
                    if(!user.isVerified){
                        throw new Error("Please verify your email before logging in.");
                    }

                    const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordMatch){
                        return user;
                    }else{
                        throw new Error("InCorrect password. Please try again.");
                    }

                }catch(error: any){
                    throw new Error(error)
                }
                return null;
            }
        })
    ],
    callbacks: {
        // we can customize the callback types using next-auth.d.ts using the config
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }

            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session:{
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}