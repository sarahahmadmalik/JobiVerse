import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import Auth from "@/models/auth";
import Recruiter from "@/models/recruiter";
import Candidate from "@/models/candidate";
import { compare } from "bcryptjs";

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
          const user = await Auth.findOne({ email: credentials?.email }).select("+isFirstLogin");
          
          if (!user) throw new Error("User not found");
          if (!user.password) throw new Error("Invalid login method");

          const isPasswordValid = await user.comparePassword(credentials.password);
          if (!isPasswordValid) throw new Error("Invalid password");

          let name = user.name;
          let image = null;
          
          if (user.role === "recruiter") {
            const recruiter = await Recruiter.findOne({ authId: user._id });
            name = recruiter?.company?.name || user.name;
            image = recruiter?.company?.logo || null;
          } else if (user.role === "candidate") {
            const candidate = await Candidate.findOne({ authId: user._id });
            name = candidate?.name || user.name;
            image = candidate?.profilePicture || null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: name,
            image: image,
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
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.isFirstLogin = user.isFirstLogin;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.isFirstLogin = token.isFirstLogin;
        session.user.image = token.image;

        try {
          await connectDB();
          if (token.role === "recruiter") {
            const recruiter = await Recruiter.findOne({ authId: token.id });
            if (recruiter) {
              session.user.name = recruiter.company?.name || session.user.name;
              session.user.image = recruiter.company?.logo || session.user.image;
            }
          } else if (token.role === "candidate") {
            const candidate = await Candidate.findOne({ authId: token.id });
            if (candidate) {
              session.user.name = `${candidate.firstName} ${candidate.lastName}` || session.user.name;
              session.user.image = candidate.profilePicture || session.user.image;
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Fall back to existing session values if there's an error
        }
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