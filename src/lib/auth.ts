import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./connectDB";
import { verifyPassword } from "./hash";
import prisma from "./prisma";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jonDoe@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
        }
        catch (error){
          throw new Error("Something went wrong please try again later");
        }

        if (!credentials?.email || !credentials?.password || !credentials) {
          throw new Error("Please provide valid email and password")
        }

        const { email, password } = credentials;

        const existingAgent = await prisma.autoGalleryAgent.findUnique({
          where: { email: email }
        });

        console.log(existingAgent)

        if(!existingAgent) throw new Error("Email not found")

        const passwordMatch = await verifyPassword(password, existingAgent.password);

        if(!passwordMatch) throw new Error("Email or Password is wrong")

        return {
          id: `${existingAgent.id}`,
          email: existingAgent.email
        }
      },
    })
  ]
};