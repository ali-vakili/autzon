import { DefaultSession } from "next-auth";
import { sessionUser } from "./sessionUserType";

declare module 'next-auth' {
  interface Session {
    user: sessionUser & DefaultSession
  }
}