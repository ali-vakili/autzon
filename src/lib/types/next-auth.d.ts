import { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
      is_verified: boolean;
      is_subscribed: boolean;
    } & DefaultSession
  }
}