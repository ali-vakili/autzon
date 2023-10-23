import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"

export default withAuth(
  function middleware(request: NextRequestWithAuth) {

    if (request.nextUrl.pathname.startsWith("/dashboard")
      && request.nextauth.token?.role !== Role.AGENT) {
      return NextResponse.rewrite(
        new URL("/", request.url)
      )
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/sign-in',
    }
  },
)

export const config = { matcher: ["/dashboard:path*"] }