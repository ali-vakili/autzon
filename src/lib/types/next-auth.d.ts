import { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      image: string | null;
      role: string;
      is_verified: boolean;
      is_subscribed: boolean;
      is_profile_complete: boolean;
    } & DefaultSession
  }
}