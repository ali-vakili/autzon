import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";
import { Adapter } from "next-auth/adapters";
import { connectDB } from "./connectDB";
import { verifyPassword } from "./hash";
import { USER } from "@/constants/roles";
import prisma from "./prisma";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      profile: async (profile: GoogleProfile) => {
        let imageUrl = null
        if (profile.picture) {
          const agentImage = await prisma.image.create({
            data: {
              agent_id: profile.sub,
              url: profile.image,
            },
          })
          imageUrl = agentImage.url
        }
        return {
          ...profile,
          id: profile.sub,
          role: profile.role ?? USER,
          profile: imageUrl,
          firstName: profile.given_name,
          lastName: profile.family_name,
          is_verified: profile.email_verified,
        }
      },
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
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

        const { email, password } = credentials;

        const existingAgent = await prisma.autoGalleryAgent.findUnique({
          where: { email: email }
        });

        if(!existingAgent) throw new Error("Email not found");

        if(!existingAgent.is_verified) throw new Error("Your email is not verified");

        if (existingAgent.password) {
          const passwordMatch = await verifyPassword(password, existingAgent.password);
          if(!passwordMatch) throw new Error("Email or Password is wrong");
        }

        const userImage = await prisma.image.findUnique({
          where: { agent_id: existingAgent.id }
        })

        let userCity = null

        if (existingAgent.city_id){
          userCity = await prisma.city.findFirst({
            where: { id: existingAgent.city_id },
            select: {
              id: true,
              name_en: true,
              latitude: true,
              longitude: true,
              province: {
                select: {
                  id: true,
                  name_en: true,
                  latitude: true,
                  longitude: true
                }
              }
            }
          })
        }
        
        return {
          id: `${existingAgent.id}`,
          email: existingAgent.email,
          firstName: existingAgent.firstName,
          lastName: existingAgent.lastName,
          profile: userImage?.url ?? null,
          role: existingAgent.role,
          city: userCity,
          is_verified: existingAgent.is_verified,
          is_subscribed: existingAgent.is_subscribed,
          is_profile_complete: existingAgent.is_profile_complete,
          join_date: existingAgent.join_date,
          updatedAt: existingAgent.updatedAt
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        return {
          ...token,
          ...user
        };
      }

      if (trigger === "update") {
        return { ...token, ...session.user }
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
            firstName: token.firstName,
            lastName: token.lastName,
            profile: token.profile,
            role: token.role,
            city: token.city,
            is_verified: token.is_verified,
            is_subscribed: token.is_subscribed,
            is_profile_complete: token.is_profile_complete,
            join_date: token.join_date,
            updatedAt: token.updatedAt
          }
        };
      }
      return session;
    }
  }
};