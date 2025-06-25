import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(
        credentials: Record<string, string> | undefined,
        _req: unknown
      ): Promise<any> {
        if (!credentials) {
          throw new Error("No credentials provided.");
        }

        const { identifier, password } = credentials;

        await connectDB();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });

          if (!user) {
            throw new Error("No user found with these credentials");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
          }

          const isPasswordMatch = await bcrypt.compare(password, user.password);

          if (isPasswordMatch) {
            return user;
          } else {
            throw new Error("Incorrect password. Please try again.");
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message || "Something went wrong.");
          }
          throw new Error("Something went wrong.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
