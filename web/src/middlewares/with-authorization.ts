import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./types";

const protectedRoutes = ["/dashboard"];

const unauthenticatedRoutes = ["/auth"];

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // redirect if user is not authenticated and is in a protected route
      if (protectedRoutes.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (token) {
      // redirect if user is authenticated
      if (unauthenticatedRoutes.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return next(request, _next);
  };
};
