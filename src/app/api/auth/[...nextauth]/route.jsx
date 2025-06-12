import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import Auth from "@/models/auth";
import { compare } from "bcryptjs";
import { userAgentFromString } from "next/server";

export const authOptions = {
  adapter: MongoDBAdapter(connectDB()),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "candidate",
          isFirstLogin: true
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        
      },
      async authorize(credentials) {
        try {
          await connectDB();
          console.log(credentials);
          const user = await Auth.findOne({ email: credentials?.email }).select("+isFirstLogin");
          console.log(user)
          if (!user) throw new Error("User not found");
          if (!user.password) throw new Error("Invalid login method");

         const isPasswordValid = await user.comparePassword(credentials.password);
         console.log(isPasswordValid)
          
          if (!isPasswordValid) throw new Error("Invalid password");

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isFirstLogin: user.isFirstLogin, 
          };
        } catch (error) {

          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    console.log(user)
    if (user) {
      token.role = user.role;
      token.id = user.id;
      token.isFirstLogin = user.isFirstLogin; // Add this line
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.isFirstLogin = token.isFirstLogin; // Add this line
    }
    return session;
  },
},
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };