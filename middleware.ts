import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    // Allow access for authenticated users
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow if user is logged in
    },
    pages: {
      signIn: "/sign-in", // redirect here if not authenticated
    },
  }
)

export const config = {
  matcher: [
    "/match/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/chat/:path*",
    "/profile/editprofile"
  ],
}
