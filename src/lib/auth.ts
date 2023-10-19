import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./connectDB";
import { verifyPassword } from "./hash";
import prisma from "./prisma";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECERET,
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password", placeholder: "••••••••" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
        }
        catch (error) {
          throw new Error("Something went wrong please try again later");
        }

        
        if (!credentials?.email || !credentials?.password || !credentials) {
          throw new Error("Please provide valid email and password")
        }
        console.log(credentials)

        const { email, password } = credentials;

        const existingAgent = await prisma.autoGalleryAgent.findUnique({
          where: { email: email }
        });

        if(!existingAgent) throw new Error("Email not found");

        if(!existingAgent.is_verified) throw new Error("Your email is not verified");

        const passwordMatch = await verifyPassword(password, existingAgent.password);

        if(!passwordMatch) throw new Error("Email or Password is wrong");

        return {
          id: `${existingAgent.id}`,
          email: existingAgent.email,
          role: existingAgent.role,
          is_verified: existingAgent.is_verified,
          is_subscribed: existingAgent.is_subscribed,
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, session}) {
      if (user) {
        return {
          ...token,
          ...user
        };
      }
      return token;
    },

    async session({ session, token, user }) {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            email: token.email,
            role: token.role,
            is_verified: token.is_verified,
            is_subscribed: token.is_subscribed
          }
        };
      }
      return session;
    }
  }
};