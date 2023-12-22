import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { AGENT } from "./constants/roles"

export default withAuth(
  function middleware(request: NextRequestWithAuth) {

    if (request.nextUrl.pathname.startsWith("/dashboard")
      && request.nextauth.token?.role !== AGENT) {
      return NextResponse.rewrite(
        new URL("/denied", request.url)
      )
    }

    if (request.nextUrl.pathname.startsWith("/dashboard")
      && request.nextauth.token?.is_profile_complete === false) {
      const redirectURL = new URL("/account/profile", request.url);
      const params = new URLSearchParams({
        callbackUrl: "/dashboard",
        message: 'To continue, you need to complete your profile.',
        messageType: 'error'
      });
      redirectURL.search = params.toString();

      return NextResponse.redirect(redirectURL);
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

export const config = { matcher: ["/dashboard/:path*", "/account/:path*"] }